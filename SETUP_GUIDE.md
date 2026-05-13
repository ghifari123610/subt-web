# 🚀 Setup Guide - Video Subtitle Generator

## ⚡ Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
cd "C:\subt web"
pip install -r requirements.txt
```

### Step 2: Run Backend (Terminal 1)
```bash
python main.py
```

**Expected Output:**
```
Loading Whisper model 'base'... (Tunggu sebentar, mengunduh jika belum ada)
Whisper model 'base' berhasil dimuat!
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

### Step 3: Open Frontend
```bash
# Buka index.html di browser
# Windows: double-click index.html
# Atau: drag-drop index.html ke browser
```

**Backend URL**: http://127.0.0.1:8000  
**Frontend URL**: file:///C:/subt%20web/index.html

---

## 📋 System Requirements

- **Python**: 3.8+
- **RAM**: 4GB minimum (8GB recommended)
- **Disk**: 2GB free space (untuk model Whisper)
- **OS**: Windows 10/11, Mac, Linux

---

## 🔧 Detailed Installation

### Windows

#### 1. Python Installation
```bash
# Check if Python installed
python --version

# If not, download from python.org and install
# Make sure to check "Add Python to PATH"
```

#### 2. Create Virtual Environment (Recommended)
```bash
cd "C:\subt web"

# Create venv
python -m venv venv

# Activate venv
venv\Scripts\activate
# You should see (venv) in prompt

# Then install requirements
pip install -r requirements.txt
```

#### 3. Run Backend
```bash
# Make sure venv is active
python main.py
```

#### 4. Test Health Endpoint (New Terminal)
```bash
curl http://127.0.0.1:8000/api/health
# Should return: {"status":"ok","message":"Backend berjalan dengan baik"}

# Or in PowerShell:
Invoke-WebRequest http://127.0.0.1:8000/api/health | Select-Object -ExpandProperty Content
```

---

### Mac / Linux

```bash
cd /path/to/subt\ web

# Create venv
python3 -m venv venv

# Activate
source venv/bin/activate

# Install
pip install -r requirements.txt

# Run
python3 main.py
```

---

## 📂 Project Structure

```
C:\subt web\
├── main.py              ← Backend FastAPI server
├── index.html           ← Frontend HTML
├── script.js            ← Frontend JavaScript
├── style.css            ← Frontend Styling
├── requirements.txt     ← Python dependencies
├── ffmpeg.exe           ← FFmpeg binary (auto-downloaded)
├── temp/                ← Temporary files (auto-created)
├── venv/                ← Virtual environment (optional)
├── DEBUG_GUIDE.md       ← Debugging help
├── SETUP_GUIDE.md       ← This file
├── FIXES_APPLIED.md     ← Applied fixes
└── FETCH_ERROR_FIX.md   ← Fetch error solutions
```

---

## 🎯 First Time Usage

### Step 1: Prepare a Test Video
- Download atau buat video test (MP4, 30 seconds - 2 minutes)
- Put di folder manapun (Desktop, Downloads, etc.)

### Step 2: Start Backend
```bash
python main.py
```
Wait for output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Step 3: Open Frontend
- Open `index.html` di browser

### Step 4: Test Auto-Generate
1. Click upload area atau drag-drop video
2. Select model: "Base" (recommended for first time)
3. Click "Auto-Generate AI"
4. Wait (1-5 minutes tergantung video length)
5. Should see subtitles appear in editor

### Step 5: Export
1. Optionally edit subtitles di sidebar
2. Click "Export Video & Subtitle"
3. Video dengan subtitle akan di-download

---

## ⚙️ Configuration

### Change FFmpeg Path
```python
# Di main.py, baris ~20:
local_ffmpeg = os.path.join(os.getcwd(), "ffmpeg.exe")
# Ubah path sesuai kebutuhan
```

### Change Backend Port
```python
# Di main.py, baris terakhir:
uvicorn.run(app, host="127.0.0.1", port=8000)
#                                  ^^^^
# Ubah 8000 ke port lain jika conflict
```

Jika ubah port, juga update di `script.js`:
```javascript
// script.js, baris ~257 dan ~281
const response = await fetch('http://127.0.0.1:8000/api/generate', {
//                                              ^^^^
```

