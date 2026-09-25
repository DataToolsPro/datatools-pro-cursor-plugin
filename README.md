# DataTools Pro for Cursor

Cursor plugin that connects the [DataTools Pro](https://datatoolspro.com) Metrics Glossary over MCP.

Production server: `https://mcp.us1.datatoolspro.com/mcp`

The assistant can read your glossary, look up definitions, and — with extra consent — create or update metrics and initiatives. It cannot delete or merge records. You sign in on DataTools Pro’s own consent screen with a work email code and choose a workspace. The assistant never receives database credentials.

- Docs: https://datatoolspro.com/tutorials
- Privacy: https://datatoolspro.com/privacy
- Support: support@datatoolspro.com

## What is in this repo

| Path | Purpose |
| --- | --- |
| `.cursor-plugin/plugin.json` | Marketplace manifest |
| `mcp.json` | Remote MCP URL |
| `skills/metrics-analyst/SKILL.md` | Glossary-first instructions for the agent |
| `assets/logo.svg` | Listing logo (replace with the brand mark if you have one) |

This repository is only the Cursor plugin. The DataTools Pro application is not included.

Repository: https://github.com/DataToolsPro/datatools-pro-cursor-plugin

Submit that URL at https://cursor.com/marketplace/publish. Marketplace plugins are reviewed manually and must stay public. Listing does not follow git automatically, so submit again after you push an update.

## Try it locally before you submit

Copy this folder to:

`%USERPROFILE%\.cursor\plugins\local\datatools-pro`

Reload Cursor, open **Customize**, and install or enable **DataTools Pro**. Complete the browser consent screen, then ask: “Call whoami on DataTools Pro.”

## Connect without the marketplace

In Cursor, open **Settings → MCP** and add:

```json
{
  "mcpServers": {
    "datatools-pro": {
      "url": "https://mcp.us1.datatoolspro.com/mcp"
    }
  }
}
```

Restart Cursor. Only trust `mcp.us1.datatoolspro.com`. Check the address bar before you enter a sign-in code.
