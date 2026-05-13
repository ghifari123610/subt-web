# 🚀 MULAI DI SINI - Setup Project Step by Step

Panduan lengkap untuk menjalankan Video Subtitle Generator pertama kali.

---

## ⚡ QUICK START (3 Menit)

### Langkah 1: Install Dependencies (1 menit)
```bash
cd "C:\subt web"
pip install -r requirements.txt
```

**Tunggu sampai selesai** ✓

### Langkah 2: Jalankan Backend (30 detik setup, 1 menit load model)
```bash
python main.py
```

**Output yang benar:**
```
Loading Whisper model 'base'... (Tunggu sebentar, mengunduh jika belum ada)
Whisper model 'base' berhasil dimuat!
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

✓ **Jika melihat ini = Backend berhasil berjalan!**

### Langkah 3: Buka Frontend di Browser (30 detik)
```bash
# Windows: Double-click file "index.html"
# Atau: Drag-drop index.html ke browser
```

**Atau buka manual:**
```
C:\subt web\index.html
```

✓ **Siap digunakan!**

---

## 📋 LANGKAH-LANGKAH DETAIL (Untuk Pemula)

### Prasyarat: Pastikan Python Terinstall

```bash
python --version
```

**Output yang benar:**
```
Python 3.8.0
```

Jika tidak ada = Download dari https://www.python.org/downloads/

---

### Step 1: Buka Command Prompt/Terminal

**Windows:**
- Tekan `Win + R`
- Ketik: `cmd`
- Tekan `Enter`

**Atau:**
- Klik kanan di folder `C:\subt web`
- Pilih "Open Command Prompt here"

---

### Step 2: Install Dependencies

Copy-paste command ini di terminal:

```bash
cd "C:\subt web"
pip install -r requirements.txt
```

**Proses:** ~2-5 menit tergantung internet

**Output:**
```
Collecting fastapi
Collecting uvicorn
Collecting python-multipart
...
Successfully installed ...
```

✓ Semua package installed!

---

### Step 3: Jalankan Backend

```bash
python main.py
```

**Proses:** ~30-60 detik (pertama kali download model Whisper)

**Output yang muncul:**
```
Membersihkan folder temp...
Loading Whisper model 'base'... (Tunggu sebentar, mengunduh jika belum ada)
[████████████████████] 100% - model.bin
Whisper model 'base' berhasil dimuat!
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

✓ **BACKEND SUDAH BERJALAN!**

**Jangan tutup terminal ini!** Biarkan berjalan di background.

---

### Step 4: Buka Browser

**Pilih salah satu:**

**Option A - Double Click:**
1. Buka File Explorer
2. Pergi ke `C:\subt web`
3. Double-click `index.html`

**Option B - Manual URL:**
1. Buka browser (Chrome, Firefox, Edge)
2. Paste di address bar: `C:\subt web\index.html`
3. Tekan Enter

**Option C - Drag & Drop:**
1. Buka browser
2. Drag file `index.html` ke browser window

✓ **Frontend sudah terbuka!**

---

## 🎯 Cara Pakai (First Time)

### 1. Upload Video

```
□ Klik area upload / Drag-drop video
□ Pilih file video MP4/WebM/OGG
□ Max size: 50MB
```

### 2. Generate Subtitle (Auto)

```
□ Pilih Model: "Base" (recommended)
□ Klik button "Auto-Generate AI"
□ Tunggu... (1-10 menit tergantung panjang video)
```

**Terminal akan menampilkan:**
```
============================================================
📥 REQUEST DITERIMA
============================================================
📝 Filename: video.mp4
📝 Content-Type: video/mp4
📝 Model: base
============================================================

Mulai transkripsi video: video.mp4 (Model: base)
[Processing...]
Transkripsi selesai!
✅ Total subtitles: 45
```

✓ **Subtitle sudah ter-generate!**

### 3. Edit Subtitle (Optional)

```
□ Di sidebar kanan, lihat subtitle list
□ Edit text atau timing sesuai kebutuhan
□ Lihat preview di video player
```

### 4. Export Video

```
□ Klik "Export Video & Subtitle"
□ Tunggu processing (30-60 detik)
□ Video dengan subtitle akan di-download
□ Nama file: "Hardsub_<nama_original>.mp4"
```

✓ **Selesai!**

---

## 🐛 Jika Ada Masalah

### Masalah #1: "Failed to fetch" Error

**Solusi:**
1. Pastikan **backend masih berjalan** di terminal
2. Jangan tutup terminal backend
3. Tunggu sampai melihat: `INFO: Uvicorn running on http://127.0.0.1:8000`

### Masalah #2: "Address already in use"

**Solusi:**
```bash
# Cari process yang menggunakan port 8000
netstat -ano | findstr :8000

# Lihat PID number
# Matikan process tersebut
taskkill /PID <NOMOR_PID> /F

# Coba jalankan lagi
python main.py
```

### Masalah #3: "Module not found"

**Solusi:**
```bash
# Install ulang dependencies
pip install --upgrade -r requirements.txt
```

### Masalah #4: Proses sangat lambat

**Solusi:**
- Gunakan model "Tiny" (lebih cepat)
- Gunakan video lebih pendek
- Close aplikasi lain yang menggunakan CPU

### Masalah #5: Out of Memory

