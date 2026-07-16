import os

# Menonaktifkan dukungan Xet untuk menghindari error 401 saat download model Whisper
os.environ["HF_HUB_DISABLE_XET_SUPPORT"] = "1"
os.environ["HF_HUB_ENABLE_XET_FETCH"] = "0"
os.environ["HF_HUB_DISABLE_XET"] = "1"

from fastapi import FastAPI, UploadFile, File, HTTPException, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from faster_whisper import WhisperModel
from deep_translator import GoogleTranslator
import shutil
import os
import uuid
import json
import subprocess
import imageio_ffmpeg
import torch
import threading
import re

# Menyiapkan FFmpeg dan ffprobe lokal
ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
ffprobe_path = os.path.join(os.path.dirname(ffmpeg_path), "ffprobe.exe")
if not os.path.exists(ffprobe_path):
    ffprobe_path = "ffprobe" # Fallback ke system path

local_ffmpeg = os.path.join(os.getcwd(), "ffmpeg.exe")
if not os.path.exists(local_ffmpeg):
    try:
        shutil.copy(ffmpeg_path, local_ffmpeg)
    except:
        local_ffmpeg = ffmpeg_path

os.environ["PATH"] += os.pathsep + os.getcwd()

# Deteksi perangkat untuk AI (GPU jika tersedia)
device = "cuda" if torch.cuda.is_available() else "cpu"
compute_type = "float16" if device == "cuda" else "int8"
cpu_threads = os.cpu_count() or 4

print(f"AI Device: {device.upper()} | Compute: {compute_type} | Threads: {cpu_threads}")

# Membersihkan folder temp secara otomatis saat server baru dinyalakan
@asynccontextmanager
async def lifespan(app: FastAPI):
    os.makedirs("temp", exist_ok=True)
    os.makedirs("public", exist_ok=True)
    print("Membersihkan folder temp...")
    for file in os.listdir("temp"):
        file_path = os.path.join("temp", file)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
        except Exception as e:
            print(f"Gagal menghapus file temp {file_path}: {e}")
    yield

app = FastAPI(lifespan=lifespan)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Endpoints
@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Backend berjalan dengan baik"}

# Cache Model Whisper & Task Dictionary
active_model_info = {"size": None, "model": None}
ai_lock = threading.Lock()

tasks = {}
export_files = {}
time_regex = re.compile(r"time=(\d+):(\d+):(\d+\.\d+)")

def get_whisper_model(model_size: str):
    allowed_models = ["tiny", "base", "small", "medium", "large"]
    if model_size not in allowed_models:
        model_size = "base"
        
    if active_model_info["size"] != model_size:
        if active_model_info["model"] is not None:
            print(f"Menghapus model '{active_model_info['size']}' dari memori...")
            del active_model_info["model"]
            import gc
            gc.collect()
            
        print(f"Loading Whisper model '{model_size}'...")
        active_model_info["model"] = WhisperModel(
            model_size, 
            device=device, 
            compute_type=compute_type,
            cpu_threads=cpu_threads,
            num_workers=1
        )
        active_model_info["size"] = model_size
        print(f"Whisper model '{model_size}' berhasil dimuat!")
        
    return active_model_info["model"]

# Preload default model
get_whisper_model("base")

def cleanup_files(*file_paths):
    for path in file_paths:
        try:
            if path and os.path.exists(path):
                os.remove(path)
        except:
            pass

def process_generate(task_id: str, temp_video_path: str, model_size: str, task: str):
    try:
        tasks[task_id]["progress"] = 2
        tasks[task_id]["message"] = "Menunggu antrean AI..."
        
        with ai_lock:
            tasks[task_id]["progress"] = 5
            tasks[task_id]["message"] = "Memuat model AI ke memori..."
            model = get_whisper_model(model_size)
            
            whisper_task = "translate" if task == "en" else "transcribe"
            
            tasks[task_id]["progress"] = 10
            tasks[task_id]["message"] = "Memulai transkripsi..."
            
            result_segments, info = model.transcribe(
                temp_video_path, 
                beam_size=1,
                best_of=1,
                temperature=0,
                condition_on_previous_text=False,
                task=whisper_task,
                vad_filter=True,
                word_timestamps=True
            )
            
            raw_subtitles = []
            for segment in result_segments:
                if segment.words:
                    for word in segment.words:
                        raw_subtitles.append({
                            "start": word.start,
                            "end": word.end,
                            "text": word.word.strip()
                        })
                else:
                    raw_subtitles.append({
                        "start": segment.start,
                        "end": segment.end,
                        "text": segment.text.strip()
                    })

                if info.duration > 0:
                    prog_percent = min(100, int((segment.end / info.duration) * 100))
                    mapped_progress = 10 + int(prog_percent * 0.85)
                    tasks[task_id]["progress"] = mapped_progress
                    tasks[task_id]["message"] = "Mentranskripsi video..."
            
        # Translation logic disabled for word-level to maintain timing accuracy
        # (Optional: can be re-added if batch translated, but usually not ideal for word-by-word)

        tasks[task_id]["progress"] = 100
        tasks[task_id]["status"] = "completed"
        tasks[task_id]["result"] = raw_subtitles
    except Exception as e:
        tasks[task_id]["status"] = "error"
        tasks[task_id]["error"] = str(e)
    finally:
        cleanup_files(temp_video_path)

