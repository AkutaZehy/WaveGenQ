// Global variables
let audioContext = null;
let audioBuffer = null;
let audioFileName = '';

// DOM elements
const uploadArea = document.getElementById('uploadArea');
const audioFileInput = document.getElementById('audioFile');
const controlsSection = document.getElementById('controlsSection');
const previewSection = document.getElementById('previewSection');
const fileInfo = document.getElementById('fileInfo');
const waveColorInput = document.getElementById('waveColor');
const waveColorTextInput = document.getElementById('waveColorText');
const canvasWidthInput = document.getElementById('canvasWidth');
const canvasHeightInput = document.getElementById('canvasHeight');
const fpsInput = document.getElementById('fps');
const generateBtn = document.getElementById('generateBtn');
const exportBtn = document.getElementById('exportBtn');
const resetBtn = document.getElementById('resetBtn');
const waveformCanvas = document.getElementById('waveformCanvas');
const progressContainer = document.getElementById('progressContainer');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

function setupEventListeners() {
    // Upload area click
    uploadArea.addEventListener('click', () => {
        audioFileInput.click();
    });

    // File input change
    audioFileInput.addEventListener('change', handleFileSelect);

    // Drag and drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);

    // Color inputs sync
    waveColorInput.addEventListener('input', (e) => {
        waveColorTextInput.value = e.target.value;
    });

    waveColorTextInput.addEventListener('input', (e) => {
        const value = e.target.value;
        if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
            waveColorInput.value = value;
        }
    });

    // Generate button
    generateBtn.addEventListener('click', generateWaveform);

    // Export button
    exportBtn.addEventListener('click', exportVideo);

    // Reset button
    resetBtn.addEventListener('click', resetApp);
}

function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    if (!file.type.startsWith('audio/')) {
        alert('Please select a valid audio file.');
        return;
    }

    audioFileName = file.name;
    
    // Display file info with safe text content
    const fileSize = (file.size / 1024 / 1024).toFixed(2);
    
    // Clear previous content
    fileInfo.innerHTML = '';
    
    // Create safe elements
    const fileNameLabel = document.createElement('strong');
    fileNameLabel.textContent = 'File: ';
    const fileNameText = document.createTextNode(file.name);
    
    const fileSizeLabel = document.createElement('strong');
    fileSizeLabel.textContent = 'Size: ';
    const fileSizeText = document.createTextNode(`${fileSize} MB`);
    
    const fileTypeLabel = document.createElement('strong');
    fileTypeLabel.textContent = 'Type: ';
    const fileTypeText = document.createTextNode(file.type);
    
    // Append elements
    fileInfo.appendChild(fileNameLabel);
    fileInfo.appendChild(fileNameText);
    fileInfo.appendChild(document.createElement('br'));
    fileInfo.appendChild(fileSizeLabel);
    fileInfo.appendChild(fileSizeText);
    fileInfo.appendChild(document.createElement('br'));
    fileInfo.appendChild(fileTypeLabel);
    fileInfo.appendChild(fileTypeText);

    // Read audio file
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            // Initialize audio context
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioBuffer = await audioContext.decodeAudioData(e.target.result);
            
            // Show controls
            controlsSection.style.display = 'block';
            
            // Enable generate button
            generateBtn.disabled = false;
        } catch (error) {
            console.error('Error decoding audio:', error);
            alert('Error loading audio file. Please try a different file.');
        }
    };
    
    reader.readAsArrayBuffer(file);
}

async function generateWaveform() {
    if (!audioBuffer) {
        alert('Please upload an audio file first.');
        return;
    }

    generateBtn.disabled = true;
    previewSection.style.display = 'block';
    exportBtn.style.display = 'none';

    const width = parseInt(canvasWidthInput.value);
    const height = parseInt(canvasHeightInput.value);
    const color = waveColorInput.value;

    // Set canvas size
    waveformCanvas.width = width;
    waveformCanvas.height = height;

    // Draw waveform on canvas
    drawWaveform(audioBuffer, waveformCanvas, color);

    // Show export button
    exportBtn.style.display = 'inline-block';
    generateBtn.disabled = false;
}

function drawWaveform(buffer, canvas, color) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas with transparent background
    ctx.clearRect(0, 0, width, height);

    const data = buffer.getChannelData(0); // Get first channel
    const step = Math.ceil(data.length / width);
    const amp = height / 2;

    ctx.fillStyle = color;
    ctx.strokeStyle = color;

    // Draw waveform
    for (let i = 0; i < width; i++) {
        let min = 1.0;
        let max = -1.0;

        for (let j = 0; j < step; j++) {
            const datum = data[(i * step) + j];
            if (datum < min) min = datum;
            if (datum > max) max = datum;
        }

        const yMin = (1 + min) * amp;
        const yMax = (1 + max) * amp;

        ctx.fillRect(i, yMin, 1, yMax - yMin);
    }
}

