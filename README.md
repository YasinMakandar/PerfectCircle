# Perfect Circle Drawer

A Chrome extension that automatically draws a mathematically perfect circle on neal.fun/perfect-circle/ — the popular browser game where players test their ability to draw a flawless circle.

## ✨ Features

- **Automatic Circle Drawing** — Generates and traces a mathematically perfect circle using configurable parameters
- **Flexible Controls** — Adjust radius, drawing speed, and point density through an intuitive popup interface
- **Multiple Activation Methods** — Trigger the draw via popup button, floating page button, or keyboard shortcut (Shift+D)
- **Visual Feedback** — Real-time status updates and button animations confirm successful drawing

## 🎯 How It Works

The extension simulates precise mouse/pointer events along a calculated circular path:

1. Generates evenly-spaced points around a perfect circle based on your configured parameters
2. Dispatches a sequence of `mousedown`, `mousemove`, and `mouseup` events
3. Traces the complete circumference, creating a smooth, accurate circle

## ⚙️ Configuration Options

| Parameter | Range | Description |
|-----------|-------|-------------|
| **Radius** | 15% – 48% | Size of the circle relative to the drawing area |
| **Draw Speed** | 1ms – 20ms | Delay between each point (lower = faster) |
| **Points** | 100 – 1500 | Number of points along the circumference |

## 📥 Installation

1. Clone this repository or download the source files
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked** and select the extension directory
5. Visit [neal.fun/perfect-circle/](https://neal.fun/perfect-circle/) to start drawing

## 🚀 Usage

1. Navigate to [neal.fun/perfect-circle/](https://neal.fun/perfect-circle/)
2. Wait for the drawing area to load
3. Activate drawing using any of these methods:
   - Click the extension icon and press **Draw Perfect Circle**
   - Click the floating **⭕ Draw Circle** button on the page
   - Press **Shift + D** on your keyboard
4. Watch the extension trace a perfect circle!

## 📁 File Structure

```
├── manifest.json    # Extension manifest (Manifest V3)
├── content.js       # Core drawing logic (injected into page)
├── popup.html       # Extension popup UI
└── popup.js         # Popup interaction logic
```

## ⚠️ Notes

- The extension only works on `neal.fun/perfect-circle/`
- Ensure the drawing canvas is loaded and visible before triggering
- The keyboard shortcut is disabled when typing in input fields