**Solusi:**
- Close aplikasi lain
- Gunakan model "Tiny" atau "Base"
- Gunakan video lebih pendek
- Upgrade RAM (jika mungkin)

---

## 🔧 Advanced: Debugging

### Lihat Detail Error di Browser

1. **Buka DevTools:**
   - Tekan `F12` atau `Ctrl+Shift+I`

2. **Pergi ke Console Tab:**
   - Pilih tab "Console"

3. **Upload video dan klik "Auto-Generate AI"**

4. **Lihat output console:**
```
📤 Mengirim request ke: http://127.0.0.1:8000/api/generate
📥 Response status: 200 OK
✅ Data diterima: {subtitles: Array(45)}
```

✓ Jika melihat ✅ = Berhasil!
❌ Jika melihat ❌ = Ada error

---

## 📊 Model Selection

**Pilih yang mana?**

| Model | Kecepatan | Akurasi | Memory | Rekomendasi |
|-------|-----------|---------|--------|------------|
| **Tiny** | ⚡⚡⚡ | ⭐ | 400MB | Testing cepat |
| **Base** | ⚡⚡ | ⭐⭐⭐⭐ | 1GB | ✓ **PILIH INI** |
| **Small** | ⚡ | ⭐⭐⭐⭐⭐ | 2GB | Akurasi tinggi |

**Untuk first time: Gunakan BASE** ✓

---

## 💡 Pro Tips

### Tip 1: Video Optimal
```
Format:    MP4 (H.264)
Duration:  30 sec - 2 minutes
Audio:     Jelas, tidak background noise
Bitrate:   1 Mbps - 10 Mbps
Size:      < 50 MB
```

### Tip 2: Testing Cepat
```
1. Gunakan video pendek (30 detik)
2. Pilih model "Tiny"
3. Processing hanya ~30 detik
```

### Tip 3: Quality Baik
```
1. Gunakan video jelas + audio jernih
2. Pilih model "Small"
3. Processing ~ 3-5 menit per 1 menit video
4. Hasil subtitle lebih akurat
```

### Tip 4: Jangan Lupa
```
□ Jangan tutup terminal backend
□ Jangan tutup browser saat processing
□ Export bisa memakan waktu 30-60 detik
□ Video hasil download ke folder "Downloads"
```

---

## 🚨 Common Mistakes

❌ **Mistake 1:** Tutup terminal backend
✓ **Solution:** Biarkan terminal berjalan

❌ **Mistake 2:** Jalankan `python main.py` 2x
✓ **Solution:** Hanya 1 instance backend

❌ **Mistake 3:** Upload video > 50MB
✓ **Solution:** Max size 50MB, split jika lebih besar

❌ **Mistake 4:** Tidak tunggu model load (pertama kali)
✓ **Solution:** Tunggu ~60 detik, akan melihah output "berhasil dimuat"

❌ **Mistake 5:** Port 8000 conflict
✓ **Solution:** Kill process atau ganti port

---

## ✅ Checklist Sebelum Mulai

- [ ] Python 3.8+ terinstall
- [ ] Folder `C:\subt web` ada
- [ ] Semua file (main.py, index.html, dll) ada
- [ ] Internet tersedia (untuk download model)
- [ ] RAM minimal 4GB
- [ ] Free disk space minimal 2GB
- [ ] Browser sudah terinstall (Chrome, Firefox, Edge)

**Semua checklist ✓?** → Siap mulai! 🚀

---

## 📞 Perlu Bantuan?

1. **Lihat dokumentasi:**
   - `README.md` - Overview project
   - `DEBUG_GUIDE.md` - Troubleshooting
   - `QUICK_REFERENCE.txt` - Command list

2. **Buka DevTools (F12)** untuk debugging

3. **Cek terminal** untuk error messages

4. **Test health endpoint:**
   ```bash
   curl http://127.0.0.1:8000/api/health
   ```

---

## 🎬 Video Demo Flow

```
1. Terminal 1: python main.py
   ↓
   (tunggu "Uvicorn running on...")
   ↓
2. Browser: Buka index.html
   ↓
3. Upload: Pilih video MP4
   ↓
4. Generate: Klik "Auto-Generate AI"
   ↓
   (tunggu processing)
   ↓
5. Edit: Edit subtitle di sidebar (optional)
   ↓
6. Export: Klik "Export Video & Subtitle"
   ↓
   (tunggu ~30-60 detik)
   ↓
7. Download: Video sudah ter-download dengan subtitle
   ↓
✅ SELESAI!
```

---

## 🎉 Siap Dimulai!

### Jalankan Sekarang:

**Terminal (Administrator):**
```bash
cd "C:\subt web"
pip install -r requirements.txt
python main.py
```

**Browser:**
```
Buka: C:\subt web\index.html
```

**Enjoy! 🎬✨**

---

## 📝 Notes

- First time: Model load ~60 detik
- Processing: 1-10 menit (tergantung model & video)
- Export: 30-60 detik
- Temp files: Auto-deleted setelah download

---

**Butuh bantuan?** → Lihat `DEBUG_GUIDE.md`  
**Mau tahu detail?** → Lihat `README.md`  
**Command cepat?** → Lihat `QUICK_REFERENCE.txt`

---

**Status**: ✅ Production Ready  
**Last Updated**: 13 Mei 2026  
**Version**: 1.1

🚀 **SELAMAT MENCOBA!**
