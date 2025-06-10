import React, { useContext, useState } from "react";
import axios from "axios";
import { apiBase } from "../api";
import { CanvasContext } from "./LiveCanvas";

const CanvasInit = () => {
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const { setCanvasSize } = useContext(CanvasContext);

  const handleInit = async () => {
    try {
      await axios.post(`${apiBase}/init`, { width, height });
      setCanvasSize({ width: Number(width), height: Number(height) });
    } catch (err) {
      alert(err.response?.data?.error || "Init failed");
    }
  };

  return (
    <div>
      <h2>Initialize Canvas</h2>
      <input placeholder="Width" value={width} onChange={(e) => setWidth(e.target.value)} />
      <input placeholder="Height" value={height} onChange={(e) => setHeight(e.target.value)} />
      <button onClick={handleInit}>Create Live Canvas</button>
    </div>
  );
};

export default CanvasInit;