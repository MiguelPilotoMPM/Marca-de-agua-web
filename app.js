const form = document.getElementById("watermarkForm");
const fileInput = document.getElementById("fileInput");
const textInput = document.getElementById("textInput");
const opacityInput = document.getElementById("opacityInput");
const canvas = document.getElementById("canvas");
const placeholder = document.getElementById("placeholder");
const downloadBtn = document.getElementById("downloadBtn");

const ctx = canvas.getContext("2d");
let currentImage = null;

const loadImage = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const drawWatermark = (img, text, opacity) => {
  const maxWidth = 960;
  const scale = Math.min(1, maxWidth / img.width);
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  canvas.width = width;
  canvas.height = height;

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.fillStyle = "#b33f2f";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const fontSize = Math.max(20, Math.floor(width / 18));
  ctx.font = `bold ${fontSize}px "Space Grotesk", Arial, sans-serif`;

  ctx.translate(width / 2, height / 2);
  ctx.rotate((-20 * Math.PI) / 180);

  const spacing = fontSize * 1.8;
  for (let y = -height; y <= height; y += spacing) {
    for (let x = -width; x <= width; x += spacing * 2) {
      ctx.fillText(text, x, y);
    }
  }

  ctx.restore();
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const file = fileInput.files[0];
  const text = textInput.value.trim();
  const opacity = parseFloat(opacityInput.value);

  if (!file || !text) {
    return;
  }

  try {
    currentImage = await loadImage(file);
    placeholder.style.display = "none";
    drawWatermark(currentImage, text, opacity);
    downloadBtn.disabled = false;
  } catch (error) {
    console.error("No se pudo cargar la imagen", error);
  }
});

downloadBtn.addEventListener("click", () => {
  if (!currentImage) {
    return;
  }

  const link = document.createElement("a");
  link.download = "documento_marca.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});
