const express = require("express");
const path = require("path");

const app = express();

// serve frontend files
app.use(express.static(path.join(__dirname)));

// API endpoint
app.get("/api/products", (req, res) => {
  res.json([
    { id: 1, name: "Chocolate Chip", price: 25 },
    { id: 2, name: "Red Velvet", price: 30 }
  ]);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
