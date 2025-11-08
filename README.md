# WaveGenQ

A simple, browser-based tool for generating animated waveform videos from audio files. Create beautiful visualizations with transparent backgrounds that can be used in video editing, social media, and more.

## Features

- 🎵 **Audio File Support**: Supports MP3, WAV, OGG, M4A and other common audio formats
- 🎨 **Customizable Appearance**: Choose your waveform color and canvas dimensions
- 🎬 **Animated Output**: Generate videos with waveforms that animate from start to finish
- 🌈 **Transparent Background**: Export with alpha channel for easy compositing
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🚀 **No Installation Required**: Run directly in your browser using VSCode Live Server
- 🎯 **Zero Dependencies**: No npm, no node_modules - everything loads from CDN

## Quick Start

### Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/)
- [Live Server Extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/AkutaZehy/WaveGenQ.git
   cd WaveGenQ
   ```

2. Open the project folder in Visual Studio Code

3. Install the Live Server extension if you haven't already:
   - Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (Mac)
   - Search for "Live Server"
   - Click Install

### Running the Application

1. Open `index.html` in VSCode

2. Right-click on the file and select "Open with Live Server"
   - Alternatively, click the "Go Live" button in the status bar at the bottom of VSCode

3. Your default browser will open with the application running at `http://127.0.0.1:5500` (or similar)

## Usage

### Step 1: Upload Audio File
- Click the upload area or drag and drop an audio file
- Supported formats: MP3, WAV, OGG, M4A

### Step 2: Customize Settings
- **Waveform Color**: Choose the color for your waveform visualization
- **Canvas Width**: Set the width of the output video (default: 1280px)
- **Canvas Height**: Set the height of the output video (default: 720px)
- **Frame Rate**: Set the frames per second (default: 30fps)

### Step 3: Generate Waveform
- Click "Generate Waveform Animation" to preview the waveform
- The preview will show the complete waveform

### Step 4: Export Video
- Click "Export as MP4" to render and download the animated video
- The video will animate from the start, showing the waveform progressively
- Output format is WebM (VP9 codec with alpha channel for transparency)

### Converting to MP4

The application exports WebM format with transparency. To convert to MP4 while preserving transparency:

**Using FFmpeg (command line):**
```bash
ffmpeg -i input.webm -c:v png -pix_fmt rgba output.mov
```

Note: MP4 traditionally doesn't support alpha transparency. Use MOV or WebM for transparent backgrounds. For MP4, you can use:
```bash
ffmpeg -i input.webm -c:v libx264 -pix_fmt yuv420p output.mp4
```
(This will lose transparency but create a widely compatible MP4)

**Online Converters:**
- [CloudConvert](https://cloudconvert.com/)
- [FreeConvert](https://www.freeconvert.com/video-converter)

## Technical Details

### Technologies Used

- **HTML5 Canvas**: For rendering the waveform
- **Web Audio API**: For audio processing and analysis
- **MediaRecorder API**: For video recording
- **WaveSurfer.js**: For advanced audio visualization (loaded from CDN)

### Browser Compatibility

This application works best in modern browsers that support:
- Web Audio API
- MediaRecorder API
- Canvas API
- VP9 codec

Recommended browsers:
- Google Chrome (88+)
- Microsoft Edge (88+)
- Firefox (75+)
- Safari (14.1+)

### File Structure

```
WaveGenQ/
├── index.html      # Main HTML file
├── styles.css      # Styling and layout
├── app.js          # Application logic
├── LICENSE         # MIT License
└── README.md       # This file
```

## Customization

### Changing Default Settings

Edit `app.js` to modify default values:

```javascript
// Default canvas size
canvasWidthInput.value = '1280';
canvasHeightInput.value = '720';

// Default color
waveColorInput.value = '#00ff88';

// Default frame rate
fpsInput.value = '30';
```

### Styling

Modify `styles.css` to change the appearance:

```css
:root {
    --primary-color: #00ff88;
    --secondary-color: #0088ff;
    --bg-color: #0a0e27;
    /* ... more variables */
}
```

## Troubleshooting

### Video Export Issues

**Problem**: Export button doesn't work
- **Solution**: Ensure your browser supports the MediaRecorder API and VP9 codec

**Problem**: Video has no transparency
- **Solution**: Make sure you're using a browser that supports VP9 with alpha channel. Try Chrome or Edge.

### Audio Issues

**Problem**: Audio file won't load
- **Solution**: Check that the file is a valid audio format and not corrupted

**Problem**: No sound in exported video
- **Solution**: Ensure your browser has permission to access audio. Check browser settings.

### Performance Issues

**Problem**: Export is slow
- **Solution**: Reduce canvas size or frame rate for faster processing

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- [WaveSurfer.js](https://wavesurfer-js.org/) for audio visualization capabilities
- Built with modern web technologies and Web APIs

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/AkutaZehy/WaveGenQ/issues) on GitHub.

---

Made with ❤️ for the audio visualization community