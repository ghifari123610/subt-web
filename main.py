from fastapi import FastAPI, UploadFile, File, HTTPException, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
from faster_whisper import WhisperModel
import shutil
import os
import uuid
import json
import subprocess
import imageio_ffmpeg

# Menyiapkan FFmpeg lokal
ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
local_ffmpeg = os.path.join(os.getcwd(), "ffmpeg.exe")
if not os.path.exists(local_ffmpeg):
    shutil.copy(ffmpeg_path, local_ffmpeg)
os.environ["PATH"] += os.pathsep + os.getcwd()

# Membersihkan folder temp secara otomatis saat server baru dinyalakan
@asynccontextmanager
async def lifespan(app: FastAPI):
    os.makedirs("temp", exist_ok=True)
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Backend berjalan dengan baik"}

# Cache Model Whisper agar tidak diload berulang kali (dan cegah memory leak)
active_model_info = {"size": None, "model": None}

def get_whisper_model(model_size: str):
    allowed_models = ["tiny", "base", "small", "medium", "large"]
    if model_size not in allowed_models:
        model_size = "base"
        
    if active_model_info["size"] != model_size:
        # Hapus model lama dari RAM jika ukurannya berbeda
        if active_model_info["model"] is not None:
            print(f"Menghapus model '{active_model_info['size']}' dari memori...")
            del active_model_info["model"]
            import gc
            gc.collect()
            
        print(f"Loading Whisper model '{model_size}'... (Tunggu sebentar, mengunduh jika belum ada)")
        active_model_info["model"] = WhisperModel(model_size, device="cpu", compute_type="int8")
        active_model_info["size"] = model_size
        print(f"Whisper model '{model_size}' berhasil dimuat!")
        
    return active_model_info["model"]

# Preload model "base" agar proses pertama lebih cepat
get_whisper_model("base")

# Fungsi pembantu untuk menghapus file secara aman di Background Task
def cleanup_files(*file_paths):
    for path in file_paths:
        try:
            if path and os.path.exists(path):
                os.remove(path)
        except Exception as e:
            pass

@app.post("/api/generate")
def generate_subtitles(
    background_tasks: BackgroundTasks,
    video: UploadFile = File(...), 
    model_size: str = Form("base"),
    task: str = Form("transcribe") # transcribe atau translate
):
    if not video.filename:
        raise HTTPException(status_code=400, detail="Tidak ada file yang diunggah")
    
    print(f"\n{'='*60}")
    print(f"📥 REQUEST DITERIMA")
    print(f"{'='*60}")
    print(f"📝 Filename: {video.filename}")
    print(f"📝 Model: {model_size}")
    print(f"📝 Task: {task}")
    print(f"{'='*60}\n")
        
    # Validasi tipe file
    if not video.content_type or not video.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="Format file tidak valid.")
    
    file_id = str(uuid.uuid4())
    ext = os.path.splitext(video.filename)[1]
    temp_video_path = f"temp/{file_id}{ext}"
    
    # Membaca dan membatasi ukuran file maksimal 125MB (agar tidak Out of Memory)
    MAX_FILE_SIZE = 125 * 1024 * 1024
    file_size = 0
    
    try:
        with open(temp_video_path, "wb") as buffer:
            while chunk := video.file.read(8192):
                file_size += len(chunk)
                if file_size > MAX_FILE_SIZE:
                    raise HTTPException(status_code=413, detail=f"Ukuran file terlalu besar! Maksimal 125MB.")
                buffer.write(chunk)
    except Exception as e:
        cleanup_files(temp_video_path)
        raise e
            
    # Daftarkan pembersihan file di latar belakang setelah hasil dikembalikan ke browser
    background_tasks.add_task(cleanup_files, temp_video_path)
    
    try:
        model = get_whisper_model(model_size)
        print(f"Mulai proses {task}: {video.filename} (Model: {model_size})")
        
        # Whisper Native Translation (Hanya mendukung translasi ke Inggris)
        result_segments, info = model.transcribe(temp_video_path, beam_size=5, task=task)
        
        subtitles = []
        for segment in result_segments:
            subtitles.append({
                "start": segment.start,
                "end": segment.end,
                "text": segment.text.strip()
            })
            
        print(f"Proses {task} selesai!")
        print(f"✅ Total subtitles: {len(subtitles)}")
        return {"subtitles": subtitles}
        
    except Exception as e:
        print(f"❌ Error AI: {e}")
        import traceback
        traceback.print_exc()
        cleanup_files(temp_video_path)
        error_detail = str(e).replace('"', "'")
        raise HTTPException(status_code=500, detail=f"Gagal memproses video: {error_detail[:100]}")

