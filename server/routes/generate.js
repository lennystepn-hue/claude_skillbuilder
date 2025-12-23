const express = require("express");
const router = express.Router();
const { generateSkill, generateSkillWithKey } = require("../services/claude");
const { nanoid } = require("nanoid");
const fs = require("fs").promises;
const path = require("path");

const LIBRARY_PATH = path.join(__dirname, "../library");

// Input sanitization
function sanitizeInput(str) {
  if (typeof str !== "string") return "";

  // Remove potential injection patterns
  return str
    .slice(0, 2000) // Max length
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
    .replace(/[<>]/g, "") // Remove angle brackets
    .trim();
}

// Safe YAML field extraction (no regex on untrusted content for parsing)
function extractYamlField(content, field) {
  const lines = content.split("\n");
  for (const line of lines) {
    if (line.startsWith(`${field}:`)) {
      return line.substring(field.length + 1).trim();
    }
  }
  return null;
}

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;
    const userApiKey = req.headers["x-api-key"];

    // Input validation
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const sanitizedPrompt = sanitizeInput(prompt);

    if (sanitizedPrompt.length < 10) {
      return res.status(400).json({ error: "Please describe your skill in more detail (at least 10 characters)." });
    }

    // Generate skill (with user's key or server key)
    let skillContent;
    try {
      if (userApiKey && userApiKey.startsWith("sk-ant-")) {
        // Use user's own API key
        skillContent = await generateSkillWithKey(sanitizedPrompt, userApiKey);
      } else {
        // Use server's API key
        skillContent = await generateSkill(sanitizedPrompt);
      }
    } catch (err) {
      console.error("Claude API error:", err.message);
      return res.status(503).json({ error: err.message || "Failed to generate skill. Please try again." });
    }

    // Validate generated content
    if (!skillContent || skillContent.length < 50) {
      return res.status(500).json({ error: "Generated skill was invalid. Please try again." });
    }

    // Parse name and description safely
    const name = extractYamlField(skillContent, "name") || `skill-${nanoid(6)}`;
    const description = extractYamlField(skillContent, "description") || "";

    // Sanitize extracted values
    const safeName = name.replace(/[^a-z0-9-]/gi, "-").toLowerCase().slice(0, 50);
    const safeDescription = description.slice(0, 200);

    const id = nanoid(10);

    // Save to library
    const skillData = {
      id,
      name: safeName,
      description: safeDescription,
      content: skillContent,
      prompt: sanitizedPrompt,
      createdAt: new Date().toISOString(),
      published: true
    };

    try {
      await fs.mkdir(LIBRARY_PATH, { recursive: true });
      await fs.writeFile(
        path.join(LIBRARY_PATH, `${id}.json`),
        JSON.stringify(skillData, null, 2)
      );
    } catch (err) {
      console.error("File system error:", err);
      return res.status(500).json({ error: "Failed to save skill. Please try again." });
    }

    res.json({ skill: skillData });
  } catch (error) {
    console.error("Generate error:", error);
    res.status(500).json({ error: "An unexpected error occurred. Please try again." });
  }
});

module.exports = router;
