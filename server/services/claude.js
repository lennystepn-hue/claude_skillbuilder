const Anthropic = require("@anthropic-ai/sdk");

let client;

try {
  client = new Anthropic();
} catch (err) {
  console.error("Failed to initialize Anthropic client:", err.message);
  console.error("Make sure ANTHROPIC_API_KEY is set in .env");
}

const SYSTEM_PROMPT = `You are an expert in Claude Code Skills. Generate a SKILL.md based on the user request.

IMPORTANT: Reply ONLY with the SKILL.md content, no explanations before or after.

Format:
---
name: skill-name-kebab-case
description: Short description (1 sentence) when the skill activates
category: Dev|Docs|Testing|Security|DevOps|Data
---

# Skill Name

## Overview
Short description of what the skill does.

## Activation
When this skill automatically activates (e.g., "When the user asks for X...")

## Instructions
Detailed step-by-step instructions for what Claude should do.

## Examples
Concrete examples for input/output.

CATEGORIES (choose ONE):
- Dev: Code generation, debugging, refactoring, git workflows
- Docs: Documentation, README, API docs, comments
- Testing: Unit tests, integration tests, test coverage
- Security: Security audits, vulnerability scanning, auth
- DevOps: Docker, CI/CD, deployment, infrastructure
- Data: Database schemas, data modeling, migrations`;

async function callClaudeAPI(userPrompt, anthropicClient) {
  const message = await anthropicClient.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Create a Claude Code skill for the following requirement:\n\n${userPrompt}`
      }
    ]
  });

  // Defensive check for response structure
  if (!message?.content?.length || !message.content[0]?.text) {
    throw new Error("Invalid response from Claude API");
  }

  return message.content[0].text;
}

// Generate with server's API key
async function generateSkill(userPrompt) {
  if (!client) {
    throw new Error("Anthropic client not initialized. Check API key.");
  }

  try {
    return await callClaudeAPI(userPrompt, client);
  } catch (err) {
    handleApiError(err);
  }
}

// Generate with user's own API key (BYOK)
async function generateSkillWithKey(userPrompt, apiKey) {
  if (!apiKey || !apiKey.startsWith("sk-ant-")) {
    throw new Error("Invalid API key format");
  }

  try {
    const userClient = new Anthropic({ apiKey });
    return await callClaudeAPI(userPrompt, userClient);
  } catch (err) {
    handleApiError(err);
  }
}

function handleApiError(err) {
  if (err.status === 401) {
    throw new Error("Invalid API key");
  } else if (err.status === 429) {
    throw new Error("API rate limit exceeded. Please try again later.");
  } else if (err.status === 500) {
    throw new Error("Claude API is temporarily unavailable");
  }
  throw err;
}

module.exports = { generateSkill, generateSkillWithKey };