# Mengubah detik menjadi format stempel waktu FFmpeg/SRT (HH:MM:SS,ms)
def format_timestamp(seconds):
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int((seconds % 1) * 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

@app.post("/api/export")
def export_video(
    background_tasks: BackgroundTasks,
    video: UploadFile = File(...),
    subtitles_json: str = Form(...),
    styles_json: str = Form(None)  # Tambahkan styles_json
):
    if not video.filename:
        raise HTTPException(status_code=400, detail="Video tidak ditemukan.")
        
    try:
        subtitles = json.loads(subtitles_json)
        styles = json.loads(styles_json) if styles_json else {
            "fontSize": 24, "fontColor": "#ffffff", "bgColor": "#000000", "bgOpacity": 0.5, "positionY": 10
        }
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Data subtitle atau style rusak.")
        
    file_id = str(uuid.uuid4())
    ext = os.path.splitext(video.filename)[1]
    
    # Gunakan path relatif (penting untuk FFmpeg filter di Windows)
    temp_video_path = f"temp/{file_id}_input{ext}"
    srt_path = f"temp/{file_id}.srt"
    output_video_path = f"temp/{file_id}_out{ext}"
    
    # Membaca dan membatasi ukuran file maksimal 125MB
    MAX_FILE_SIZE = 125 * 1024 * 1024
    file_size = 0
    
    try:
        # Simpan file video input dengan limitasi ukuran
        with open(temp_video_path, "wb") as buffer:
            while chunk := video.file.read(8192):
                file_size += len(chunk)
                if file_size > MAX_FILE_SIZE:
                    raise HTTPException(status_code=413, detail=f"Ukuran file video terlalu besar! Maksimal 125MB.")
                buffer.write(chunk)
    except Exception as e:
        cleanup_files(temp_video_path)
        raise e
        
    # Daftarkan pembersihan file video input di latar belakang
    background_tasks.add_task(cleanup_files, temp_video_path)
        
    # Buat file SubRip (.srt)
    with open(srt_path, "w", encoding="utf-8") as f:
        for idx, sub in enumerate(subtitles, start=1):
            f.write(f"{idx}\n")
            f.write(f"{format_timestamp(sub['start'])} --> {format_timestamp(sub['end'])}\n")
            f.write(f"{sub['text']}\n\n")
            
    try:
        # Deteksi resolusi video untuk skala font yang proporsional
        ffprobe_cmd = [
            "ffprobe", "-v", "error", "-select_streams", "v:0",
            "-show_entries", "stream=width,height", "-of", "json", temp_video_path
        ]
        probe_result = subprocess.run(ffprobe_cmd, capture_output=True, text=True)
        video_height = 720  # Default jika probe gagal
        if probe_result.returncode == 0:
            probe_data = json.loads(probe_result.stdout)
            if "streams" in probe_data and len(probe_data["streams"]) > 0:
                video_height = int(probe_data["streams"][0].get("height", 720))

        # Konversi warna HEX ke format FFmpeg (AABBGGRR atau nama warna)
        # Sederhananya kita gunakan FontSize proporsional
        # Referensi: 24px di UI (asumsi tinggi preview ~500px) 
        # Berarti FontSize = (UserSize / 500) * VideoHeight
        scaled_font_size = int((float(styles["fontSize"]) / 500.0) * video_height)
        
        # Konversi Hex Color ke FFmpeg Ass Style (&HBBGGRR)
        def hex_to_ass(hex_color):
            hex_color = hex_color.lstrip('#')
            r, g, b = hex_color[0:2], hex_color[2:4], hex_color[4:6]
            return f"&H{b}{g}{r}"

        primary_color = hex_to_ass(styles["fontColor"])
        
        # Hitung margin bawah berdasarkan persentase positionY
        margin_v = int((float(styles["positionY"]) / 100.0) * video_height)

        print(f"Membakar subtitle ke video: {video.filename} (Height: {video_height}p, Font: {scaled_font_size})...")
        
        # Hindari tanda titik dua / karakter aneh di Windows path filter FFmpeg
        safe_srt_path = srt_path.replace("\\", "/")
        
        # Gunakan force_style untuk menyesuaikan tampilan
        style_str = (
            f"FontSize={scaled_font_size},"
            f"PrimaryColour={primary_color},"
            f"Alignment=2," # Center Bottom
            f"MarginV={margin_v},"
            f"Outline=1,Shadow=0"
        )
        
        cmd = [
            local_ffmpeg, "-y",
            "-i", temp_video_path,
            "-vf", f"subtitles='{safe_srt_path}':force_style='{style_str}'",
            "-c:a", "copy",
            output_video_path
        ]
        
        process = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        if process.returncode != 0:
            error_msg = process.stderr.decode("utf-8", errors="ignore")
            print("FFmpeg Error:", error_msg)
            raise Exception("FFmpeg gagal memproses video. Pastikan format video standar.")
            
        print("Bakar subtitle selesai!")
        
        # Bersihkan file mentah dan srt secepatnya
        cleanup_files(temp_video_path, srt_path)
        
        # Jadwalkan penghapusan video hasil download nanti
        background_tasks.add_task(cleanup_files, output_video_path)
        
        return FileResponse(
            path=output_video_path,
            media_type="video/mp4",
            filename=f"Hardsub_{video.filename}"
        )
        
    except Exception as e:
        cleanup_files(temp_video_path, srt_path, output_video_path)
        print(f"Export Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
