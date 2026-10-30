# Big Whale — a coding companion

[English](README.md) · [简体中文](README.zh.md) · [日本語](README.ja.md)

[![npm next](https://img.shields.io/npm/v/dsh-big-whale/next?label=npm%20next)](https://www.npmjs.com/package/dsh-big-whale/v/0.6.0-rc.3)

A whale-girl desktop companion for DeepSeek Harness. She keeps you company while you code, reacts to events, and picks up a giant bowl of rice when your context is compacted.

<img src="docs/preview.png" width="330" alt="Big Whale coding companion, full-body preview">

Watch the [English feature demo on YouTube](https://www.youtube.com/watch?v=cyWnZlAHyJU) or the [Chinese demo on Bilibili](https://www.bilibili.com/video/BV17mxe6bEpe/).

## What she does

- Chinese, English and Japanese recorded voices with smooth lip sync.
- Mouse following, drag inertia, double-click upper-body view, eye and hair physics.
- Five idle motions and eight expressions; expressions can change while she speaks.
- Click interactions, gentle reminders to focus, event reactions and the rice pose.
- A small floating whale menu; Windows desktop mode or an in-page fallback.

## Install

Tested with **DSH 0.2.1-rc.5** and **Node.js 22.17+**. Use your existing Web-backed DSH profile; replace `web` with its name.

```sh
dsh plugin --profile web add dsh-big-whale@0.6.0-rc.3
dsh web
```

If DSH is already running, restart that profile. The public prerelease channel is `dsh-big-whale@next`.

Windows desktop mode uses the optional official Electron runtime. If your package manager skipped its install script, run this inside the installed plugin directory, then restart DSH:

```sh
node bin/desktop.mjs setup
```

The desktop pet stays visible when the DSH browser is minimized; the DSH host must remain running. Close her from the whale menu and reopen her from the whale launcher in DSH. Without an available desktop runtime, she appears inside the DSH page.

## Controls

Drag to place her; double-click to switch full body / upper body. Open the floating whale to choose language, play an introduction, change idle motion or expression, or show the rice pose.

Idle motions: natural breathing, body twist, side-to-side lean, shy sway and mixed showcase. Expressions: normal, happy, smiling eyes, unimpressed, surprised, tears, cute and playful anger, plus event-controlled selection.

Below the idle-motion selector, adjust sway amplitude from 20% to 120% (default 80%). Changes take effect immediately and are saved across restarts. Natural breathing keeps its gentle baseline.

The bundled voices need no Gemini or GLM key. DSH keeps its own model and provider settings. Arbitrary new text-to-speech is not included; phone timing within aligned words is estimated.

## Plugin markets

The repository includes a validated DSH format-1 index:

```text
https://raw.githubusercontent.com/Aliciawque/dsh-big-whale/main/market-index.json
```

In a DSH profile with Custom Plugin Market enabled, open **Plugins → Discover → Add index source** and add that URL. Community-directory discovery and official inclusion are separate processes. See [market details](MARKETPLACE.md).

## Community acknowledgement

This project recognizes and supports [LINUX DO](https://linux.do/) and its open exchange of knowledge.

## License and credits

Plugin code has MIT notices. Character design and derivative visual assets are **CC BY-NC-SA 4.0**: attribution, noncommercial use and ShareAlike. Design credits: **上善无形** and **ZipZipPipe**. The code license does not grant commercial rights to the character.

This is a fan-made community project, not an official DeepSeek product. Artwork uses AI-assisted generation and refinement; voices are synthetic.

[Attribution](ATTRIBUTION.md) · [License](LICENSE) · [Privacy](PRIVACY.md) · [Validation](docs/VERIFICATION.md) · [Promotion drafts](docs/PROMOTION.md) · [Issues](https://github.com/Aliciawque/dsh-big-whale/issues)
