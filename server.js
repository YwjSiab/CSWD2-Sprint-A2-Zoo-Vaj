/* eslint-env node */
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Serve zoo animal data
app.get("/api/animals", (req, res) => {
  const dataPath = path.join(__dirname, "animals.json");
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Unable to read animals.json" });
    const animals = JSON.parse(data);
    res.json(animals);
  });
});

// Optional single animal route
app.get("/api/animals/:id", (req, res) => {
  const dataPath = path.join(__dirname, "animals.json");
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Unable to read animals.json" });
    const animals = JSON.parse(data);
    const animal = animals.find(a => a.id === parseInt(req.params.id));
    animal ? res.json(animal) : res.status(404).json({ error: "Animal not found" });
  });
});

// Health/warmup
app.get("/ping", (_req, res) => res.json({ ok: true }));

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the NTC Zoo API 🦁");
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
