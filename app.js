// Global variables
let audioContext = null;
let audioBuffer = null;
let audioFileName = '';
let sizingMode = 'time'; // 'time' or 'fixed'

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
const timeMultiplierInput = document.getElementById('timeMultiplier');
const aspectModeSelect = document.getElementById('aspectMode');
const fpsInput = document.getElementById('fps');
const generateBtn = document.getElementById('generateBtn');
const exportBtn = document.getElementById('exportBtn');
const resetBtn = document.getElementById('resetBtn');
const waveformCanvas = document.getElementById('waveformCanvas');
const progressContainer = document.getElementById('progressContainer');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const themeToggle = document.getElementById('themeToggle');
const sizingBtns = document.querySelectorAll('.sizing-btn');
const timeBasedControls = document.getElementById('timeBasedControls');
const fixedSizeControls = document.getElementById('fixedSizeControls');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadThemePreference();
});

function loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
}

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

    // Sizing mode toggle
    sizingBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sizingBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            sizingMode = btn.dataset.mode;
            
            if (sizingMode === 'time') {
                timeBasedControls.style.display = 'block';
                fixedSizeControls.style.display = 'none';
            } else {
                timeBasedControls.style.display = 'none';
                fixedSizeControls.style.display = 'block';
            }
        });
    });

    // Theme toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    // Generate button
    generateBtn.addEventListener('click', generateWaveform);

    // Export button
    exportBtn.addEventListener('click', exportImage);

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

    const color = waveColorInput.value;
    let width, height;

    // Calculate dimensions based on sizing mode
    if (sizingMode === 'time') {
        const duration = audioBuffer.duration;
        const multiplier = parseInt(timeMultiplierInput.value);
        const aspectMode = aspectModeSelect.value;

        // Base width on duration
        width = Math.round(duration * multiplier);
        
        // Calculate height based on aspect mode
        if (aspectMode === 'balanced') {
            // Use a balanced ratio for most audio lengths
            height = Math.max(400, Math.min(800, width / 3));
        } else if (aspectMode === 'horizontal') {
            // More horizontal stretch - shorter height
            height = Math.max(300, width / 5);
        } else { // vertical
            // More vertical - taller height
            height = Math.max(500, width / 2);
        }

        // Ensure reasonable bounds
        width = Math.max(320, Math.min(3840, width));
        height = Math.max(180, Math.min(2160, height));
    } else {
        // Fixed size mode
        width = parseInt(canvasWidthInput.value);
        height = parseInt(canvasHeightInput.value);
    }

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

async function exportImage() {
    if (!audioBuffer) {
        alert('Please generate a waveform first.');
        return;
    }

    exportBtn.disabled = true;
    progressContainer.style.display = 'block';
    progressFill.style.width = '0%';
    progressText.textContent = 'Exporting...';

    try {
        // Use the current canvas
        progressFill.style.width = '50%';
        
        // Export canvas as PNG with transparency
        waveformCanvas.toBlob((blob) => {
            if (!blob) {
                alert('Error generating image. Please try again.');
                exportBtn.disabled = false;
                progressContainer.style.display = 'none';
                return;
            }

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${audioFileName.replace(/\.[^/.]+$/, '')}_waveform.png`;
            a.click();
            
            URL.revokeObjectURL(url);
            
            progressFill.style.width = '100%';
            progressText.textContent = 'Export complete!';
            
            setTimeout(() => {
                progressContainer.style.display = 'none';
                exportBtn.disabled = false;
            }, 1000);
        }, 'image/png');

    } catch (error) {
        console.error('Error exporting image:', error);
        alert('Error exporting image. Please try again.');
        exportBtn.disabled = false;
        progressContainer.style.display = 'none';
    }
}

function resetApp() {
    // Reset all variables
    audioBuffer = null;
    audioFileName = '';
    sizingMode = 'time';

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
    timeMultiplierInput.value = '100';
    aspectModeSelect.value = 'balanced';
    fpsInput.value = '30';

    // Reset sizing mode
    sizingBtns.forEach(btn => {
        if (btn.dataset.mode === 'time') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    timeBasedControls.style.display = 'block';
    fixedSizeControls.style.display = 'none';

    // Clear canvas
    const ctx = waveformCanvas.getContext('2d');
    ctx.clearRect(0, 0, waveformCanvas.width, waveformCanvas.height);

    // Disable buttons
    generateBtn.disabled = false;
    exportBtn.style.display = 'none';
}
