let canvas = null;
let ctx = null;

let createCanvas, loadImage;
try {
  const canvasLib = require("canvas");
  createCanvas = canvasLib.createCanvas;
  loadImage = canvasLib.loadImage;
} catch (err) {
  console.error("[ERROR] Failed to load 'canvas' module:", err);
}

const PDFDocument = require("pdfkit");

exports.init = (width, height) => {
  try {
    canvas = createCanvas(Number(width), Number(height));
    ctx = canvas.getContext("2d");

    // Fill background white
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } catch (err) {
    console.error("[ERROR] Failed to initialize canvas:", err);
    throw err;
  }
};

exports.getCanvas = () => canvas;
exports.getContext = () => ctx;

exports.addElement = async (type, props) => {
  if (!ctx) throw new Error("Canvas not initialized");

  try {
    switch (type) {
      case "rectangle":
        ctx.fillStyle = props.color || "black";
        ctx.fillRect(props.x, props.y, props.width, props.height);
        break;

      case "circle":
        ctx.fillStyle = props.color || "black";
        ctx.beginPath();
        ctx.arc(props.x, props.y, props.radius, 0, Math.PI * 2);
        ctx.fill();
        break;

      case "text":
        ctx.fillStyle = props.color || "black";
        ctx.font = `${props.size || 20}px sans-serif`;
        ctx.fillText(props.text, props.x, props.y);
        break;

      case "image":
        if (!props.url) throw new Error("Image URL required");
        const img = await loadImage(props.url);
        ctx.drawImage(img, props.x, props.y, props.width, props.height);
        break;

      default:
        throw new Error("Unsupported element type");
    }
  } catch (err) {
    console.error("[ERROR] Failed to add element:", err);
    throw err;
  }
};

exports.drawUploadedImg = async (filePath, { x, y, width, height }) => {
  if (!ctx) throw new Error("Canvas not initialized");

  try {
    const img = await loadImage(filePath);
    ctx.drawImage(img, x, y, width, height);
  } catch (err) {
    console.error("[ERROR] Failed to draw uploaded image:", err);
    throw err;
  }
};

exports.exportAsPDF = () => {
  if (!canvas) throw new Error("Canvas not initialized");

  try {
    const buffer = canvas.toBuffer("image/png");
    const doc = new PDFDocument({ autoFirstPage: false });

    const width = canvas.width;
    const height = canvas.height;

    doc.addPage({ size: [width, height] });
    doc.image(buffer, 0, 0, { width, height });

    return doc;
  } catch (err) {
    console.error("[ERROR] Failed to export canvas as PDF:", err);
    throw err;
  }
};
