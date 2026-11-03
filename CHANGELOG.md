# Changelog

## Unreleased

## 0.6.0-rc.7 — 2026-11-03

- Add a Claude Code plugin (`/plugin install big-whale --marketplace Aliciawque/dsh-big-whale`): turns, tool calls, permission asks and compactions of the main conversation drive the same expressions, voices and rice pose, through a shared local companion (`bin/claude-code-companion.mjs`).
- Share the `/whale-companion` routes between the DSH host and the Claude Code companion (`lib/routes.mjs`).
- Add a `/big-whale` command showing the companion's status and page.
- Add tests for the Claude Code event mapping, the standalone companion and the hooks module (`claude plugin test .`).
- Keep the standalone companion alive after Claude Code exits so its idle timer removes the runtime token and lock; restrict those files to the current Windows user and bypass HTTP proxies for local companion requests.
- Include the Claude Code plugin manifest, icon, and hooks in the npm archive.

## 0.6.0-rc.6 — 2026-11-03

- Read the reported plugin and desktop runtime version from package.json; the release check rejects hard-coded versions.
- Accept `localhost` and `[::1]` DSH origins for the Windows desktop runtime, not only `127.0.0.1`.
- Give each explicit desktop start a fresh single-instance retry budget, and reset it after a long-running session.
- Poll companion state every 5 s instead of every second while the desktop window is running.
- Add unit tests for the session state machine and the shared voice lease.
- Update the install command in the promotion drafts.

## 0.6.0-rc.5 — 2026-10-31

- Add the layered Halloween witch outfit, delayed hat/lantern physics, pumpkin menu button, witch rice pose and trilingual outfit greeting.
- Keep the menu clear of the character across full-body, upper-body and narrow windows.
- Align both outfits to the same body scale and foot baseline without stretching the artwork.
- Preserve the idle-amplitude control and DSH in-page fallback.
- Add release asset checks and CI regression tests.

## 0.6.0-rc.4 — 2026-10-30

- Fix the npm preview image, language navigation and documentation links with absolute GitHub URLs.
- Retain the RC3 runtime behavior; update reported release versions.

## 0.6.0-rc.3 — 2026-10-30

- Add a persistent 20%–120% idle-motion amplitude slider with Chinese, English and Japanese labels.
- Keep saved amplitude values and apply changes immediately through the existing renderer.
- Include trilingual LINUX DO community acknowledgement links and synchronized installation guides.
- Align host and desktop diagnostics with the package version.

## 0.6.0-rc.2 — 2026-10-30

- First public npm release of Big Whale for DSH 0.2.1-rc.5.
- Platform-neutral Big Whale introductions in Chinese, English and Japanese.
- Five selectable idle motions and eight expressions.
- Increased levels for the last four English and Japanese click recordings, with timing preserved.
- Windows Electron setup/probing and topmost fixes.
- Preserved the existing facial fit, smooth lip sync, hair/eye physics and rigid rice artwork.
- Public repository includes synchronized English, Chinese and Japanese guides and a validated custom market index.
