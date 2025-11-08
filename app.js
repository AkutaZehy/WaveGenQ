// Global variables
let audioContext = null;
let audioBuffer = null;
let audioFileName = '';
let audioDuration = 0;
let sizingMode = 'time'; // 'time' or 'fixed'

// DOM elements
const uploadArea = document.getElementById('uploadArea');
const audioFileInput = document.getElementById('audioFile');
const controlsSection = document.getElementById('controlsSection');
const previewSection = document.getElementById('previewSection');
const fileInfo = document.getElementById('fileInfo');
const waveColorInput = document.getElementById('waveColor');
const waveColorTextInput = document.getElementById('waveColorText');
const bgColorInput = document.getElementById('bgColor');
const bgColorTextInput = document.getElementById('bgColorText');
const transparentBgCheckbox = document.getElementById('transparentBg');
const canvasWidthInput = document.getElementById('canvasWidth');
const canvasHeightInput = document.getElementById('canvasHeight');
const timeMultiplierInput = document.getElementById('timeMultiplier');
const verticalHeightInput = document.getElementById('verticalHeight');
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
    // Default to light theme, only switch to dark if explicitly saved
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
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

    // Waveform color inputs sync
    waveColorInput.addEventListener('input', (e) => {
        waveColorTextInput.value = e.target.value;
    });

    waveColorTextInput.addEventListener('input', (e) => {
        const value = e.target.value;
        if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
            waveColorInput.value = value;
        }
    });

    // Background color inputs sync
    bgColorInput.addEventListener('input', (e) => {
        bgColorTextInput.value = e.target.value;
        transparentBgCheckbox.checked = false;
    });

    bgColorTextInput.addEventListener('input', (e) => {
        const value = e.target.value;
        if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
            bgColorInput.value = value;
            transparentBgCheckbox.checked = false;
        }
    });

    // Transparent background checkbox
    transparentBgCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            bgColorInput.disabled = true;
            bgColorTextInput.disabled = true;
        } else {
            bgColorInput.disabled = false;
            bgColorTextInput.disabled = false;
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
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
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
    
    // Read audio file
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            // Initialize audio context
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioBuffer = await audioContext.decodeAudioData(e.target.result);
            audioDuration = audioBuffer.duration;
            
            // Display file info with safe text content
            const fileSize = (file.size / 1024 / 1024).toFixed(2);
            const minutes = Math.floor(audioDuration / 60);
            const seconds = Math.floor(audioDuration % 60);
            const durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Clear previous content
            fileInfo.innerHTML = '';
            
            // Create safe elements
            const fileNameLabel = document.createElement('strong');
            fileNameLabel.textContent = 'Name: ';
            const fileNameText = document.createTextNode(file.name);
            
            const fileDurationLabel = document.createElement('strong');
            fileDurationLabel.textContent = 'Duration: ';
            const fileDurationText = document.createTextNode(durationStr);
            
            const fileTypeLabel = document.createElement('strong');
            fileTypeLabel.textContent = 'Type: ';
            const fileTypeText = document.createTextNode(file.type);
            
            const fileSizeLabel = document.createElement('strong');
            fileSizeLabel.textContent = 'Size: ';
            const fileSizeText = document.createTextNode(`${fileSize} MB`);
            
            // Append elements
            fileInfo.appendChild(fileNameLabel);
            fileInfo.appendChild(fileNameText);
            fileInfo.appendChild(document.createElement('br'));
            fileInfo.appendChild(fileDurationLabel);
            fileInfo.appendChild(fileDurationText);
            fileInfo.appendChild(document.createElement('br'));
            fileInfo.appendChild(fileTypeLabel);
            fileInfo.appendChild(fileTypeText);
            fileInfo.appendChild(document.createElement('br'));
            fileInfo.appendChild(fileSizeLabel);
            fileInfo.appendChild(fileSizeText);

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

    const waveColor = waveColorInput.value;
    const bgColor = transparentBgCheckbox.checked ? null : bgColorInput.value;
    let width, height;

    // Calculate dimensions based on sizing mode
    if (sizingMode === 'time') {
        const duration = audioBuffer.duration;
        const multiplier = parseInt(timeMultiplierInput.value);
        
        // Strictly: width = duration × px/sec
        width = Math.round(duration * multiplier);
        
        // Height is user-defined
        height = parseInt(verticalHeightInput.value);

        // Ensure reasonable bounds
        width = Math.max(320, Math.min(3840, width));
        height = Math.max(100, Math.min(2160, height));
    } else {
        // Fixed size mode
        width = parseInt(canvasWidthInput.value);
        height = parseInt(canvasHeightInput.value);
    }

    // Set canvas size
    waveformCanvas.width = width;
    waveformCanvas.height = height;

    // Draw waveform on canvas
    drawWaveform(audioBuffer, waveformCanvas, waveColor, bgColor);

    // Show export button
    exportBtn.style.display = 'inline-block';
    generateBtn.disabled = false;
}

function drawWaveform(buffer, canvas, waveColor, bgColor) {
    const ctx = canvas.getContext('2d', { alpha: true });
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background if not transparent
    if (bgColor) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
    }

    const data = buffer.getChannelData(0); // Get first channel
    const step = Math.ceil(data.length / width);
    const amp = height / 2;

    ctx.fillStyle = waveColor;
    ctx.strokeStyle = waveColor;

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
    audioDuration = 0;
    sizingMode = 'time';

    // Reset file input
    audioFileInput.value = '';

    // Hide sections
    controlsSection.style.display = 'none';
    previewSection.style.display = 'none';
    progressContainer.style.display = 'none';

    // Reset form values
    waveColorInput.value = '#000000';
    waveColorTextInput.value = '#000000';
    bgColorInput.value = '#ffffff';
    bgColorTextInput.value = '#ffffff';
    transparentBgCheckbox.checked = false;
    bgColorInput.disabled = false;
    bgColorTextInput.disabled = false;
    canvasWidthInput.value = '1280';
    canvasHeightInput.value = '720';
    timeMultiplierInput.value = '100';
    verticalHeightInput.value = '400';

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
