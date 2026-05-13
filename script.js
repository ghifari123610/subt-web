document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const uploadArea = document.getElementById('upload-area');
    const videoUpload = document.getElementById('video-upload');
    const videoContainer = document.getElementById('video-container');
    const mainVideo = document.getElementById('main-video');
    const subtitleOverlay = document.getElementById('subtitle-overlay');
    const subtitleList = document.getElementById('subtitle-list');
    const addSubtitleBtn = document.getElementById('add-subtitle-btn');
    const mockAutoBtn = document.getElementById('mock-auto-btn');
    const exportBtn = document.getElementById('export-btn');
    const changeVideoBtn = document.getElementById('change-video-btn');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const translationTask = document.getElementById('translation-task');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Style elements
    const fontSizeInput = document.getElementById('font-size');
    const fontSizeVal = document.getElementById('font-size-val');
    const fontColorInput = document.getElementById('font-color');
    const bgColorInput = document.getElementById('bg-color');
    const bgOpacityInput = document.getElementById('bg-opacity');
    const bgOpacityVal = document.getElementById('bg-opacity-val');
    const posYInput = document.getElementById('pos-y');
    const posYVal = document.getElementById('pos-y-val');

    // State
    let subtitles = [];
    let styles = {
        fontSize: 24,
        fontColor: '#ffffff',
        bgColor: '#000000',
        bgOpacity: 0.5,
        positionY: 10
    };

    // Tabs logic
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
        });
    });

    // Video Upload Logic
    uploadArea.addEventListener('click', () => videoUpload.click());
    changeVideoBtn.addEventListener('click', () => videoUpload.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--accent-color)';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--panel-border)';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--panel-border)';
        if (e.dataTransfer.files.length) {
            handleVideoFile(e.dataTransfer.files[0]);
        }
    });

    videoUpload.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleVideoFile(e.target.files[0]);
        }
    });

    function handleVideoFile(file) {
        if (!file.type.startsWith('video/')) {
            alert('Silakan unggah file video.');
            return;
        }

        // Reset state dan UI saat ganti video (Masalah #5)
        subtitles = [];
        renderSubtitlesList();
        updateVideoOverlay();

        const fileURL = URL.createObjectURL(file);
        mainVideo.src = fileURL;
        uploadArea.classList.add('hidden');
        videoContainer.classList.remove('hidden');
    }

    // Styles Logic
    function updateOverlayStyles() {
        const hex = styles.bgColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const rgbaBg = `rgba(${r}, ${g}, ${b}, ${styles.bgOpacity})`;

        const textElement = subtitleOverlay.querySelector('.subtitle-text');
        if (textElement) {
            textElement.style.fontSize = `${styles.fontSize}px`;
            textElement.style.color = styles.fontColor;
            textElement.style.backgroundColor = rgbaBg;
        }
        subtitleOverlay.style.bottom = `${styles.positionY}%`;
    }

    fontSizeInput.addEventListener('input', (e) => {
        styles.fontSize = e.target.value;
        fontSizeVal.textContent = e.target.value;
        updateOverlayStyles();
    });

    fontColorInput.addEventListener('input', (e) => {
        styles.fontColor = e.target.value;
        updateOverlayStyles();
    });

    bgColorInput.addEventListener('input', (e) => {
        styles.bgColor = e.target.value;
        updateOverlayStyles();
    });

    bgOpacityInput.addEventListener('input', (e) => {
        styles.bgOpacity = e.target.value / 100;
        bgOpacityVal.textContent = e.target.value;
        updateOverlayStyles();
    });

    posYInput.addEventListener('input', (e) => {
        styles.positionY = e.target.value;
        posYVal.textContent = e.target.value;
        updateOverlayStyles();
    });

    // Helpers
    function formatTime(seconds) {
        if (isNaN(seconds)) return "00:00:00.000";
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        const ms = Math.floor((seconds % 1) * 1000).toString().padStart(3, '0');
        return `${h}:${m}:${s}.${ms}`;
    }

    function parseTime(timeStr) {
        try {
            const parts = timeStr.split(':');
            if (parts.length !== 3) return 0;
            const sParts = parts[2].split('.');
            const h = parseInt(parts[0]);
            const m = parseInt(parts[1]);
            const s = parseInt(sParts[0]);
            const ms = sParts.length > 1 ? parseInt(sParts[1]) : 0;
            
            if (isNaN(h) || isNaN(m) || isNaN(s) || isNaN(ms)) return 0;
            if (m < 0 || m > 59 || s < 0 || s > 59) return 0;
            
            let secs = h * 3600 + m * 60 + s + ms / 1000;
            return isNaN(secs) ? 0 : secs;
        } catch(e) {
            return 0;
        }
    }

    // Subtitle Editor
    function renderSubtitlesList() {
        if (subtitles.length === 0) {
            subtitleList.innerHTML = '<div class="empty-state">Belum ada subtitle. Tambahkan secara manual atau gunakan Auto-Generate.</div>';
            return;
        }

        subtitleList.innerHTML = '';
        subtitles.sort((a, b) => a.start - b.start).forEach((sub, index) => {
            const el = document.createElement('div');
            el.className = 'subtitle-item';
            el.innerHTML = `
                <div class="time-inputs">
                    <input type="text" class="time-start" value="${formatTime(sub.start)}" data-idx="${index}">
                    <span>-</span>
                    <input type="text" class="time-end" value="${formatTime(sub.end)}" data-idx="${index}">
                </div>
                <textarea class="subtitle-input" data-idx="${index}">${sub.text}</textarea>
                <div class="item-actions">
                    <button class="del-btn" data-idx="${index}" title="Hapus"><i class="fas fa-trash"></i></button>
                </div>
            `;
            subtitleList.appendChild(el);
        });

        // Event listeners
        document.querySelectorAll('.time-start').forEach(input => {
            input.addEventListener('change', (e) => {
                const idx = e.target.dataset.idx;
                const newTime = parseTime(e.target.value);
                if (newTime < subtitles[idx].end) {
                    subtitles[idx].start = newTime;
                } else {
                    alert('Waktu mulai harus lebih kecil dari waktu akhir');
                    e.target.value = formatTime(subtitles[idx].start);
                }
            });
        });
        document.querySelectorAll('.time-end').forEach(input => {
            input.addEventListener('change', (e) => {
                const idx = e.target.dataset.idx;
                const newTime = parseTime(e.target.value);
                if (newTime > subtitles[idx].start) {
                    subtitles[idx].end = newTime;
                } else {
                    alert('Waktu akhir harus lebih besar dari waktu mulai');
                    e.target.value = formatTime(subtitles[idx].end);
                }
            });
        });
        document.querySelectorAll('.subtitle-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const idx = e.target.dataset.idx;
                subtitles[idx].text = e.target.value;
                updateVideoOverlay(); 
            });
        });
        document.querySelectorAll('.del-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.currentTarget.dataset.idx;
                subtitles.splice(idx, 1);
                renderSubtitlesList();
                updateVideoOverlay();
            });
        });
    }

    addSubtitleBtn.addEventListener('click', () => {
        const currentTime = mainVideo.currentTime || 0;
        subtitles.push({
            start: currentTime,
            end: currentTime + 2.5,
            text: 'Teks subtitle baru'
        });
        renderSubtitlesList();
        
        // Scroll to bottom
        const tabEditor = document.getElementById('tab-editor');
        tabEditor.scrollTop = tabEditor.scrollHeight;
    });

    // Fitur Auto-Generate Real (Mengirim ke Backend Python)
    mockAutoBtn.addEventListener('click', async () => {
        if (!videoUpload.files || videoUpload.files.length === 0) {
            alert('Silakan unggah video melalui area Drag & Drop terlebih dahulu sebelum menggunakan fitur AI.');
            return;
        }
        
        mockAutoBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengekstrak Audio & Memproses AI... (Bisa memakan waktu beberapa menit)';
        mockAutoBtn.disabled = true;

        const modelSize = document.getElementById('model-size').value;
        const fileSizeMB = videoUpload.files[0].size / (1024 * 1024);
        
        // Estimasi kasar: 
        // Tiny: ~1.5 detik per MB, Base: ~3 detik per MB, Small: ~8 detik per MB
        let multiplier = modelSize === 'tiny' ? 1.5 : (modelSize === 'base' ? 3 : 8);
        let estimatedSeconds = Math.max(10, Math.round(fileSizeMB * multiplier));
        let displayTime = estimatedSeconds > 60 
            ? `${Math.floor(estimatedSeconds/60)}m ${estimatedSeconds%60}s` 
            : `${estimatedSeconds}s`;

        mockAutoBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Memproses AI...`;
        mockAutoBtn.disabled = true;
        
        // Show and Reset Progress Bar
        progressContainer.classList.remove('hidden');
        progressBar.style.width = '0%';
        progressText.textContent = 'Memproses: 0%';

        const formData = new FormData();
        formData.append('video', videoUpload.files[0]);
        formData.append('model_size', modelSize);
        formData.append('task', translationTask.value);

        // Progress Animation Logic
        let currentProgress = 0;
        const progressInterval = setInterval(() => {
            if (currentProgress < 95) {
                // Tambah progress secara perlahan (semakin besar file, semakin lambat)
                let increment = Math.max(0.1, 10 / estimatedSeconds);
                currentProgress += increment;
                if (currentProgress > 95) currentProgress = 95;
                progressBar.style.width = `${currentProgress}%`;
                progressText.textContent = `Memproses: ${Math.round(currentProgress)}%`;
            }
        }, 100);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 600000); 

            console.log('📤 Mengirim request ke:', 'http://127.0.0.1:8000/api/generate');
            const response = await fetch('http://127.0.0.1:8000/api/generate', {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                try {
                    const errorData = JSON.parse(errorText);
                    throw new Error(errorData.detail || `HTTP ${response.status}`);
                } catch (e) {
                    throw new Error(`HTTP ${response.status}: ${errorText}`);
                }
            }

            const data = await response.json();
            
            // Complete progress bar
            clearInterval(progressInterval);
            progressBar.style.width = '100%';
            progressText.textContent = 'Selesai: 100%';
            
            subtitles = data.subtitles;
            renderSubtitlesList();
            alert('Berhasil membuat subtitle otomatis!');
        } catch (error) {
            clearInterval(progressInterval);
            let errorMsg = error.message;
            if (error.name === 'AbortError') {
                errorMsg = "Waktu proses habis (10 menit).";
            }
            alert(`Gagal membuat subtitle:\n\n${errorMsg}`);
            progressContainer.classList.add('hidden');
        } finally {
            mockAutoBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Auto-Generate AI';
            mockAutoBtn.disabled = false;
            // Sembunyikan progress bar setelah beberapa saat jika berhasil
            setTimeout(() => {
                if (!mockAutoBtn.disabled) progressContainer.classList.add('hidden');
            }, 3000);
        }
    });

    // Fitur Export Asli (FFmpeg Hardsubbing)
    exportBtn.addEventListener('click', async () => {
        if (!videoUpload.files || videoUpload.files.length === 0) {
            alert('Silakan unggah video terlebih dahulu.');
            return;
        }
        
        const fileSizeMB = videoUpload.files[0].size / (1024 * 1024);
        // Estimasi ekspor: ~1.5 detik per MB
        let estExportSeconds = Math.max(5, Math.round(fileSizeMB * 1.5));
        let displayExportTime = estExportSeconds > 60 
            ? `${Math.floor(estExportSeconds/60)}m ${estExportSeconds%60}s` 
            : `${estExportSeconds}s`;

        exportBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Membakar Subtitle...`;
        exportBtn.disabled = true;

        // Show and Reset Progress Bar for Export
        progressContainer.classList.remove('hidden');
        progressBar.style.width = '0%';
        progressText.textContent = 'Exporting: 0%';

        const formData = new FormData();
        formData.append('video', videoUpload.files[0]);
        formData.append('subtitles_json', JSON.stringify(subtitles));
        formData.append('styles_json', JSON.stringify(styles));

        // Progress Animation Logic for Export
        let exportProgress = 0;
        const exportInterval = setInterval(() => {
            if (exportProgress < 95) {
                let increment = Math.max(0.1, 10 / estExportSeconds);
                exportProgress += increment;
                if (exportProgress > 95) exportProgress = 95;
                progressBar.style.width = `${exportProgress}%`;
                progressText.textContent = `Exporting: ${Math.round(exportProgress)}%`;
            }
        }, 100);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 600000); // 10 menit

            console.log('📤 Mengirim request ke:', 'http://127.0.0.1:8000/api/export');
            const response = await fetch('http://127.0.0.1:8000/api/export', {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            console.log('📥 Response status:', response.status, response.statusText);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Server error response:', errorText);
                try {
                    const errorData = JSON.parse(errorText);
                    throw new Error(errorData.detail || `HTTP ${response.status}`);
                } catch (e) {
                    throw new Error(`HTTP ${response.status}: ${errorText}`);
                }
            }

            // Complete progress bar
            clearInterval(exportInterval);
            progressBar.style.width = '100%';
            progressText.textContent = 'Selesai: 100%';

            // Mendapatkan file video sebagai Blob
            const blob = await response.blob();
            console.log('✅ Video blob diterima:', blob.size, 'bytes');
            
            // Membuat URL untuk mengunduh
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `Hardsub_${videoUpload.files[0].name}`;
            document.body.appendChild(a);
            a.click();
            
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            alert('Berhasil mengekspor video!');
        } catch (error) {
            clearInterval(exportInterval);
            let errorMsg = error.message;
            if (error.name === 'AbortError') {
                errorMsg = "Waktu proses habis (10 menit). Video mungkin terlalu besar untuk diproses oleh FFmpeg dalam waktu yang ditentukan.";
            }
            console.error('❌ Export error:', error);
            alert(`Gagal mengekspor:\n\n${errorMsg}`);
            progressContainer.classList.add('hidden');
        } finally {
            exportBtn.innerHTML = '<i class="fas fa-download"></i> Export Video & Subtitle';
            exportBtn.disabled = false;
            // Sembunyikan progress bar setelah beberapa saat jika berhasil
            setTimeout(() => {
                if (!exportBtn.disabled) progressContainer.classList.add('hidden');
            }, 3000);
        }
    });

    // Sync subtitle
    function updateVideoOverlay() {
        const currentTime = mainVideo.currentTime;
        const currentSub = subtitles.find(sub => currentTime >= sub.start && currentTime <= sub.end);
        
        if (currentSub) {
            // Only update DOM if text changed to avoid flickering
            const existingText = subtitleOverlay.querySelector('.subtitle-text');
            if (!existingText || existingText.textContent !== currentSub.text) {
                subtitleOverlay.innerHTML = `<div class="subtitle-text">${currentSub.text}</div>`;
                updateOverlayStyles();
            }
        } else {
            subtitleOverlay.innerHTML = '';
        }
    }

    mainVideo.addEventListener('timeupdate', updateVideoOverlay);
});
