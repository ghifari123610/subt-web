# 🔧 DEBUG GUIDE: "Failed to Fetch" Error

## Masalah
- ✅ Terminal menunjukkan "Transkripsi selesai!"
- ❌ Frontend menunjukkan "Gagal membuat subtitle: Failed to fetch"

## Penyebab Umum

### 1. 🔴 Backend Tidak Berjalan
**Gejala:** Response timeout atau connection refused

**Solusi:**
```bash
# Pastikan backend berjalan di terminal lain
python main.py

# Output yang benar:
# Membersihkan folder temp...
# Loading Whisper model 'base'...
# INFO:     Uvicorn running on http://127.0.0.1:8000
```

---

### 2. 🔴 Port Sudah Terpakai
**Gejala:** `Address already in use`

**Solusi:**
```bash
# Cari proses yang menggunakan port 8000
netstat -ano | findstr :8000

# Matikan proses dengan PID tertentu
taskkill /PID <PID> /F

# Atau ganti port di main.py
# ubah: uvicorn.run(app, host="127.0.0.1", port=8000)
# menjadi: uvicorn.run(app, host="127.0.0.1", port=8001)
# dan di script.js ubah http://127.0.0.1:8000 menjadi http://127.0.0.1:8001
```

---

### 3. 🔴 Browser Console Error (Paling Penting!)
**Cara debug:**

1. Buka browser (Chrome/Firefox)
2. Tekan **F12** untuk buka Developer Tools
3. Pergi ke tab **Console**
4. Upload video dan klik "Auto-Generate AI"
5. **Lihat error message lengkap di console**

**Contoh output yang benar:**
```
📤 Mengirim request ke: http://127.0.0.1:8000/api/generate
📥 Response status: 200 OK
✅ Data diterima: {subtitles: Array(45)}
```

**Contoh output yang salah:**
```
📤 Mengirim request ke: http://127.0.0.1:8000/api/generate
❌ Error saat fetch: TypeError: Failed to fetch
Error type: TypeError
Error message: Failed to fetch
```

---

### 4. 🔴 CORS Error
**Gejala:** Console menunjukkan "Access-Control-Allow-Origin"

**Solusi:** Sudah diset di `main.py` dengan `allow_origins=["*"]`
Tapi jika masih error:

```python
# Pastikan di main.py baris 36-42 sudah ada:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### 5. 🔴 Response Format Error
**Gejala:** Status 200 tapi tetap error

**Solusi:**
```javascript
// Buka DevTools Console
// Jika ada error parsing JSON, kemungkinan response format salah

// Cek di terminal Python:
// Output harus berisi "✅ Total subtitles: X"
```

---

## 🔍 Step-by-Step Debugging

### Step 1: Check Backend Status
```bash
# Terminal 1 - Jalankan backend
python main.py
```

Tunggu sampai melihat:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
Loading Whisper model 'base'... (Tunggu sebentar, mengunduh jika belum ada)
Whisper model 'base' berhasil dimuat!
```

### Step 2: Test Health Endpoint
```bash
# Terminal 2 - Test connection
curl http://127.0.0.1:8000/api/health

# Output yang benar:
# {"status":"ok","message":"Backend berjalan dengan baik"}
```

Jika error "Cannot GET" atau timeout → **Backend tidak berjalan!**

### Step 3: Open Browser DevTools
1. Buka `index.html` di browser
2. Tekan **F12**
3. Pilih tab **Console**
4. Upload video
5. Klik "Auto-Generate AI"
6. **Screenshot error** dan cek:
   - Apa message error?
   - Apakah ada "Failed to fetch"?
   - Apakah ada CORS error?

### Step 4: Check Terminal Output
Lihat apa yang di-print oleh `main.py`:

**Output yang benar:**
```
============================================================
📥 REQUEST DITERIMA
============================================================
📝 Filename: video.mp4
📝 Content-Type: video/mp4
📝 Model: base
============================================================

Mulai transkripsi video: video.mp4 (Model: base)
[Processing......]
Transkripsi selesai!
✅ Total subtitles: 45
```

**Output error:**
```
❌ Error AI: [error message]
Traceback (most recent call last):
...
```

---

## 🚨 Kemungkinan Solusi Cepat

### Masalah: "Failed to fetch" tapi backend OK
```javascript
// Buka DevTools Console (F12)
// Copy-paste ini:
fetch('http://127.0.0.1:8000/api/health')
  .then(r => r.json())
  .then(d => console.log('✅ Connection OK:', d))
  .catch(e => console.error('❌ Connection Error:', e))
```

Jika error → ada **network/firewall issue**

### Masalah: Response 200 tapi data kosong
```python
# Di main.py, tambahkan ini untuk debug:
print(f"Response: {{'subtitles': {subtitles}}}")
print(f"JSON size: {len(str(subtitles))} bytes")
```

### Masalah: Timeout (processing lama)
- **Tiny model**: ~30 detik per 1 menit video
- **Base model**: ~1 menit per 1 menit video  
- **Small model**: ~3-5 menit per 1 menit video

Frontend timeout: 10 menit (600000ms) menggunakan `AbortController` - seharusnya cukup untuk kebanyakan video. Jika masih timeout, gunakan model 'Tiny'.

---

## 📞 Info Untuk Debugger

Jika masih error, berikan info ini:

1. **Screenshot Browser Console (F12)** - pesan error lengkap
2. **Output Terminal Python** - log dari backend
3. **Network Tab** - status code response
4. **Ukuran video** - berapa MB?
5. **Model yang dipilih** - tiny/base/small?
6. **Sistem operasi** - Windows/Mac/Linux?

---

## ✅ Verifikasi Setup Benar

```bash
# 1. Dependencies OK?
pip list | findstr "fastapi uvicorn faster-whisper python-multipart imageio-ffmpeg"

# 2. Files OK?
dir index.html script.js style.css main.py requirements.txt

# 3. Python syntax OK?
python -m py_compile main.py

# 4. Backend startup OK?
python main.py
```

Semua harus OK tanpa error! 🎉

---

## 🆘 Jika Sudah Coba Semua

1. **Restart semua** - close browser, terminal, buka lagi
2. **Clear browser cache** - Ctrl+Shift+Delete
3. **Kill process** - `taskkill /IM python.exe /F`
4. **Cek temp folder** - `C:\subt web\temp\` harus kosong
5. **Install ulang** - `pip install --upgrade -r requirements.txt`

---

Last Updated: 12 Mei 2026
