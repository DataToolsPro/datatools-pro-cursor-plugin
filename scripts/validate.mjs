#!/usr/bin/env node
/**
 * Cheap packaging checks for Cursor Marketplace / Agent Plugins / Claude bundle.
 * Run: node scripts/validate.mjs
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const kebab = /^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/;
const secretLike =
  /\b(sk_live_[A-Za-z0-9]+|sk_test_[A-Za-z0-9]+|AKIA[0-9A-Z]{16}|aws_secret_access_key\s*[:=]\s*\S+|client_secret\s*[:=]\s*["'][^"']{8,})/;
const bannedHost = /ryan-793\.workers\.dev|workers\.dev\/|dev\.us1\.datatoolspro\.com/i;

function fail(msg) {
  errors.push(msg);
}

function read(rel) {
  const p = join(root, rel);
  if (!existsSync(p)) {
    fail(`missing file: ${rel}`);
    return null;
  }
  return readFileSync(p, "utf8");
}

function parseJson(rel) {
  const raw = read(rel);
  if (raw == null) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    fail(`${rel} is not valid JSON: ${err.message}`);
    return null;
  }
}

function mustRelativePath(label, value) {
  if (typeof value !== "string" || !value) {
    fail(`${label} must be a relative path`);
    return;
  }
  if (value.startsWith("/") || value.includes("..") || /^[a-zA-Z]:\\/.test(value)) {
    fail(`${label} must be a repo-relative path without .. or absolute roots: ${value}`);
    return;
  }
  if (!existsSync(join(root, value))) {
    fail(`${label} path does not exist: ${value}`);
  }
}

const agent = parseJson("plugin.json");
if (agent) {
  if (agent.$schema !== "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json") {
    fail("plugin.json $schema must pin Agent Plugins 1.0.0");
  }
  if (agent.name !== "datatools-pro" || !kebab.test(agent.name)) {
    fail("plugin.json name must be datatools-pro (kebab-case)");
  }
  if (agent.version !== "1.1.0") fail("plugin.json version must be 1.1.0");
  if (!agent.description) fail("plugin.json needs description");
  if (agent.extensions && agent.extensions["com.openai.review"]) {
    fail("plugin.json must not include a com.openai.review block");
  }
}

const cursor = parseJson(".cursor-plugin/plugin.json");
if (cursor) {
  if (cursor.name !== "datatools-pro" || !kebab.test(cursor.name)) {
    fail(".cursor-plugin/plugin.json name must be datatools-pro");
  }
  if (cursor.version !== "1.1.0") fail(".cursor-plugin/plugin.json version must be 1.1.0");
  if (!cursor.description) fail(".cursor-plugin/plugin.json needs description");
  if (cursor.logo) mustRelativePath("logo", cursor.logo);
  if (cursor.author && !cursor.author.name) fail("author.name is required");
}

const claude = parseJson(".claude-plugin/plugin.json");
if (claude) {
  if (claude.name !== "datatools-pro") fail(".claude-plugin/plugin.json name must be datatools-pro");
  if (claude.license !== "MIT") fail(".claude-plugin/plugin.json license must be MIT");
}

const mcp = parseJson("mcp.json");
if (mcp) {
  if (mcp.$schema !== "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json") {
    fail("mcp.json $schema must pin Agent Plugins MCP 1.0.0");
  }
  const server = mcp.mcpServers && mcp.mcpServers["datatools-pro"];
  if (!server) fail("mcp.json must define mcpServers.datatools-pro");
  else {
    if (server.type !== "streamable-http") fail("mcp.json server type must be streamable-http");
    if (server.url !== "https://mcp.us1.datatoolspro.com/mcp") {
      fail("mcp.json must point at the production MCP endpoint");
    }
    if (server.headers && Object.keys(server.headers).length) {
      fail("mcp.json must not ship headers (no secrets)");
    }
    if (server.auth && (server.auth.CLIENT_SECRET || server.auth.CLIENT_ID)) {
      fail("mcp.json must not ship OAuth client credentials");
    }
  }
}

const claudeMcp = parseJson(".mcp.json");
if (claudeMcp) {
  const server = claudeMcp.mcpServers && claudeMcp.mcpServers["datatools-pro"];
  if (!server || server.url !== "https://mcp.us1.datatoolspro.com/mcp") {
    fail(".mcp.json must point at the production MCP endpoint");
  }
}

const skillRel = "skills/metrics-analyst/SKILL.md";
const skill = read(skillRel);
if (skill) {
  if (!/^---\n[\s\S]*?\n---\n/.test(skill)) fail("skill is missing YAML frontmatter");
  const fm = skill.match(/^---\n([\s\S]*?)\n---\n/);
  if (fm) {
    if (!/name:\s*metrics-analyst/.test(fm[1])) fail("skill frontmatter name must be metrics-analyst");
    if (!/description:/.test(fm[1])) fail("skill frontmatter must include description");
  }
  if (!skill.includes("Business Description")) {
    fail("skill must mention Business Description");
  }
  if (!skill.includes("search_metrics")) fail("skill must route through search_metrics");
  if (!skill.includes("https://mcp.us1.datatoolspro.com/mcp")) {
    fail("skill must cite the production MCP URL");
  }
}

for (const rel of ["README.md", "LICENSE", "CHANGELOG.md"]) {
  const body = read(rel);
  if (body && rel === "README.md") {
    const words = body
      .replace(/```[\s\S]*?```/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (words.length < 40) fail("README must have at least 40 words outside code blocks");
    for (const section of ["Install", "Privacy", "Support"]) {
      if (!new RegExp(section, "i").test(body)) fail(`README must include a ${section} section`);
    }
  }
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === ".git" || name === "node_modules") continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (/\.(md|json|yml|yaml|svg|txt)$/i.test(name)) {
      const text = readFileSync(p, "utf8");
      const rel = relative(root, p);
      if (secretLike.test(text)) fail(`possible secret in ${rel}`);
      if (bannedHost.test(text)) fail(`dev/preview host in ${rel}`);
    }
  }
}
walk(root);

if (errors.length) {
  console.error("validate.mjs failed:\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log("validate.mjs passed");
