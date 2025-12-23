const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");

const LIBRARY_PATH = path.join(__dirname, "../library");

// Get all published skills
router.get("/", async (req, res) => {
  try {
    await fs.mkdir(LIBRARY_PATH, { recursive: true });
    const files = await fs.readdir(LIBRARY_PATH);
    const skills = [];

    for (const file of files) {
      if (file.endsWith(".json")) {
        const data = await fs.readFile(path.join(LIBRARY_PATH, file), "utf-8");
        const skill = JSON.parse(data);
        if (skill.published) {
          skills.push({
            id: skill.id,
            name: skill.name,
            description: skill.description,
            category: skill.category || "Dev"
          });
        }
      }
    }

    res.json({ skills });
  } catch (error) {
    console.error("List error:", error);
    res.status(500).json({ error: "Failed to load skills." });
  }
});

// Get single skill
router.get("/:id", async (req, res) => {
  try {
    const data = await fs.readFile(path.join(LIBRARY_PATH, `${req.params.id}.json`), "utf-8");
    res.json({ skill: JSON.parse(data) });
  } catch (error) {
    res.status(404).json({ error: "Skill not found." });
  }
});

// Get raw SKILL.md content
router.get("/:id/raw", async (req, res) => {
  try {
    const data = await fs.readFile(path.join(LIBRARY_PATH, `${req.params.id}.json`), "utf-8");
    const skill = JSON.parse(data);
    res.type("text/plain").send(skill.content);
  } catch (error) {
    res.status(404).json({ error: "Skill not found." });
  }
});

// Update skill
router.put("/:id", async (req, res) => {
  try {
    const filePath = path.join(LIBRARY_PATH, `${req.params.id}.json`);
    const data = await fs.readFile(filePath, "utf-8");
    const skill = JSON.parse(data);

    const updated = { ...skill, ...req.body, id: skill.id };
    await fs.writeFile(filePath, JSON.stringify(updated, null, 2));

    res.json({ skill: updated });
  } catch (error) {
    res.status(404).json({ error: "Skill not found." });
  }
});

// Publish skill
router.post("/:id/publish", async (req, res) => {
  try {
    const filePath = path.join(LIBRARY_PATH, `${req.params.id}.json`);
    const data = await fs.readFile(filePath, "utf-8");
    const skill = JSON.parse(data);

    skill.published = true;
    await fs.writeFile(filePath, JSON.stringify(skill, null, 2));

    res.json({ skill });
  } catch (error) {
    res.status(404).json({ error: "Skill not found." });
  }
});

module.exports = router;
