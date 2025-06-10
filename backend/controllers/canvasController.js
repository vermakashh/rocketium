const canvasService = require("../services/canvasService");

exports.initCanvas = (req, res) => {
  const { width, height } = req.body;

  if (!width || !height) {
    return res.status(400).json({ error: "Width and height are required" });
  }

  try {
    canvasService.init(width, height);
    return res.status(200).json({ message: "Canvas initialized" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to initialize canvas" });
  }
};

exports.addElement = async (req, res) => {
  const { type, properties } = req.body;

  if (!type || !properties) {
    return res.status(400).json({ error: "Type and properties are required" });
  }

  try {
    await canvasService.addElement(type, properties);
    return res.status(200).json({ message: `${type} added` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to add element" });
  }
};

exports.exportPDF = (req, res) => {
  try {
    const pdfStream = canvasService.exportAsPDF();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=canvas-export.pdf");
    pdfStream.pipe(res);
    pdfStream.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "PDF export failed" });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const filePath = req.file.path;
    const { x, y, width, height } = req.body;

    await canvasService.drawUploadedImg(filePath, {
      x: Number(x),
      y: Number(y),
      width: Number(width),
      height: Number(height),
    });

    return res.status(200).json({ message: "Image uploaded and drawn" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Image upload failed" });
  }
};
