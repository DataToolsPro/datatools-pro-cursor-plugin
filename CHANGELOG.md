# Changelog

All notable changes to the public DataTools Pro Cursor plugin are listed here.

## 1.1.0 — 2026-10-24

Marketplace-ready refresh ([DTPV3-732](https://goodmangroup.atlassian.net/browse/DTPV3-732)). This public repository is the source of truth for plugin manifests, skill, README, logo, changelog, and CI. Do not treat this changelog entry as a git tag; tag `v1.1.0` here only after review.

- Dual package format: Agent Plugins root `plugin.json` plus `.cursor-plugin/plugin.json` (and `.claude-plugin/plugin.json` for the Claude bundle).
- `mcp.json` uses Agent Plugins `$schema`, `type: streamable-http`, and the production URL `https://mcp.us1.datatoolspro.com/mcp`. OAuth is discovered at connect time. No secrets in the repo.
- Metrics Analyst skill aligned with production MCP (18 tools), including `search_metrics` routing, Definition vs Business Description, Findings, Draft-or-Active `create_metric`, and initiative tools.
- Listing logo: 256×256 PNG spark in production brand color `#1EE2AF` (see `assets/README.md` for the remaining artwork TODO).
- README install, privacy (`https://us1.datatoolspro.com/privacy-policy`), support, and local test steps.
- CI job runs `scripts/validate.mjs`.

### Release checklist (humans)

1. Merge this PR to `main`. **Do not merge from an agent unless an owner asked.**
2. Tag `v1.1.0` on this repository only after Ryan approves the listing copy in this repo.
3. Submit https://github.com/DataToolsPro/datatools-pro-cursor-plugin at https://cursor.com/marketplace/publish and accept the [Publisher Terms](https://cursor.com/marketplace-publisher-terms).
4. Submit the same URL at https://cursor.directory/plugins/new if it is not already listed.
5. After each later release, request a Marketplace re-index. Listings do not follow git automatically.

## 1.0.0 — 2026-09-25

Initial public plugin: `.cursor-plugin/plugin.json`, production MCP URL, first Metrics Analyst skill, placeholder bar-chart logo.
