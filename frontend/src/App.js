import React, { useState, useRef } from 'react';
import SidebarPanel from './components/SidebarPanel';
import LiveCanvas from './components/LiveCanvas';
import './App.css';

const App = () => {
  const canvasRef = useRef(null);
  const liveCanvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [elements, setElements] = useState([]);
  const [textFontSize, setTextFontSize] = useState(20);
  const [elementColor, setElementColor] = useState("#000000");

  const handleCreateCanvas = (height, width) => {
    setCanvasSize({ width: parseInt(width), height: parseInt(height) });
    setElements([]);
  };

  const handleAddElement = (type, extra = null) => {
    const base = {
      id: Date.now(),
      x: 100,
      y: 100,
      isSelected: false,
      color: elementColor
    };

    let newElement;

    switch (type) {
      case 'rectangle':
        newElement = { ...base, type, width: 120, height: 80 };
        break;
      case 'circle':
        newElement = { ...base, type, width: 100, height: 100, radius: 50 };
        break;
      case 'text':
        newElement = {
          ...base,
          type,
          text: extra || 'Text',
          size: textFontSize,
          width: 150,
          height: 40
        };
        break;
      case 'image':
        newElement = { ...base, type, url: extra, width: 150, height: 100 };
        break;
      default:
        return;
    }

    setElements((prev) => [...prev, newElement]);
  };

  const handleAddText = (text) => {
    if (text.trim()) handleAddElement('text', text);
  };

  const handleUploadImage = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      handleAddElement('image', base64);
    };
    reader.readAsDataURL(file);
  };

  const handleFontSizeChange = (size) => {
    setTextFontSize(size);
    liveCanvasRef.current?.updateFontSize(size);
  };

  const handleColorChange = (color) => {
    setElementColor(color);
    liveCanvasRef.current?.updateColor(color);
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "canvas-export.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleResetApp = () => {
    setCanvasSize({ width: 800, height: 600 });
    setElements([]);
    setTextFontSize(20);
    setElementColor("#000000");
    liveCanvasRef.current?.updateFontSize(20);
    liveCanvasRef.current?.updateColor("#000000");
  };

  return (
    <div className="app-container">
      <SidebarPanel
        onCreate={handleCreateCanvas}
        onAdd={handleAddElement}
        onAddText={handleAddText}
        onUploadImage={handleUploadImage}
        onExport={handleExport}
        textFontSize={textFontSize}
        onFontSizeChange={handleFontSizeChange}
        elementColor={elementColor}
        onColorChange={handleColorChange}
        onLogoClick={handleResetApp}
      />
      <div className="canvas-wrapper">
        <div className="canvas-inner">
          <LiveCanvas
            ref={liveCanvasRef}
            canvasRef={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            elements={elements}
            setElements={setElements}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
