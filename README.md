# 🎬 Video Subtitle Generator & Editor

Aplikasi web untuk membuat, mengedit, dan export subtitle video secara otomatis menggunakan AI (Whisper).

![Status](https://img.shields.io/badge/Status-Production%20Ready-green)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## ✨ Fitur

- 🤖 **Auto-Generate Subtitle** dengan AI (OpenAI Whisper)
- ✏️ **Edit Subtitle** secara manual dengan timing precision
- 🎨 **Customizable Style** - Font, warna, posisi subtitle
- 💾 **Export Video** dengan subtitle yang di-burn langsung
- 📱 **Responsive UI** - Modern glassmorphism design
- 🔧 **Multiple AI Models** - Tiny, Base, Small (berbeda kecepatan vs akurasi)

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run Backend
```bash
python main.py
```

Output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### 3. Open Frontend
- Buka `index.html` di browser
- Atau: `file:///C:/subt%20web/index.html`

---

## 📖 Usage

### Upload Video
1. Drag & drop video atau click upload area
2. Format: MP4, WebM, OGG
3. Max size: 125MB

### Auto-Generate Subtitle
1. Pilih model (Tiny/Base/Small)
2. Click "Auto-Generate AI"
3. Tunggu processing (1-10 menit tergantung model & video length)

### Edit Subtitle
1. Edit text, timing, atau hapus di sidebar
2. Preview real-time di video player
3. Validasi otomatis untuk timing

### Customize Style
1. Pergi ke tab "Style"
2. Adjust font size, color, background, position
3. Preview berubah real-time

### Export Video
1. Click "Export Video & Subtitle"
2. Video dengan subtitle akan ter-download
3. File: `Hardsub_<original_filename>`

---

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Python web framework
- **Uvicorn** - ASGI server
- **Faster-Whisper** - AI speech-to-text
- **FFmpeg** - Video processing

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling (Glassmorphism)
- **Vanilla JavaScript** - No framework needed
- **Font Awesome** - Icons

---

## 📋 Project Structure

```
subt web/
├── main.py                 # Backend FastAPI server
├── index.html              # Frontend HTML
├── script.js               # Frontend JavaScript logic
├── style.css               # Frontend styling
├── requirements.txt        # Python dependencies
├── ffmpeg.exe              # FFmpeg binary
│
├── SETUP_GUIDE.md          # Installation guide
├── DEBUG_GUIDE.md          # Troubleshooting
├── FETCH_ERROR_FIX.md      # Solution for "Failed to fetch"
├── FIXES_APPLIED.md        # List of fixes applied
│
├── temp/                   # Temporary files (auto-created)
└── venv/                   # Virtual environment (optional)
```

---

## 🔧 Configuration

### Change Backend Port
```python
# main.py, baris terakhir:
uvicorn.run(app, host="127.0.0.1", port=8000)
#                                  ^^^^
# Ubah 8000 ke port lain
```

### Change AI Model (Default)
```python
# main.py, baris ~68:
get_whisper_model("base")  # tiny, base, small
```

### Access from Another Device
```python
# main.py:
uvicorn.run(app, host="0.0.0.0", port=8000)
```

Then access: `http://<YOUR_IP>:8000`

---

## 🎛️ AI Models Comparison

| Model | Speed | Accuracy | Memory | Use Case |
|-------|-------|----------|--------|----------|
| Tiny | ⚡⚡⚡ | ⭐ | 400MB | Testing, quick preview |
| Base | ⚡⚡ | ⭐⭐⭐⭐ | 1GB | **Recommended** |
| Small | ⚡ | ⭐⭐⭐⭐⭐ | 2GB | High accuracy needed |

---

## 🔍 API Endpoints

### Health Check
```bash
GET http://127.0.0.1:8000/api/health
```
Response: `{"status":"ok","message":"Backend berjalan dengan baik"}`

### Generate Subtitles (Auto-Generate AI)
```bash
POST http://127.0.0.1:8000/api/generate
Content-Type: multipart/form-data

Parameters:
  video: (file) - Video file
  model_size: (string) - tiny|base|small (default: base)

Response: {"subtitles": [{start, end, text}, ...]}
```

### Export Video with Subtitles
```bash
POST http://127.0.0.1:8000/api/export
Content-Type: multipart/form-data

Parameters:
  video: (file) - Video file
  subtitles_json: (string) - JSON string of subtitles

Response: (binary) - Video file with burned subtitles
```

---

## 🐛 Troubleshooting

### "Failed to Fetch" Error
See `DEBUG_GUIDE.md` untuk solusi lengkap.

Quick checks:
1. Backend berjalan? `python main.py`
2. Port tidak conflict? `netstat -ano | findstr :8000`
3. Browser console? Press **F12** → Console tab

### Port Already In Use
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill process
taskkill /PID <PID> /F
```

### Out of Memory
- Close other applications
- Use "Tiny" model
- Process shorter videos

### Very Slow Processing
- Check if CPU is being used (should be ~100%)
- Try with shorter video first
- Use "Tiny" model for testing

---

## 📚 Documentation

- **SETUP_GUIDE.md** - Complete installation & setup guide
- **DEBUG_GUIDE.md** - Comprehensive troubleshooting guide
- **FETCH_ERROR_FIX.md** - Detailed solution for fetch errors
- **FIXES_APPLIED.md** - Critical issues that were fixed

---

## ⚡ Performance Tips

### Faster Processing:
- Use **Tiny** model
- Use shorter video clips
- Close unnecessary applications
- Use SSD instead of HDD

### Better Accuracy:
- Use **Small** model
- Use longer videos (more context)
- Ensure clear audio

### Optimal System:
- RAM: 8GB+
- CPU: Intel i7/Ryzen 7+
- Storage: SSD
- Video length: 30 sec - 2 min recommended

---

## 🔒 Security Notes

- ✅ CORS enabled for local development
- ✅ File upload size limited (125MB max)
- ✅ Temporary files auto-cleaned
- ✅ No data stored on server
- ⚠️ For production: Update CORS settings & add authentication

---

## 💡 Advanced Usage

### Command Line API Call
```bash
curl -X POST http://127.0.0.1:8000/api/generate \
  -F "video=@video.mp4" \
  -F "model_size=base"
```

### Batch Processing
Use Python script to process multiple files:
```python
import requests
from pathlib import Path

for video_file in Path("videos").glob("*.mp4"):
    with open(video_file, 'rb') as f:
        files = {'video': f}
        data = {'model_size': 'base'}
        response = requests.post('http://127.0.0.1:8000/api/generate', 
                                files=files, data=data)
        print(response.json())
```

---

## 🆘 Getting Help

1. **Check Documentation** - Start with SETUP_GUIDE.md or DEBUG_GUIDE.md
2. **Browser Console** - Press F12, go to Console tab, look for error messages
3. **Terminal Output** - Check what's printed in Python terminal
4. **Test Health Endpoint** - `curl http://127.0.0.1:8000/api/health`

---

## 📝 Recently Fixed

✅ **Critical Issues:**
- Missing `imageio-ffmpeg` dependency
- No cleanup on error (disk space leak)
- Invalid time input validation
- "Failed to fetch" errors

✅ **Improvements:**
- Enhanced error logging
- Better error messages
- Health check endpoint
- Comprehensive documentation

See `FIXES_APPLIED.md` for details.

---

## 📋 System Requirements

- **Python**: 3.8+
- **RAM**: 4GB minimum (8GB recommended)
- **Disk Space**: 2GB (untuk Whisper model)
- **OS**: Windows 10+, macOS, Linux
- **Browser**: Modern browser (Chrome, Firefox, Edge)
- **FFmpeg**: Auto-downloaded on first run

---

## 📦 Dependencies

```
fastapi               - Web framework
uvicorn              - ASGI server
python-multipart     - File upload handling
faster-whisper       - AI speech-to-text
imageio-ffmpeg       - FFmpeg utilities
deep-translator      - Translation (optional)
```

Install: `pip install -r requirements.txt`

---

## 🎯 Roadmap

- [ ] Subtitle translation support
- [ ] Batch processing UI
- [ ] Custom model support
- [ ] Subtitle format export (SRT, ASS, VTT)
- [ ] Real-time preview sync
- [ ] WebUI deployment

---

## 📄 License

MIT License - Feel free to use & modify

---

## 👨‍💻 Contributing

Contributions welcome! Please:
1. Test thoroughly
2. Document changes
3. Follow existing code style
4. Update relevant docs

---

## 🙏 Credits

- **OpenAI Whisper** - AI speech recognition
- **FastAPI** - Web framework
- **FFmpeg** - Video processing

---

## 📞 Support

For issues or questions:
1. Check documentation files
2. Review DEBUG_GUIDE.md for troubleshooting
3. Check browser console (F12) for errors
4. Review terminal output from backend

---

**Status**: ✅ Production Ready  
**Last Updated**: 12 Mei 2026  
**Version**: 1.1  

🎬 Happy subtitle generating! ✨
