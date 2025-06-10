import React, { useState } from "react";
import { Upload, Download } from "lucide-react";
import "./SidebarPanel.css";
import logo from "./assets/logo.png";

const SidebarPanel = ({
  onCreate,
  onAdd,
  onAddText,
  onUploadImage,
  onExport,
  textFontSize,
  onFontSizeChange,
  onColorChange
}) => {
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [text, setText] = useState("");
  const [type, setType] = useState("rectangle");
  const [file, setFile] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#000000");

  const handleColorChange = (e) => {
    const color = e.target.value;
    setSelectedColor(color);
    onColorChange(color);
  };

  return (
    <div className="sidebar">
       <img src={logo} alt="Logo" className="sidebar-logo" />

      <div className="group">
        <input type="number" placeholder="Height" value={height} onChange={(e) => setHeight(e.target.value)} />
        <input type="number" placeholder="Width" value={width} onChange={(e) => setWidth(e.target.value)} />
        <button onClick={() => onCreate(height, width)}>Create Canvas</button>
      </div>

      <div className="group">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="rectangle">Rectangle</option>
          <option value="circle">Circle</option>
        </select>
        <button onClick={() => onAdd(type)}>Add Element</button>
      </div>

      <div className="group">
        <input
          type="text"
          placeholder="Type your text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="number"
          placeholder="Font Size"
          value={textFontSize}
          onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
        />
        <button onClick={() => onAddText(text)}>Add Text</button>
      </div>

      <div className="group">
        <label className="upload-label">
          <Upload size={16} />
          Upload image
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </label>
        <button onClick={() => file && onUploadImage(file)}>Add Image</button>
      </div>

      <div className="group">
        <label>Change Color:</label>
        <input type="color" value={selectedColor} onChange={handleColorChange} />
      </div>

      <button className="export-btn" onClick={onExport}>
        Export Canvas <Download size={16} />
      </button>
    </div>
  );
};

export default SidebarPanel;
