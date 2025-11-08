# WaveGenQ

A simple, browser-based tool for generating waveform images from audio files. Create beautiful visualizations with transparent backgrounds that can be used in video editing, social media, and more.

## Features

- 🎵 **Audio File Support**: Supports MP3, WAV, OGG, M4A and other common audio formats
- 🎨 **Customizable Appearance**: Choose your waveform color with built-in color picker
- 🖼️ **PNG Export**: Generate high-quality PNG images with transparent backgrounds
- 🌈 **Transparent Background**: Perfect for compositing in video editors
- 📐 **Intelligent Sizing**: Time-based sizing adapts to audio duration for optimal appearance
- 🌓 **Light/Dark Theme**: Toggle between light and dark modes with persistent preference
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🚀 **No Installation Required**: Run directly in your browser using VSCode Live Server
- 🎯 **Zero Dependencies**: No npm, no node_modules - pure vanilla JavaScript

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

#### Theme
- Click the moon/sun icon in the header to toggle between dark and light themes
- Your preference is saved automatically

#### Waveform Color
- Choose the color for your waveform visualization using the color picker

#### Sizing Mode

**Time-based (Recommended)**
- **Time Multiplier**: Controls the width based on audio duration (pixels per second)
  - Higher values = wider, more detailed waveforms
  - For 3-4 minute songs, 100-150 works well
  - For short SFX (< 5 seconds), use 200-500 for better visibility
- **Aspect Mode**:
  - **Balanced**: Good for most audio lengths (default)
  - **Horizontal Stretch**: Creates wider, flatter waveforms
  - **Vertical Stretch**: Creates taller, more compact waveforms

**Fixed Size**
- Manually set exact width and height in pixels
- Useful when you need specific dimensions

#### Frame Rate (Not used for image export, reserved for future features)
- Currently not applicable for PNG export
- May be used in future video export features

### Step 3: Generate Waveform
- Click "Generate Waveform" to create and preview the waveform image
- The preview shows the complete waveform with transparent background
- Dimensions are calculated based on your settings

### Step 4: Export Image
- Click "Export as PNG" to download the waveform image
- Output format is PNG with full alpha channel transparency
- The image can be directly imported into video editors, image editors, or used for web graphics

## Using the PNG in Video Editors

The exported PNG images work perfectly with:
- **DaVinci Resolve**: Drag and drop, transparency is preserved
- **Adobe Premiere Pro**: Import directly, use as overlay
- **Final Cut Pro**: Supports PNG transparency natively
- **After Effects**: Import and composite with any background
- **GIMP/Photoshop**: Full transparency support for further editing

## Tips for Best Results

### For Long Audio (3-5 minutes):
- Use Time-based mode with multiplier 100-150
- Choose "Balanced" or "Horizontal Stretch" aspect mode
- Results in wider, detailed waveforms

### For Short Audio/SFX (< 10 seconds):
- Use Time-based mode with multiplier 200-500
- Choose "Vertical Stretch" for better visibility
- Prevents overly compressed waveforms

### For Specific Dimensions:
- Switch to Fixed Size mode
- Enter exact width and height needed for your project
- Useful when you need to match specific aspect ratios

## Technical Details

### Technologies Used

- **HTML5 Canvas**: For rendering the waveform
- **Web Audio API**: For audio processing and analysis
- **Canvas toBlob API**: For PNG export with transparency

### Browser Compatibility

This application works best in modern browsers that support:
- Web Audio API
- HTML5 Canvas
- Canvas toBlob API

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

### Image Export Issues

**Problem**: Export button doesn't work
- **Solution**: Make sure you generated the waveform first by clicking "Generate Waveform"

**Problem**: Image has no transparency
- **Solution**: Ensure your browser supports Canvas toBlob with transparency. Try Chrome or Edge.

### Audio Issues

**Problem**: Audio file won't load
- **Solution**: Check that the file is a valid audio format and not corrupted

### Performance Issues

**Problem**: Large audio files are slow to process
- **Solution**: This is normal for very long audio files. The waveform generation processes the entire audio file to create an accurate visualization.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Built with modern web technologies and Web APIs

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/AkutaZehy/WaveGenQ/issues) on GitHub.

---

Made with ❤️ for the audio visualization community