import React from "react";
import jsPDF from "jspdf";
import { Download } from "lucide-react";

const ExportButton = ({ canvasRef }) => {
  const exportCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("canvas-export.pdf");
  };

  return (
    <button className="export-btn" onClick={exportCanvas}>
      Export Canvas <Download size={16} />
    </button>
  );
};

export default ExportButton;
