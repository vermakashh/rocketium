import React, { useState, useContext } from "react";
import { CanvasContext } from "./LiveCanvas";

const AddElement = () => {
  const [type, setType] = useState("rectangle");
  const { setElements } = useContext(CanvasContext);

  const drawElement = () => {
    const defaultProps = {
      rectangle: { x: 50, y: 50, width: 100, height: 100, color: "#3498db" },
      circle: { x: 100, y: 100, radius: 50, color: "#e74c3c" },
      text: { x: 80, y: 80, text: "Sample Text", size: 24, color: "#2c3e50" },
      image: {
        x: 60,
        y: 60,
        width: 120,
        height: 80,
        url: "https://via.placeholder.com/120x80",
      },
    };

    const newElement = {
      id: `${type}-${Date.now()}`,
      type,
      ...defaultProps[type],
    };

    setElements((prev) => [...prev, newElement]);
  };

  return (
    <div>
      <h2>Add Element</h2>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="rectangle">Rectangle</option>
        <option value="circle">Circle</option>
        <option value="text">Text</option>
        <option value="image">Image (Placeholder)</option>
      </select>
      <button style={{ marginTop: "1rem" }} onClick={drawElement}>
        Add to Canvas
      </button>
    </div>
  );
};

export default AddElement;