async function exportVideo() {
    if (!audioBuffer) {
        alert('Please generate a waveform first.');
        return;
    }

    exportBtn.disabled = true;
    progressContainer.style.display = 'block';
    progressFill.style.width = '0%';
    progressText.textContent = 'Processing: 0%';

    try {
        const width = parseInt(canvasWidthInput.value);
        const height = parseInt(canvasHeightInput.value);
        const fps = parseInt(fpsInput.value);
        const color = waveColorInput.value;
        const duration = audioBuffer.duration;
        const totalFrames = Math.ceil(duration * fps);

        // Check if MediaRecorder supports VP9 with alpha
        const mimeType = 'video/webm;codecs=vp9';
        
        if (!MediaRecorder.isTypeSupported(mimeType)) {
            alert('Your browser does not support VP9 codec. The video will be exported as WebM without guaranteed transparency.');
        }

        // Create a temporary canvas for animation
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d', { alpha: true });

        // Create video stream from canvas
        const stream = tempCanvas.captureStream(fps);
        
        // Create audio source
        const audioSource = audioContext.createBufferSource();
        audioSource.buffer = audioBuffer;
        
        // Create MediaStreamDestination for audio
        const audioDestination = audioContext.createMediaStreamDestination();
        audioSource.connect(audioDestination);
        
        // Combine video and audio streams
        const audioTrack = audioDestination.stream.getAudioTracks()[0];
        stream.addTrack(audioTrack);

        const chunks = [];
        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: mimeType,
            videoBitsPerSecond: 5000000
        });

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunks.push(e.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `${audioFileName.replace(/\.[^/.]+$/, '')}_waveform.webm`;
            a.click();
            
            URL.revokeObjectURL(url);
            
            progressContainer.style.display = 'none';
            exportBtn.disabled = false;
            
            alert('Video exported successfully! Note: WebM format is exported. You can convert to MP4 using online tools or video converters while preserving transparency.');
        };

        mediaRecorder.start();
        audioSource.start(0);

        // Animation loop
        let currentFrame = 0;
        const data = audioBuffer.getChannelData(0);
        const samplesPerFrame = Math.floor(data.length / totalFrames);

        const animate = () => {
            if (currentFrame >= totalFrames) {
                mediaRecorder.stop();
                audioSource.stop();
                return;
            }

            // Clear with transparent background
            tempCtx.clearRect(0, 0, width, height);

            // Calculate progress
            const progress = currentFrame / totalFrames;
            const currentSample = Math.floor(progress * data.length);
            
            // Draw waveform up to current position
            tempCtx.fillStyle = color;
            const step = Math.ceil(data.length / width);
            const amp = height / 2;

            for (let i = 0; i < width * progress; i++) {
                let min = 1.0;
                let max = -1.0;

                for (let j = 0; j < step; j++) {
                    const index = (i * step) + j;
                    if (index < data.length) {
                        const datum = data[index];
                        if (datum < min) min = datum;
                        if (datum > max) max = datum;
                    }
                }

                const yMin = (1 + min) * amp;
                const yMax = (1 + max) * amp;

                tempCtx.fillRect(i, yMin, 1, yMax - yMin);
            }

            // Update progress
            const progressPercent = Math.floor(progress * 100);
            progressFill.style.width = progressPercent + '%';
            progressText.textContent = `Processing: ${progressPercent}%`;

            currentFrame++;
            setTimeout(animate, 1000 / fps);
        };

        animate();

    } catch (error) {
        console.error('Error exporting video:', error);
        alert('Error exporting video. Please try again.');
        exportBtn.disabled = false;
        progressContainer.style.display = 'none';
    }
}

function resetApp() {
    // Reset all variables
    audioBuffer = null;
    audioFileName = '';

    // Reset file input
    audioFileInput.value = '';

    // Hide sections
    controlsSection.style.display = 'none';
    previewSection.style.display = 'none';
    progressContainer.style.display = 'none';

    // Reset form values
    waveColorInput.value = '#00ff88';
    waveColorTextInput.value = '#00ff88';
    canvasWidthInput.value = '1280';
    canvasHeightInput.value = '720';
    fpsInput.value = '30';

    // Clear canvas
    const ctx = waveformCanvas.getContext('2d');
    ctx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);

    // Disable buttons
    generateBtn.disabled = false;
    exportBtn.style.display = 'none';
}
