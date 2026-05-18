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
        if (!subtitles || subtitles.length === 0) {
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
        
        mockAutoBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses AI...';
        mockAutoBtn.disabled = true;

        const modelSize = document.getElementById('model-size').value;
        
        progressContainer.classList.remove('hidden');
        progressBar.style.width = '0%';
        progressText.textContent = 'Memproses: 0%';

        const formData = new FormData();
        formData.append('video', videoUpload.files[0]);
        formData.append('model_size', modelSize);
        formData.append('task', translationTask.value);

        try {
            console.log('📤 Mengirim request ke:', '/api/generate');
            const response = await fetch('/api/generate', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const data = await response.json();
            const taskId = data.task_id;
            
            // Polling interval
            const pollInterval = setInterval(async () => {
                try {
                    const statusRes = await fetch(`/api/status/${taskId}`);
                    if (!statusRes.ok) throw new Error("Gagal mengambil status");
                    const statusData = await statusRes.json();
                    
                    progressBar.style.width = `${statusData.progress}%`;
                    progressText.textContent = `${statusData.progress}% - ${statusData.message || 'Memproses...'}`;
                    
                    if (statusData.status === 'completed') {
                        clearInterval(pollInterval);
                        subtitles = statusData.result;
                        renderSubtitlesList();
                        alert('Berhasil membuat subtitle otomatis!');
                        resetAutoBtn();
                    } else if (statusData.status === 'error') {
                        clearInterval(pollInterval);
                        alert(`Gagal membuat subtitle:\n\n${statusData.error}`);
                        resetAutoBtn();
                        progressContainer.classList.add('hidden');
                    }
                } catch(err) {
                    console.error("Polling error", err);
                }
            }, 1000);

            function resetAutoBtn() {
                mockAutoBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Auto-Generate AI';
                mockAutoBtn.disabled = false;
                setTimeout(() => {
                    progressContainer.classList.add('hidden');
                }, 3000);
            }

        } catch (error) {
            alert(`Gagal mengirim tugas:\n\n${error.message}`);
            progressContainer.classList.add('hidden');
            mockAutoBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Auto-Generate AI';
            mockAutoBtn.disabled = false;
        }
    });

    // Fitur Export Asli (FFmpeg Hardsubbing)
    exportBtn.addEventListener('click', async () => {
        if (!videoUpload.files || videoUpload.files.length === 0) {
            alert('Silakan unggah video terlebih dahulu.');
            return;
        }

        exportBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Membakar Subtitle...`;
        exportBtn.disabled = true;

        progressContainer.classList.remove('hidden');
        progressBar.style.width = '0%';
        progressText.textContent = 'Exporting: 0%';

        const formData = new FormData();
        formData.append('video', videoUpload.files[0]);
        formData.append('subtitles_json', JSON.stringify(subtitles));
        formData.append('styles_json', JSON.stringify(styles));

        try {
            console.log('📤 Mengirim request ke:', '/api/export');
            const response = await fetch('/api/export', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const data = await response.json();
            const taskId = data.task_id;
            
            const pollInterval = setInterval(async () => {
                try {
                    const statusRes = await fetch(`/api/status/${taskId}`);
                    if (!statusRes.ok) throw new Error("Gagal mengambil status");
                    const statusData = await statusRes.json();
                    
                    progressBar.style.width = `${statusData.progress}%`;
                    progressText.textContent = `${statusData.progress}% - ${statusData.message || 'Exporting...'}`;
                    
                    if (statusData.status === 'completed') {
                        clearInterval(pollInterval);
                        
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = statusData.result; 
                        a.download = `Hardsub_${videoUpload.files[0].name}`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        
                        alert('Berhasil mengekspor video!');
                        resetExportBtn();
                    } else if (statusData.status === 'error') {
                        clearInterval(pollInterval);
                        alert(`Gagal mengekspor:\n\n${statusData.error}`);
                        resetExportBtn();
                        progressContainer.classList.add('hidden');
                    }
                } catch(err) {
                    console.error("Polling error", err);
                }
            }, 1000);

            function resetExportBtn() {
                exportBtn.innerHTML = '<i class="fas fa-download"></i> Export Video & Subtitle';
                exportBtn.disabled = false;
                setTimeout(() => {
                    progressContainer.classList.add('hidden');
                }, 3000);
            }

        } catch (error) {
            alert(`Gagal mengekspor:\n\n${error.message}`);
            progressContainer.classList.add('hidden');
            exportBtn.innerHTML = '<i class="fas fa-download"></i> Export Video & Subtitle';
            exportBtn.disabled = false;
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
