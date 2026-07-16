# 🎬 Skrip Video Presentasi: SubtiGen — Video Subtitle Generator & Editor
**Oleh: Muhammad Nufail Ghifari**
**Durasi Estimasi: 8–12 menit**

---

> **CATATAN PRESENTER:**
> - Rekam layar sambil menjalankan aplikasi di localhost
> - Gunakan mikrofon eksternal jika ada
> - Latih dulu minimal 2x sebelum rekam akhir
> - Gunakan highlight/zoom saat menunjukkan kode penting
> - Berbicara santai, anggap seperti menjelaskan ke teman

---

## 🎬 SEGMEN 1 — INTRO & HOOK (0:00 – 0:45)

**[VISUAL: Layar kosong → fade in logo SubtiGen + animasi teks]**

---

**NARASI:**

> "Bayangkan kamu punya sebuah video — rekaman kuliah, podcast, atau konten YouTube — tapi **tidak punya subtitle sama sekali.**"

**[VISUAL: Tampilkan video tanpa subtitle yang sedang diputar]**

> "Menambahkan subtitle secara manual itu butuh waktu berjam-jam. Harus dengarkan kata per kata, ketik, atur timing, export... **sangat melelahkan.**"

> "Nah, proyek saya hadir untuk memecahkan masalah itu."

**[VISUAL: Zoom in ke nama aplikasi di browser]**

> "Perkenalkan — **SubtiGen**, sebuah aplikasi web yang bisa **membuat subtitle video secara otomatis menggunakan kecerdasan buatan (AI)**, dalam hitungan menit — bukan jam."

**[VISUAL: Tampilkan tampilan utama aplikasi yang sudah berjalan]**

> "Di video ini, saya akan menunjukkan secara langsung bagaimana aplikasi ini bekerja, menjelaskan teknologi di baliknya, dan apa yang membuat proyek ini spesial."

---

## 🎬 SEGMEN 2 — DEMONSTRASI LIVE: UPLOAD & AUTO-GENERATE (0:45 – 3:00)

**[VISUAL: Browser terbuka di localhost:8000, tampilan SubtiGen]**

---

**NARASI:**

> "Oke, langsung kita lihat aplikasi ini bekerja."

> "Pertama, pastikan backend sudah berjalan. Ini terminal saya —"

**[VISUAL: Switch ke terminal, tampilkan output `python main.py`]**

```
AI Device: CPU | Compute: int8 | Threads: 8
INFO:     Uvicorn running on http://127.0.0.1:8000
```

> "Bisa dilihat backend FastAPI sudah aktif di port 8000. AI berjalan di CPU, dengan 8 threads."

> "Sekarang kita buka aplikasinya di browser."

