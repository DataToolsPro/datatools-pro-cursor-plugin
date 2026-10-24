# Listing assets

| File | Use |
| --- | --- |
| `logo.png` | Cursor Marketplace logo (256×256 transparent PNG). Referenced from `.cursor-plugin/plugin.json`. |
| `avatar.png` | Same 256×256 PNG (DTPV3-730 filename). |
| `logo.svg` | Vector spark for clients that prefer SVG. |
| `icon-32.png` | Production MCP `GET /icon.png` (32×32), the live brand spark. |

Color: `#1EE2AF` (`rgb(30, 226, 175)`), sampled from `https://mcp.us1.datatoolspro.com/icon.png` on 2026-10-24.

## TODO (human / DTPV3-730)

The 256×256 files are a geometric 4-pointed spark in the production brand color, not a pixel-perfect trace of the 32×32 master. ChatGPT plugin `assets/logo.png` was not on a public URL.

Replace `logo.png`, `avatar.png`, and `logo.svg` in this repository with the official DataTools Pro marketplace artwork (square, ≥48px, preferably 256×256 transparent PNG) when that file is available from design. Do not keep a second copy of these assets elsewhere for listings.
