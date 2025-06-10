const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const canvasRoutes = require("./routes/canvasRoutes");

const app = express();
const port = 5050;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/api/canvas", canvasRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
