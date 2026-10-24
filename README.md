# DataTools Pro for Cursor

Cursor plugin that connects the [DataTools Pro](https://datatoolspro.com) Metrics Glossary over MCP so the assistant can look up governed KPI definitions, relate dashboards and reports, tag metrics, and work with initiatives in the same workspace you use in the app.

Production MCP (Streamable HTTP): `https://mcp.us1.datatoolspro.com/mcp`

Authentication is **OAuth 2.0** with PKCE. Cursor registers as a public client (dynamic client registration). This repository does not contain client credentials, API keys, or access tokens. You sign in on DataTools Pro’s consent screen with a work email code, pick a workspace, and grant `metrics:read` (and write scopes only if you want creates and updates). The assistant never receives database credentials. Workspace isolation is enforced in the product.

The server cannot delete or merge records. Creating or updating metrics and initiatives needs extra consent.

- Docs: https://us1.datatoolspro.com/tutorials
- Privacy: https://us1.datatoolspro.com/privacy-policy
- Support: https://us1.datatoolspro.com/support and support@datatoolspro.com
- Terms: https://us1.datatoolspro.com/terms
- Homepage: https://datatoolspro.com

## Install from the Cursor Marketplace

1. Open [cursor.com/marketplace](https://cursor.com/marketplace) or **Customize** in Cursor and search for **DataTools Pro**.
2. Install the plugin for your user or project.
3. Complete the browser OAuth consent screen.
4. Ask: “Call whoami on DataTools Pro” or “What is our official definition of activation rate?”

Until the listing is live, use the local install steps below or add the MCP URL by hand.

Submit this public repo at https://cursor.com/marketplace/publish. Marketplace plugins are reviewed manually and must stay public. The listing does not follow git automatically, so request a re-index after you publish an update (see the release checklist in `CHANGELOG.md`).

cursor.directory: submit the same GitHub URL at https://cursor.directory/plugins/new if there is not already a listing. That site looks for `mcp.json` at the repo root.

## What this plugin does

After OAuth, the assistant can:

- Search and read the Metrics Glossary (`search_metrics`, `match_metric`, `list_metrics`, `get_metric`)
- Quote **Definition** (what the number is) separately from **Business Description** (why it matters)
- Show related dashboards and reports, metric-to-metric relationships, topics, and lines of business
- Create or update metrics and initiatives when you granted write scopes
- Leave a metric log note (it cannot dump existing notes)

The bundled **metrics-analyst** skill tells the agent to look up the glossary before inventing a KPI, to emit Findings on lookalike names, and to refuse delete/merge.

This public repository is the source of truth for everything public-facing about the plugin (manifests, skill, README, logo, changelog, and CI). The DataTools Pro application and MCP server are not in this repo.

## What is in this repo

| Path | Purpose |
| --- | --- |
| `plugin.json` | Agent Plugins 1.0.0 manifest (portable skills + MCP) |
| `.cursor-plugin/plugin.json` | Cursor Plugin manifest (Marketplace) |
| `.claude-plugin/plugin.json` | Claude plugin bundle manifest |
| `mcp.json` | Remote MCP, `type: streamable-http`, production URL, no secrets |
| `.mcp.json` | Claude connector URL (same host, `type: http`) |
| `skills/metrics-analyst/SKILL.md` | Glossary-first instructions for the agent |
| `assets/logo.png` | Marketplace logo (256×256 PNG) |
| `scripts/validate.mjs` | Manifest and packaging checks used in CI |

## Try it locally before you submit

Copy this folder to:

- macOS / Linux: `~/.cursor/plugins/local/datatools-pro`
- Windows: `%USERPROFILE%\.cursor\plugins\local\datatools-pro`

Reload Cursor (Developer: Reload Window), open **Customize**, and enable **DataTools Pro**. Complete OAuth, then ask: “Call whoami on DataTools Pro.”

On Enterprise, an admin must allow local plugin imports.

## Connect without the marketplace

In Cursor, open **Settings → MCP** (or a project `.cursor/mcp.json`) and add:

```json
{
  "mcpServers": {
    "datatools-pro": {
      "url": "https://mcp.us1.datatoolspro.com/mcp"
    }
  }
}
```

Restart Cursor. Cursor discovers OAuth from the server’s protected-resource metadata (`401` + `WWW-Authenticate`). Only trust `mcp.us1.datatoolspro.com`. Check the address bar before you enter a sign-in code.

## Privacy

The plugin itself stores no glossary data. Tool calls go to DataTools Pro’s production MCP worker, which reads and writes your workspace through the same tenant controls as the web app. See the privacy policy for collection, retention, and deletion. To revoke access, disconnect the MCP server in Cursor Customize and sign out of DataTools Pro connected apps.

## Support

Email support@datatoolspro.com or use https://us1.datatoolspro.com/support. Include the workspace name from `whoami` and the time of the failed tool call. Do not send access tokens.

Repository: https://github.com/DataToolsPro/datatools-pro-cursor-plugin