**[VISUAL: Buka browser, navigasi ke http://localhost:8000]**

> "Ini adalah tampilan utama SubtiGen. Desainnya menggunakan glassmorphism — modern, clean, dan enak dipandang."

> "Sekarang saya akan upload video. Saya punya video pendek sekitar 30 detik untuk demonstrasi."

**[VISUAL: Drag & drop file video ke upload area / klik upload]**

> "Video langsung muncul di player. Di sini ada subtitle overlay, custom controls dengan timeline, tombol play/pause, mute, dan fullscreen."

> "Sekarang langkah paling menarik — kita gunakan AI untuk buat subtitle otomatis."

**[VISUAL: Arahkan ke dropdown model di header]**

> "Ada 3 pilihan model AI: **Tiny** yang super cepat, **Base** yang seimbang dan direkomendasikan, dan **Small** yang paling akurat tapi lebih lambat."

> "Untuk demo ini saya pilih **Base**. Lalu klik Auto-Generate."

**[VISUAL: Klik tombol 'Auto-Generate', progress bar mulai bergerak]**

> "Progress bar ini menunjukkan status real-time. Dimulai dari upload, load model AI, lalu proses transkripsi berjalan."

**[VISUAL: Tunggu proses, sambil lanjut narasi]**

> "Di balik layar, video dikirim ke backend, diproses oleh AI Whisper, dan hasilnya dikembalikan sebagai subtitle yang sudah tersinkronisasi dengan timing."

**[VISUAL: Subtitle muncul di sidebar editor]**

> "Dan selesai! Subtitle sudah terbuat secara otomatis. Bisa dilihat di sidebar ada daftar subtitle dengan timing yang tepat."

**[VISUAL: Klik Play di video, subtitle muncul overlay di atas video]**

> "Dan saat video diputar, subtitle muncul tepat di waktu yang benar. Presisi!"

---

## 🎬 SEGMEN 3 — DEMONSTRASI LIVE: EDIT & STYLING (3:00 – 5:00)

**[VISUAL: Tampilan editor subtitle di sidebar]**

---

**NARASI:**

> "Tidak hanya auto-generate — kita juga bisa **edit subtitle secara manual**."

**[VISUAL: Klik pada salah satu item subtitle di list]**

> "Setiap subtitle memiliki field teks, waktu mulai (start time), dan waktu selesai (end time). Saya bisa edit langsung di sini."

**[VISUAL: Edit teks subtitle, edit timing]**

> "Misalnya saya perbaiki kata yang salah... dan adjust timing-nya."

> "Perubahannya langsung terlihat di video overlay — real-time preview!"

**[VISUAL: Klik tombol 'Tambah Subtitle']**

> "Saya juga bisa tambah subtitle baru secara manual jika ada bagian yang terlewat."

**[VISUAL: Switch ke tab 'Style']**

> "Sekarang kita lihat fitur Style. Di sini saya bisa customisasi tampilan subtitle:"

> "— **Ukuran font**: geser slider ini untuk memperbesar atau memperkecil."

**[VISUAL: Gerakkan slider font size]**

> "— **Warna teks**: klik color picker, pilih warna yang diinginkan."

**[VISUAL: Ganti warna teks ke warna lain]**

> "— **Warna dan transparansi latar belakang** subtitle."

**[VISUAL: Adjust background opacity]**

> "— **Posisi vertikal** — mau subtitle di bawah atau di tengah?"

**[VISUAL: Geser slider posisi, tampilan langsung berubah di video]**

> "Semua perubahan bisa dilihat **real-time** di video player. Tidak perlu refresh halaman."

---

## 🎬 SEGMEN 4 — DEMONSTRASI LIVE: EXPORT VIDEO (5:00 – 6:00)

**[VISUAL: Masih di tab Style, arahkan ke tombol Export]**

---

**NARASI:**

> "Langkah terakhir dan paling powerful — **Export video dengan subtitle yang sudah di-burn langsung ke dalam video.**"

**[VISUAL: Klik tombol 'Export Video & Subtitle']**

> "Tombol Export ini mengirim video beserta data subtitle ke backend."

> "Progress bar muncul lagi — kali ini backend menggunakan **FFmpeg** untuk me-render ulang video dengan subtitle yang di-hardcode langsung ke frame video."

**[VISUAL: Progress bar berjalan sampai 100%]**

**[VISUAL: Dialog download muncul di browser]**

> "Done! Browser langsung mendownload file dengan nama `Hardsub_namafile.mp4` — video dengan subtitle permanen yang bisa dibuka di mana saja tanpa perlu player khusus."

---

## 🎬 SEGMEN 5 — PENJELASAN ARSITEKTUR (6:00 – 8:00)

**[VISUAL: Tampilkan diagram arsitektur sederhana — bisa screenshot dari slide atau gambar yang dibuat]**

---

**NARASI:**

> "Sekarang kita masuk ke bagian teknis. Bagaimana aplikasi ini bekerja di balik layar?"

> "Arsitektur proyek ini terdiri dari dua komponen utama: **Frontend** dan **Backend**."

### FRONTEND

**[VISUAL: Tampilkan folder public/ di file explorer / code editor]**

> "Frontend menggunakan **HTML, CSS, dan Vanilla JavaScript** — tanpa framework tambahan. Ini sengaja saya pilih agar ringan dan mudah di-maintain."

> "Saya menggunakan desain **glassmorphism** — efek kaca transparan yang terlihat modern dan premium."

> "JavaScript menangani semua interaksi: upload file, real-time preview subtitle overlay di atas video, sinkronisasi timing, dan komunikasi dengan backend lewat **Fetch API**."

### BACKEND

**[VISUAL: Tampilkan main.py di code editor]**

> "Backend dibangun dengan **FastAPI** — Python web framework yang sangat cepat dan modern. Server-nya dijalankan oleh **Uvicorn**, sebuah ASGI server berkinerja tinggi."

> "Ada beberapa endpoint API utama:"

**[VISUAL: Highlight bagian kode API endpoints di main.py]**

```python
GET  /api/health    → Health check
POST /api/generate  → Auto-generate subtitle dengan AI
POST /api/export    → Export video dengan subtitle
GET  /api/status    → Cek progress task
GET  /api/download  → Download hasil video
```

> "Untuk **AI Transcription**, saya menggunakan library **faster-whisper** — implementasi OpenAI Whisper yang dioptimasi, jauh lebih cepat dari versi aslinya."

**[VISUAL: Highlight bagian kode get_whisper_model di main.py]**

```python
def get_whisper_model(model_size: str):
    # Cache model di memori agar tidak reload setiap request
    if active_model_info["size"] != model_size:
        del active_model_info["model"]
        gc.collect()  # Bersihkan RAM
        active_model_info["model"] = WhisperModel(
            model_size,
            device=device,        # Auto-detect GPU/CPU
            compute_type=compute_type,
            cpu_threads=cpu_threads
        )
```

> "Ini adalah fitur caching model — model Whisper hanya dimuat sekali ke memori. Jika request berikutnya menggunakan model yang sama, tidak perlu load ulang. Ini menghemat waktu dan RAM secara signifikan."

**[VISUAL: Highlight bagian process_generate]**

> "Untuk **export video**, saya menggunakan **FFmpeg** — software video processing yang paling powerful di dunia. FFmpeg melakukan proses hardcode subtitle langsung ke dalam frame video menggunakan subtitle filter."

**[VISUAL: Highlight bagian FFmpeg command di main.py]**

```python
cmd = [
    local_ffmpeg, "-y",
    "-i", temp_video_path,
    "-vf", f"subtitles='{safe_srt_path}':force_style='{style_str}'",
    "-c:v", "libx264", "-crf", "18", "-preset", "fast",
    "-c:a", "copy",
    output_video_path
]
```

> "Perintah ini memberitahu FFmpeg: ambil video input, tambahkan filter subtitle dengan style yang sudah dikustomisasi, encode ulang dengan libx264 berkualitas tinggi, lalu simpan hasilnya."

### ASYNC PROCESSING

**[VISUAL: Highlight bagian background_tasks di main.py]**

> "Satu hal teknis menarik: proses AI dan export berjalan secara **asynchronous** menggunakan BackgroundTasks FastAPI. Artinya backend tidak freeze menunggu proses selesai — frontend bisa polling status secara real-time lewat endpoint `/api/status`, dan progress bar bisa diupdate tanpa halaman harus direfresh."

---

## 🎬 SEGMEN 6 — TANTANGAN & SOLUSI (8:00 – 9:00)

**[VISUAL: Tampilkan PROJECT_STATUS.md atau slide sederhana]**

---

**NARASI:**

> "Dalam pengembangan proyek ini, saya menemukan beberapa tantangan teknis yang cukup menarik."

> "**Tantangan pertama**: FFmpeg di Windows gagal memproses path file jika path-nya mengandung drive letter seperti `C:`. Ini karena FFmpeg menginterpretasikan titik dua sebagai pemisah waktu dalam format video."

> "**Solusinya**: saya menerapkan Windows path escaping — mengubah `C:/path` menjadi `C\:/path` — sehingga FFmpeg bisa membaca path dengan benar."

**[VISUAL: Tampilkan kode path escaping di main.py]**

```python
abs_srt_path = os.path.abspath(srt_path).replace("\\", "/")
if ":" in abs_srt_path:
    drive, path = abs_srt_path.split(":", 1)
    safe_srt_path = f"{drive}\\:{path}"
```

> "**Tantangan kedua**: Keamanan. Awalnya frontend dan backend berada di direktori yang sama, sehingga file `main.py` bisa diakses publik."

> "**Solusinya**: Saya merestrukturisasi proyek — memindahkan semua file frontend ke subfolder `public/`, lalu hanya folder itu yang di-serve sebagai static files. Source code backend tetap aman."

> "**Tantangan ketiga**: Memory management. Model AI Whisper berukuran besar (hingga 2GB). Saya menerapkan sistem cache — model hanya dimuat sekali, dan saat model diganti, model lama dihapus dari memori dengan `gc.collect()` agar tidak ada memory leak."

---

## 🎬 SEGMEN 7 — FITUR UNGGULAN & NILAI TAMBAH (9:00 – 10:00)

**[VISUAL: Tampilan aplikasi kembali, highlight fitur satu per satu]**

---

**NARASI:**

> "Jadi, apa yang membuat SubtiGen berbeda dan memberikan nilai tambah nyata?"

> "**Pertama: Fully automated.** Cukup upload video dan klik satu tombol — AI yang bekerja. Tidak perlu install software besar, tidak perlu akun berbayar."

> "**Kedua: Real-time preview.** Pengguna bisa lihat langsung bagaimana subtitle akan terlihat sebelum di-export. Ini menghemat trial-and-error."

> "**Ketiga: Fully customizable style.** Font, warna, posisi, transparansi — semua bisa diatur sesuai kebutuhan."

> "**Keempat: Hardsub export.** Video hasil export bisa dibuka di media player manapun — Windows Media Player, VLC, smartphone — tanpa perlu file subtitle terpisah."

> "**Kelima: Opsi model AI.** Pengguna bisa pilih antara kecepatan vs akurasi sesuai kebutuhan mereka — fleksibel."

> "**Keenam: Privasi terjaga.** Tidak ada data yang dikirim ke server luar. Semua pemrosesan terjadi di komputer lokal pengguna sendiri."

---

## 🎬 SEGMEN 8 — RENCANA PENGEMBANGAN (10:00 – 10:45)

**[VISUAL: Slide roadmap / tampilan README bagian Roadmap]**

---

**NARASI:**

> "Tentu ini bukan titik akhir. Ada beberapa rencana pengembangan yang ingin saya implementasikan:"

> "**v1.2**: Export subtitle dalam format standar seperti **SRT, ASS, dan VTT** — sehingga subtitle bisa digunakan di aplikasi lain seperti Premiere Pro atau YouTube."

> "Juga **fitur terjemahan otomatis** — bukan hanya transkripsi ke bahasa asli, tapi juga terjemahkan ke bahasa lain seperti Inggris, Jepang, atau Arab — ini sudah ada sebagian infrastrukturnya di kode."

> "**v1.3**: **Batch processing UI** — bisa upload dan proses banyak video sekaligus."

> "Dan jangka panjang: **deploy ke cloud** — agar bisa diakses siapa saja tanpa install apapun, lengkap dengan sistem user account dan project management."

---

## 🎬 SEGMEN 9 — PENUTUP (10:45 – 11:15)

**[VISUAL: Tampilan utama aplikasi SubtiGen]**

---

**NARASI:**

> "Jadi untuk merangkum — **SubtiGen** adalah solusi lengkap untuk masalah pembuatan subtitle video yang selama ini memakan waktu."

> "Dengan AI Whisper, FastAPI, FFmpeg, dan antarmuka web yang modern — saya berhasil membangun aplikasi yang benar-benar **fungsional, praktis, dan bisa langsung digunakan.**"

**[VISUAL: Demo singkat play video dengan subtitle berjalan — 10 detik]**

> "Ini bukan sekedar proyek latihan — ini adalah tools yang bisa digunakan nyata. Dan saya bangga dengan apa yang sudah dibangun."

> "Terima kasih sudah menyaksikan presentasi ini. Saya Muhammad Nufail Ghifari, dan ini adalah proyek **SubtiGen — Video Subtitle Generator & Editor.**"

**[VISUAL: Fade out, tampilkan teks nama dan proyek]**

---

---

## 📋 PANDUAN TEKNIS REKAMAN VIDEO

### Urutan Rekaman yang Disarankan:

1. **Siapkan semua dulu sebelum rekam:**
   - Pastikan backend sudah berjalan (`python main.py`)
   - Siapkan video contoh 30-60 detik yang jelas audionya
   - Buka browser di http://localhost:8000
   - Buka code editor dengan main.py (siap untuk di-highlight)
   - Buat slide/diagram arsitektur sederhana (bisa di Canva/PowerPoint)

2. **Urutan layar yang direkam:**
   - [0:00] Terminal → jalankan backend
   - [0:45] Browser → tampilan aplikasi
   - [1:00] Upload video + demo auto-generate
   - [3:00] Demo edit subtitle
   - [4:30] Demo styling
   - [5:00] Demo export
   - [6:00] Switch ke code editor → penjelasan arsitektur
   - [8:00] Switch ke dokumentasi → tantangan & solusi
   - [10:00] Kembali ke aplikasi → penutup

3. **Tips Kualitas:**
   - Gunakan resolusi 1920x1080 minimum
   - Zoom in ke kode yang sedang dijelaskan
   - Gunakan highlight/cursor animation agar penonton tahu apa yang dilihat
   - Matikan notifikasi sistem sebelum rekam
   - Rekam audio terlebih dahulu jika bisa, baru overlay ke video

### Kode Kunci yang Wajib Ditampilkan:
| Kode | Lokasi di main.py | Tujuan |
|------|--------------------|--------|
| `get_whisper_model()` | Baris 86-109 | Menjelaskan model caching |
| `process_generate()` | Baris 122-180 | Menjelaskan AI transcription flow |
| `FFmpeg command` | Baris 238-247 | Menjelaskan video rendering |
| `Windows path escaping` | Baris 339-344 | Menjelaskan bug fix |
| `BackgroundTasks` | Baris 183-220 | Menjelaskan async processing |

---

*Skrip ini disiapkan untuk presentasi video proyek SubtiGen oleh Muhammad Nufail Ghifari.*
*Total durasi estimasi: 10-12 menit.*