### Change Backend Host
```python
# Untuk akses dari device lain:
uvicorn.run(app, host="0.0.0.0", port=8000)  # Listen on all interfaces
```

Then access dari device lain:
```
http://<YOUR_IP>:8000
```

---

## 🎛️ Model Selection

| Model | Speed | Accuracy | Memory | Best For |
|-------|-------|----------|--------|----------|
| Tiny | ⚡⚡⚡ | ⭐ | 400MB | Quick preview |
| Base | ⚡⚡ | ⭐⭐⭐⭐ | 1GB | General use |
| Small | ⚡ | ⭐⭐⭐⭐⭐ | 2GB | High accuracy |

**Default: Base** (good balance)

---

## 🔍 Common Issues

### Issue 1: "Module not found: faster_whisper"
```bash
# Solution:
pip install faster-whisper
```

### Issue 2: "Address already in use"
```bash
# Port 8000 is busy
# Solution 1: Kill process
taskkill /IM python.exe /F

# Solution 2: Change port (see Configuration section)
```

### Issue 3: "Failed to fetch"
See `DEBUG_GUIDE.md` for detailed troubleshooting

### Issue 4: Very Slow Processing
- Check CPU usage (CPU should be at ~80-100%)
- Try with smaller video first
- Use "Tiny" model for testing

### Issue 5: Out of Memory
- Close other applications
- Use "Tiny" model
- Process shorter videos

---

## 📊 Performance Tips

### For Faster Processing:
1. Use **Tiny** model
2. Use shorter video clips
3. Disable other applications
4. Use SSD (faster than HDD)

### For Better Accuracy:
1. Use **Small** model
2. Use longer videos (context helps)
3. Use clean audio

### Optimal Setup:
- **RAM**: 8GB+
- **CPU**: Intel i7 / Ryzen 7+
- **Storage**: SSD
- **Model**: Base (default)

---

## 🛠️ Advanced Usage

### Via Command Line (No GUI)

```bash
# Backend only
python main.py

# Then use curl/Python to call API:
curl -X POST http://127.0.0.1:8000/api/generate \
  -F "video=@video.mp4" \
  -F "model_size=base"
```

### Docker (Optional)

```bash
# Build image
docker build -t subtitle-gen .

# Run container
docker run -p 8000:8000 -v $(pwd)/temp:/app/temp subtitle-gen
```

### Batch Processing

```python
# Process multiple files
import os
from pathlib import Path

videos = Path("videos").glob("*.mp4")
for video in videos:
    # Call /api/generate for each
    pass
```

---

## 📚 Documentation

- `DEBUG_GUIDE.md` - Troubleshooting & detailed debugging
- `FIXES_APPLIED.md` - What was fixed
- `FETCH_ERROR_FIX.md` - "Failed to fetch" solution
- `main.py` - Comments di source code

---

## 🆘 Getting Help

### Step 1: Check Documentation
- Is answer in `DEBUG_GUIDE.md`?
- Check comments in `main.py`

### Step 2: Check Browser Console
1. Press **F12**
2. Go to **Console** tab
3. Look for `📤`, `📥`, or `❌` messages
4. Screenshot the error

### Step 3: Check Terminal
- What's printed in Python terminal?
- Any error messages?
- Copy full error

### Step 4: Test Health Endpoint
```bash
curl http://127.0.0.1:8000/api/health
```

---

## ✅ Verification

After installation, verify everything works:

```bash
# 1. Check Python
python --version  # Should be 3.8+

# 2. Check dependencies
pip list | grep -E "fastapi|uvicorn|faster-whisper"

# 3. Check backend starts
python main.py
# Wait for "Uvicorn running on..."

# 4. Test health endpoint (in another terminal)
curl http://127.0.0.1:8000/api/health

# 5. Open browser
# Go to: file:///C:/subt%20web/index.html
```

All should work without errors! ✅

---

## 🚀 Ready to Use!

```
╔═══════════════════════════════════════════╗
║  Setup Complete! You're Ready to Go!      ║
╚═══════════════════════════════════════════╝

1. Run:  python main.py
2. Open: index.html
3. Upload video
4. Click "Auto-Generate AI"
5. Wait for subtitles
6. Export!

Happy subtitle generating! 🎬✨
```

---

**Last Updated**: 12 Mei 2026  
**Version**: 1.0  
**Status**: ✅ Production Ready
