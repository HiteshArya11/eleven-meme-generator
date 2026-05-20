# 🖥️ Eleven Meme Generator — Cyberpunk Redesign 🟢⚪🔴

An interactive, premium, high-performance web-based Meme Station styled with a futuristic cyberpunk design system utilizing a **Neon Green, White, and Red** color palette. Build custom high-quality memes instantly with zero CORS issues, customizable typography styles, advanced drag-and-drop file upload, and direct HTML5 Canvas PNG exporting.

Live Demo Station local server: `http://localhost:8000`

---

## ✨ Features

* **Futuristic Cyberpunk Theme**: Styled with a dark glassmorphism layout, vibrant neon colors (`#00FF66`, `#FF3131`, `#FFFFFF`), glowing outline accents, dynamic pulse status nodes, and smooth micro-animations.
* **100% CORS-Safe Meme Templates**: Bundled with 4 built-in responsive vector (`.svg`) templates designed locally, ensuring immediate loading and zero Canvas-tainting CORS blocks during download:
  - 🌅 **Cyber Sunset**: A retro perspective sunset horizon.
  - 🌃 **Neon City**: High-contrast tower outlines with a deep crimson moon.
  - 🎮 **Retro Gamer**: Classic arcade/console controller design in green and red.
  - 🪐 **Space Saturn**: Saturn planet rendering floating in glowing cosmic nebulae.
* **Interactive Drag-and-Drop Image Uploader**: Sleek custom upload block with mouse hover scale triggers and browser file selection delegation.
* **Real-time Live Canvas Preview**: Renders dynamic layout overlays instantly as you type or change configurations.
* **Precise Typography Controls**:
  - Independent **Top Caption** & **Bottom Caption** text fields.
  - Granular font sizing sliders.
  - Full RGB color picker support for text fill and text border stroke outlines.
  - Dynamic **Caps** locking toggle.
* **Global Configuration Options**:
  - Core Font selector: standard Impact, cyber Space Grotesk, minimal Outfit, Montserrat, and more.
  - Customizable border outline stroke thickness.
* **Intelligent Line Wrapping**: Automatic splitting of captions onto multiple lines based on image width to avoid canvas overflow. Includes a bottom-up flow algorithm for bottom captions to guarantee text stays anchored at the bottom edge.
* **High-Resolution PNG Download**: Converts rendered canvas states directly to clean image downloads.

---

## 🛠️ Technology Stack

1. **Structure**: Semantic HTML5 markup
2. **Styling**: Modern, responsive CSS3 using:
   - Custom properties (CSS variables) for immediate palette switching.
   - Glassmorphism backdrop-filters.
   - Keyframe-driven pulsing animations and transform glows.
   - Flexbox and Grid split-pane responsive architectures.
3. **Icons**: FontAwesome CDN vector libraries
4. **Typography**: Google Fonts integration (`Space Grotesk` and `Outfit` pairings)
5. **Logic**: Native modern ECMAScript Javascript interacting directly with the HTML5 Canvas API.

---

## 🚀 How to Run Locally

Since the application requires loading local vector templates (`.svg`) into the canvas, standard browsers may block local requests (`file:///` protocol) due to origin security policies. To avoid template loading issues, run the site through a local web server:

### Option A: Using Python (Recommended & Easiest)
1. Open terminal inside the project directory:
   ```bash
   cd eleven-meme-generator
   ```
2. Run Python's built-in HTTP server:
   ```bash
   python -m http.server 8000
   ```
3. Open browser and visit: `http://localhost:8000`

### Option B: Using Node / NPM
1. Run a quick temporary web server using `npx`:
   ```bash
   npx http-server
   ```
2. Open the URL provided in the console (usually `http://127.0.0.1:8080`).

---

## 📂 Project Structure

```text
eleven-meme-generator/
│
├── index.html          # Core workspace structure & HTML5 Canvas
├── style.css           # Custom cyberpunk variables, styles & micro-animations
├── script.js           # Real-time Canvas engine, wrapping logic & uploader
├── README.md           # Documentation
│
└── templates/          # High-fidelity vector templates (CORS-free)
    ├── cyber_sunset.svg
    ├── neon_city.svg
    ├── retro_gamer.svg
    └── space_meme.svg
```

---