@app.post("/api/generate")
def generate_subtitles(
    background_tasks: BackgroundTasks,
    video: UploadFile = File(...), 
    model_size: str = Form("base"),
    task: str = Form("transcribe")
):
    if not video.filename:
        raise HTTPException(status_code=400, detail="Tidak ada file")
        
    allowed_exts = {".mp4", ".webm", ".ogg", ".mov", ".mkv", ".avi", ".wmv", ".flv"}
    ext = os.path.splitext(video.filename)[1].lower()
    if ext not in allowed_exts:
        raise HTTPException(status_code=400, detail="Ekstensi file tidak didukung. Harap gunakan format video.")
        
    if not video.content_type or not video.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="File yang diunggah bukan file video yang valid.")
    
    file_id = str(uuid.uuid4())
    ext = os.path.splitext(video.filename)[1]
    temp_video_path = f"temp/{file_id}{ext}"
    
    MAX_FILE_SIZE = 125 * 1024 * 1024
    file_size = 0
    
    try:
        with open(temp_video_path, "wb") as buffer:
            while chunk := video.file.read(8192):
                file_size += len(chunk)
                if file_size > MAX_FILE_SIZE:
                    raise HTTPException(status_code=413, detail="File terlalu besar (Maks 125MB)")
                buffer.write(chunk)
    except Exception as e:
        cleanup_files(temp_video_path)
        raise e
            
    tasks[file_id] = {"status": "processing", "progress": 0, "message": "Mengunggah video...", "type": "generate", "result": None, "error": None}
    background_tasks.add_task(process_generate, file_id, temp_video_path, model_size, task)
    return {"task_id": file_id}

