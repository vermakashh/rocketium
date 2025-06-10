import React, { useState } from "react";
import axios from "axios";
import { apiBase } from "../api";

const ImageUploader = () => {
  const [file, setFile] = useState(null);
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("x", x);
      formData.append("y", y);
      formData.append("width", width);
      formData.append("height", height);

      const res = await axios.post(`${apiBase}/upload`, formData);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.error || "Upload failed");
    }
  };

  return (
    <div>
      <h2>Upload Image (File)</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <input placeholder="x" value={x} onChange={(e) => setX(e.target.value)} />
      <input placeholder="y" value={y} onChange={(e) => setY(e.target.value)} />
      <input placeholder="width" value={width} onChange={(e) => setWidth(e.target.value)} />
      <input placeholder="height" value={height} onChange={(e) => setHeight(e.target.value)} />
      <button onClick={handleUpload}>Upload Image</button>
    </div>
  );
};

export default ImageUploader;