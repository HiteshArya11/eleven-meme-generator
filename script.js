// Global Elements
const canvas = document.getElementById("memeCanvas");
const ctx = canvas.getContext("2d");
const loadingOverlay = document.getElementById("loadingOverlay");
const dimensionIndicator = document.getElementById("dimensionIndicator");

// Inputs & Controls
const imageInput = document.getElementById("imageInput");
const uploadZone = document.getElementById("uploadZone");
const presetsGrid = document.getElementById("presetsGrid");

const topTextInput = document.getElementById("topText");
const topSizeInput = document.getElementById("topSize");
const topSizeVal = document.getElementById("topSizeVal");
const topColorInput = document.getElementById("topColor");
const topStrokeColorInput = document.getElementById("topStrokeColor");
const topCapsToggle = document.getElementById("topCapsToggle");

const bottomTextInput = document.getElementById("bottomText");
const bottomSizeInput = document.getElementById("bottomSize");
const bottomSizeVal = document.getElementById("bottomSizeVal");
const bottomColorInput = document.getElementById("bottomColor");
const bottomStrokeColorInput = document.getElementById("bottomStrokeColor");
const bottomCapsToggle = document.getElementById("bottomCapsToggle");

const fontSelector = document.getElementById("fontSelector");
const strokeThicknessInput = document.getElementById("strokeThickness");
const strokeThicknessVal = document.getElementById("strokeThicknessVal");

const resetBtn = document.getElementById("resetBtn");
const downloadBtn = document.getElementById("downloadBtn");

// State variables
let loadedImage = null;
let isTopCaps = true;
let isBottomCaps = true;
const defaultTemplate = "templates/cyber_sunset.svg";

// Initialize application
window.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  loadTemplate(defaultTemplate);
});

// Setup event listeners for UI interactions
function setupEventListeners() {
  // Preset Selection
  const presets = presetsGrid.querySelectorAll(".preset-card");
  presets.forEach(preset => {
    preset.addEventListener("click", () => {
      presets.forEach(p => p.classList.remove("active"));
      preset.classList.add("active");
      
      const imgSrc = preset.getAttribute("data-src");
      loadTemplate(imgSrc);
    });
  });

  // Manual File Upload
  imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  });

  // Drag and Drop Upload
  uploadZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadZone.classList.add("dragover");
  });

  uploadZone.addEventListener("dragleave", () => {
    uploadZone.classList.remove("dragover");
  });

  uploadZone.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadZone.classList.remove("dragover");
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  // Live caption text inputs
  topTextInput.addEventListener("input", drawMeme);
  bottomTextInput.addEventListener("input", drawMeme);

  // Live sliders changes
  topSizeInput.addEventListener("input", (e) => {
    topSizeVal.innerText = `${e.target.value}px`;
    drawMeme();
  });

  bottomSizeInput.addEventListener("input", (e) => {
    bottomSizeVal.innerText = `${e.target.value}px`;
    drawMeme();
  });

  strokeThicknessInput.addEventListener("input", (e) => {
    strokeThicknessVal.innerText = `${e.target.value}px`;
    drawMeme();
  });

  // Style color pickers & toggles
  topColorInput.addEventListener("input", drawMeme);
  topStrokeColorInput.addEventListener("input", drawMeme);
  
  bottomColorInput.addEventListener("input", drawMeme);
  bottomStrokeColorInput.addEventListener("input", drawMeme);

  topCapsToggle.addEventListener("click", () => {
    isTopCaps = !isTopCaps;
    topCapsToggle.classList.toggle("active", isTopCaps);
    drawMeme();
  });

  bottomCapsToggle.addEventListener("click", () => {
    isBottomCaps = !isBottomCaps;
    bottomCapsToggle.classList.toggle("active", isBottomCaps);
    drawMeme();
  });

  fontSelector.addEventListener("change", drawMeme);

  // Buttons
  resetBtn.addEventListener("click", resetEditor);
  downloadBtn.addEventListener("click", downloadMeme);
}

// Loads local preset SVG templates safely
function loadTemplate(src) {
  showLoading(true);
  const img = new Image();
  img.crossOrigin = "anonymous"; // Request CORS access if remote, but local SVG is fully safe
  img.onload = () => {
    loadedImage = img;
    // Set appropriate canvas display dimensions matching image
    adjustCanvasSize(img.naturalWidth || 800, img.naturalHeight || 600);
    drawMeme();
    showLoading(false);
  };
  img.onerror = () => {
    console.error("Failed to load preset template: " + src);
    showLoading(false);
  };
  img.src = src;
}