def format_timestamp(seconds):
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int((seconds % 1) * 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

def process_export(task_id: str, temp_video_path: str, srt_path: str, output_video_path: str, styles: dict, video_filename: str, safe_srt_path: str, style_str: str):
    try:
        probe_cmd = [ffprobe_path, "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", temp_video_path]
        dur_res = subprocess.run(probe_cmd, capture_output=True, text=True)
        try:
            duration = float(dur_res.stdout.strip())
        except:
            duration = 1.0

        cmd = [
            local_ffmpeg, "-y", 
            "-i", temp_video_path, 
            "-vf", f"subtitles='{safe_srt_path}':force_style='{style_str}'", 
            "-c:v", "libx264", 
            "-crf", "18", 
            "-preset", "fast", 
            "-c:a", "copy", 
            output_video_path
        ]
        process = subprocess.Popen(cmd, stderr=subprocess.PIPE, universal_newlines=True, encoding="utf-8")
        
        for line in process.stderr:
            match = time_regex.search(line)
            if match:
                h = int(match.group(1))
                m = int(match.group(2))
                s = float(match.group(3))
                current_time = h * 3600 + m * 60 + s
                progress = min(99, int((current_time / duration) * 100))
                tasks[task_id]["progress"] = progress
                tasks[task_id]["message"] = "Merender video..."
                
        process.wait()
        if process.returncode != 0:
            raise Exception("Gagal merender video dengan FFmpeg")
            
        export_files[task_id] = {
            "path": output_video_path,
            "filename": f"Hardsub_{video_filename}"
        }
        
        tasks[task_id]["progress"] = 100
        tasks[task_id]["status"] = "completed"
        tasks[task_id]["result"] = f"/api/download/{task_id}"
        cleanup_files(temp_video_path, srt_path)
    except Exception as e:
        cleanup_files(temp_video_path, srt_path, output_video_path)
        tasks[task_id]["status"] = "error"
        tasks[task_id]["error"] = str(e)

@app.post("/api/export")
def export_video(
    background_tasks: BackgroundTasks,
    video: UploadFile = File(...),
    subtitles_json: str = Form(...),
    styles_json: str = Form(None)
):
    try:
        subtitles = json.loads(subtitles_json)
        styles = json.loads(styles_json) if styles_json else {
            "fontSize": 24, "fontColor": "#ffffff", "bgColor": "#000000", "bgOpacity": 0.5, "positionY": 10
        }
    except:
        raise HTTPException(status_code=400, detail="Data JSON rusak")
        
    if not video.filename:
        raise HTTPException(status_code=400, detail="Tidak ada file")
        
    allowed_exts = {".mp4", ".webm", ".ogg", ".mov", ".mkv", ".avi", ".wmv", ".flv"}
    ext = os.path.splitext(video.filename)[1].lower()
    if ext not in allowed_exts:
        raise HTTPException(status_code=400, detail="Ekstensi file tidak didukung. Harap gunakan format video.")
        
    if not video.content_type or not video.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="File yang diunggah bukan file video yang valid.")
        
    file_id = str(uuid.uuid4())
    ext = os.path.splitext(video.filename)[1]
    temp_video_path = f"temp/{file_id}_input{ext}"
    srt_path = f"temp/{file_id}.srt"
    output_video_path = f"temp/{file_id}_out{ext}"
    
    try:
        with open(temp_video_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)
            
        with open(srt_path, "w", encoding="utf-8") as f:
            for idx, sub in enumerate(subtitles, start=1):
                f.write(f"{idx}\n{format_timestamp(sub['start'])} --> {format_timestamp(sub['end'])}\n{sub['text']}\n\n")

        video_height = 720
        probe_cmd = [ffprobe_path, "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=height", "-of", "json", temp_video_path]
        probe_res = subprocess.run(probe_cmd, capture_output=True, text=True)
        if probe_res.returncode == 0:
            probe_data = json.loads(probe_res.stdout)
            if "streams" in probe_data:
                video_height = int(probe_data["streams"][0].get("height", 720))

        scaled_font_size = int((float(styles["fontSize"]) / 500.0) * video_height)
        
        def hex_to_ass(hex_color):
            hex_color = hex_color.lstrip('#')
            if len(hex_color) == 6:
                r, g, b = hex_color[0:2], hex_color[2:4], hex_color[4:6]
                return f"&H{b}{g}{r}"
            return "&HFFFFFF"

        primary_color = hex_to_ass(styles["fontColor"])
        margin_v = int((float(styles["positionY"]) / 100.0) * video_height)
        
        abs_srt_path = os.path.abspath(srt_path).replace("\\", "/")
        if ":" in abs_srt_path:
            drive, path = abs_srt_path.split(":", 1)
            safe_srt_path = f"{drive}\\:{path}"
        else:
            safe_srt_path = abs_srt_path

        style_str = f"FontSize={scaled_font_size},PrimaryColour={primary_color},Alignment=2,MarginV={margin_v},Outline=1,Shadow=0"
        
        tasks[file_id] = {"status": "processing", "progress": 0, "message": "Menyiapkan export...", "type": "export", "result": None, "error": None}
        background_tasks.add_task(process_export, file_id, temp_video_path, srt_path, output_video_path, styles, video.filename, safe_srt_path, style_str)
        return {"task_id": file_id}
    except Exception as e:
        cleanup_files(temp_video_path, srt_path, output_video_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/status/{task_id}")
def get_task_status(task_id: str):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    return tasks[task_id]

@app.get("/api/download/{task_id}")
def download_video(task_id: str, background_tasks: BackgroundTasks):
    if task_id not in export_files:
        raise HTTPException(status_code=404, detail="File tidak ditemukan atau sudah kadaluarsa")
    
    file_info = export_files[task_id]
    file_path = file_info["path"]
    filename = file_info["filename"]
    
    # Optional cleanup on download
    background_tasks.add_task(cleanup_files, file_path)
    if task_id in export_files:
        del export_files[task_id]
    if task_id in tasks:
        del tasks[task_id]
        
    return FileResponse(path=file_path, media_type="video/mp4", filename=filename)

@app.get("/")
def read_index():
    return FileResponse("public/index.html")

app.mount("/", StaticFiles(directory="public", html=True), name="public")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