// Handles custom image reading as DataURL (fully CORS-safe for canvas download)
function handleFile(file) {
  if (!file.type.startsWith("image/")) {
    alert("Please select a valid image file!");
    return;
  }

  showLoading(true);
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      loadedImage = img;
      
      // Clear preset grid active highlights since custom upload is selected
      const presets = presetsGrid.querySelectorAll(".preset-card");
      presets.forEach(p => p.classList.remove("active"));
      
      adjustCanvasSize(img.width, img.height);
      drawMeme();
      showLoading(false);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Scale canvas display resolution based on input size
function adjustCanvasSize(width, height) {
  // Cap resolution size for high performance/download ratio
  const maxDimension = 1200;
  let newWidth = width;
  let newHeight = height;

  if (width > maxDimension || height > maxDimension) {
    if (width > height) {
      newWidth = maxDimension;
      newHeight = Math.round((height / width) * maxDimension);
    } else {
      newHeight = maxDimension;
      newWidth = Math.round((width / height) * maxDimension);
    }
  }

  canvas.width = newWidth;
  canvas.height = newHeight;
  dimensionIndicator.innerHTML = `<i class="fa-solid fa-expand"></i> ${newWidth} x ${newHeight} PX`;
}

// Redraws canvas from scratch with active configuration settings
function drawMeme() {
  if (!loadedImage) return;

  // 1. Draw background image
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(loadedImage, 0, 0, canvas.width, canvas.height);

  // 2. Set default font parameters
  const selectedFont = fontSelector.value;
  const strokeThickness = parseInt(strokeThicknessInput.value);

  // 3. Render Top Text
  let topText = topTextInput.value;
  if (topText.trim() !== "") {
    if (isTopCaps) topText = topText.toUpperCase();
    
    const topSize = parseInt(topSizeInput.value);
    ctx.font = `900 ${topSize}px ${selectedFont}`;
    ctx.fillStyle = topColorInput.value;
    ctx.strokeStyle = topStrokeColorInput.value;
    ctx.lineWidth = strokeThickness;
    ctx.lineJoin = "round";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    // Text Position (Padding from top border)
    const topY = Math.round(canvas.height * 0.05);
    wrapText(topText, canvas.width / 2, topY, canvas.width * 0.9, topSize * 1.2, true);
  }

  // 4. Render Bottom Text
  let bottomText = bottomTextInput.value;
  if (bottomText.trim() !== "") {
    if (isBottomCaps) bottomText = bottomText.toUpperCase();

    const bottomSize = parseInt(bottomSizeInput.value);
    ctx.font = `900 ${bottomSize}px ${selectedFont}`;
    ctx.fillStyle = bottomColorInput.value;
    ctx.strokeStyle = bottomStrokeColorInput.value;
    ctx.lineWidth = strokeThickness;
    ctx.lineJoin = "round";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";

    // Text Position (Padding from bottom border)
    const bottomY = Math.round(canvas.height * 0.95);
    wrapText(bottomText, canvas.width / 2, bottomY, canvas.width * 0.9, bottomSize * 1.2, false);
  }
}

// Smart multi-line text wrapping. Supports drawing lines bottom-up or top-down.
function wrapText(text, x, y, maxWidth, lineHeight, isTop) {
  const words = text.split(" ");
  let lines = [];
  let currentLine = words[0] || "";

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);

  // Render on canvas
  if (isTop) {
    // Top text flows down: draw line 0 at y, line 1 at y + lineHeight...
    for (let i = 0; i < lines.length; i++) {
      const lineY = y + (i * lineHeight);
      ctx.strokeText(lines[i], x, lineY);
      ctx.fillText(lines[i], x, lineY);
    }
  } else {
    // Bottom text flows up: draw last line at y, second-to-last at y - lineHeight...
    for (let i = lines.length - 1; i >= 0; i--) {
      const lineIndexFromBottom = lines.length - 1 - i;
      const lineY = y - (lineIndexFromBottom * lineHeight);
      ctx.strokeText(lines[i], x, lineY);
      ctx.fillText(lines[i], x, lineY);
    }
  }
}

// Triggers active Canvas rendering export and immediate download
function downloadMeme() {
  if (!loadedImage) {
    alert("No meme available to download!");
    return;
  }

  try {
    showLoading(true);
    // Convert canvas to premium PNG data url
    const dataUrl = canvas.toDataURL("image/png");
    
    // Create browser virtual download click event
    const link = document.createElement("a");
    link.download = `cyber-meme-${Date.now()}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showLoading(false);
  } catch (err) {
    showLoading(false);
    console.error(err);
    alert(
      "Download failed: Make sure you are not using standard external images causing canvas taint (CORS policies). Uploading custom images locally works 100% securely!"
    );
  }
}

// Reset the entire editor suite state
function resetEditor() {
  topTextInput.value = "";
  bottomTextInput.value = "";
  
  topSizeInput.value = 48;
  topSizeVal.innerText = "48px";
  topColorInput.value = "#FFFFFF";
  topStrokeColorInput.value = "#000000";
  isTopCaps = true;
  topCapsToggle.classList.add("active");

  bottomSizeInput.value = 48;
  bottomSizeVal.innerText = "48px";
  bottomColorInput.value = "#FFFFFF";
  bottomStrokeColorInput.value = "#000000";
  isBottomCaps = true;
  bottomCapsToggle.classList.add("active");

  fontSelector.selectedIndex = 0;
  strokeThicknessInput.value = 5;
  strokeThicknessVal.innerText = "5px";

  // Re-select first template preset card
  const presets = presetsGrid.querySelectorAll(".preset-card");
  presets.forEach(p => p.classList.remove("active"));
  document.getElementById("preset1").classList.add("active");

  loadTemplate(defaultTemplate);
}

// Show/Hide spinner loading states
function showLoading(show) {
  loadingOverlay.style.display = show ? "flex" : "none";
}
