# Verification — 0.6.0-rc.8

## RC8 candidate checks (2026-11-08)

- Source: merged PR #7 at `f48b1e025399af56eddadc32c24519966989aaf7`. GitHub Release checks passed for the reviewed PR head and the merge commit.
- Windows checks passed: 21 Node tests, release structure checks, Claude plugin validation, and 4 Claude hook tests. The installed DSH 0.2.1-rc.5 validator accepted the format-1 index.
- The 72,180,407-byte candidate contains 310 files. SHA-256 is `cf299a2d686d4e12038891d581ebd257f6bff0d1235f5d1a8e565a24c5e0706d`. All installed files matched the candidate in a separate Web-backed DSH profile. The running host reported RC8 and served the shell and the new motion assets. The Claude-only event route returned HTTP 405 under DSH.
- On Windows Chrome, the standalone companion from that same installed archive handled compaction, completion, and failure through its token-protected local event endpoint. With event voice disabled, the three poses appeared and returned to regular motion. Repeated state polls did not replay expired poses. The standalone host cleaned up its runtime file after the test.

## RC8 public registry verification

- npm published `dsh-big-whale@0.6.0-rc.8` at 2026-11-08T11:18:57.027Z. The `next` tag points to RC8 and `latest` remains RC2.
- An anonymous download matched the 72,180,407-byte candidate byte for byte. The public SHA-1 and SHA-512 integrity also match the npm pack metadata.

## RC7 candidate checks (2026-11-03)

- Source base: merged PR #6, commit `9f9d2a4186560663480c47385f1f501247d8f95a`. This candidate adds the Claude Code plugin manifest and hooks to the npm archive; RC6 character assets and Electron dependency are unchanged.
- Windows `npm test` passes 19/19; `npm run check:release` passes across 288 runtime files, 51 JavaScript syntax checks, 60 costume references and three voice languages. Claude Code 2.1.317 `plugin validate` passes and `plugin test` passes 4/4. The installed DSH 0.2.1-rc.5 format-1 validator accepts the RC7 market index.
- Exact candidate archive: 71,659,542 bytes, 308 files, SHA-256 `572b019aa13fe9ebf43c4bbee247bc1452442a4f04bfc56e0ffccc888ab45daa`. The pack inventory includes `.claude-plugin/` and `hooks/` and no credential or profile files. All 308 files installed in a separate Web-backed DSH profile match the archive byte for byte.
- The isolated DSH host reports `dsh-big-whale` RC7; its HTML asset returns HTTP 200, while the token-only Claude event route remains disabled under DSH (HTTP 405). The optional Electron runtime was not set up in this Web profile.
- The Claude Code plugin in that exact installed npm artifact passed validation and a real Windows Claude Code 2.1.317 + GLM-5.3 headless Bash call. The companion emitted `task-start`, `tool-start`, `success`; its Electron window became ready and visible, then the companion removed its runtime and lock after the test idle interval. The interactive permission and compaction checks were performed on the same PR #6 source before packaging, not repeated from the npm archive.
- No regular DSH profile or Claude Code installation was replaced during candidate validation. These checks do not establish macOS behavior.

## RC7 public registry verification

- npm published `dsh-big-whale@0.6.0-rc.7` at 2026-11-03T06:40:46.189Z. The `next` tag points to RC7; `latest` remains RC2.
- An anonymous download of the public tarball is 71,659,542 bytes with SHA-256 `572b019aa13fe9ebf43c4bbee247bc1452442a4f04bfc56e0ffccc888ab45daa`, byte-identical to the reviewed candidate. Registry SHA-1 `80ca0866b217fa5dd3c5a0cef16a6b1fdf759d62` and SHA-512 integrity match the candidate pack result.
- A fresh isolated Web-backed DSH profile installed the exact public registry version. All 308 installed files matched the reviewed archive, and a real host returned `dsh-big-whale` RC7 with the HTML asset available. The optional Electron runtime was intentionally not set up in this second profile.

## RC6 candidate checks (2026-11-03)

- Source base: merged PR #5, commit `e60309f858db1a56a3e24fb5d628298c4b180096`. Release metadata advances the package to RC6; character assets and the optional Electron dependency are unchanged.
- All 15 Node regression tests pass. Release checks pass across 284 runtime files, 47 JavaScript syntax checks, 60 costume references, and three hashed voice tracks. The DSH 0.2.1-rc.5 format-1 validator accepts the RC6 market index.
- Exact candidate archive: 71,521,625 bytes, 299 files, SHA-256 `cb35da3e6ad075d1d1710679e29a342b670b6dee0688cb9ff29ca203fcf7d743`. All 299 files in the isolated Web-backed DSH profile match the archive byte for byte.
- On Windows, explicit Electron setup completed in that isolated profile. The real DSH 0.2.1-rc.5 host returned RC6 state; the desktop window reported RC6, renderer ready, visible and always on top, with no load or region error.
- Browser network events captured three `/whale-companion/state` requests while the desktop ran; both measured intervals were 5 seconds.
- After a controlled exit of the isolated Electron child, the host start route launched a new ready desktop process. A separate Electron instance then held the same single-instance lock until the host retry budget was exhausted. Once that blocker exited, an explicit start recovered to a new ready, visible desktop process.
- The isolated DSH Web page loaded without an account or model key. The user's regular DSH profile was not replaced.

The RC6 check is Windows-specific. It does not establish macOS/Linux behavior, a full LLM event flow, or a real localhost/IPv6 DSH host session.

## RC6 public registry verification

- npm published `dsh-big-whale@0.6.0-rc.6` at 2026-11-03T03:06:47.776Z. The `next` tag points to RC6; `latest` remains RC2.
- An anonymous download of the public tarball is 71,521,625 bytes with SHA-256 `cb35da3e6ad075d1d1710679e29a342b670b6dee0688cb9ff29ca203fcf7d743`, byte-identical to the tested archive. Registry SHA-1 `bb50f7612a15b9e5e3eef54fc21b4dfce6cbb009` and SHA-512 integrity also match the reviewed artifact.
- A fresh isolated DSH 0.2.1-rc.5 Web-backed profile installed the exact public registry version. All 299 installed files matched the anonymous public tarball. A real host boot returned `dsh-big-whale` and version `0.6.0-rc.6`; its desktop runtime was intentionally not set up in that second profile.

## RC5 candidate checks (2026-10-31)

- Seven Node regression tests pass: 1,260 menu placements, 400 outfit reference points, outfit load cancellation/retry/caching, 3,600-frame costume stability and 3,600-frame lantern stability.
- Release checks parse JSON, check all 47 runtime JavaScript files, verify 60 costume texture/matte references and hash all three Halloween recordings against their lip-sync tracks.
- The DSH format-1 validator accepts the updated market index.
- The exact 299-file npm archive installs into a separate DSH 0.2.1-rc.5 Web-backed profile; all installed files match the artifact sources. The user's normal profile is not replaced.
- A real Windows Chromium DSH session loads both outfits through the in-page fallback, displays the amplitude slider and plays the three Halloween tracks with mouth movement. Final browser evidence is retained in the local release report.
- Earlier full-body, upper-body and narrow-window browser checks showed no menu/character overlap. The outfits share body scale, origin and foot baseline. Costume visual acceptance remains subjective.

This run validates Windows Web rendering and an isolated package installation. It does not establish macOS/Linux rendering or repeat every historical native-Electron/LLM event scenario. CI, PR review and public-registry verification are recorded separately after they complete. Historical RC4 evidence follows.

## RC4 verification

RC4 corrects npm-facing README URLs and release version strings. It does not change runtime logic. Its exact archive is installed in a separate Web-backed DSH profile and checked file by file. All runtime assets match the RC3 archive; the host/desktop changes only report the new version. The prior RC3 UI checks below remain the behavior evidence. The public npm archive is compared after publication, followed by a fresh registry installation.

## RC4 public registry verification

- npm: dsh-big-whale@0.6.0-rc.4, published 2026-10-30T12:47:17.238Z, next channel.
- Reviewed/public archive: 38474018 bytes, 236 files.
- SHA-256: `59a1fc5f59b8ad624fc01227c7c5a3f4920dd184e2dac9e3de4ddd9fcb4dcf7b`.
- Public SHA-1/SHA-512 registry integrity and downloaded archive matched the reviewed package.
- Installed the exact public npm version in a fresh isolated Web-backed profile; all 236 files matched the reviewed source.
- Absolute preview and trilingual documentation links are included; all 210 runtime assets match RC3.
- The active user DSH profile and desktop preferences were not replaced by this isolated check.

## RC3 verification

Host: DSH 0.2.1-rc.5, Windows, Node.js 24.11.1.

RC3 changes the amplitude-menu controls and release metadata. Its release checks cover JavaScript syntax, the official DSH format-1 index validator, release-file inventory, exact archive installation in an isolated Web-backed DSH profile, the reported host version, live amplitude changes and persistence, and trilingual labels. The public npm archive is compared with the reviewed archive after publication.

The same amplitude implementation was previously exercised at 80%, 20%, 120% and 115% across reload, including English and Japanese label switching. The actual desktop was ready and its served menu assets matched the installed GitHub merge commit. RC3 does not claim a repeated full native lifecycle or GLM provider-event E2E.

Cross-platform, other physical machines and full provider-event flows remain outside this release check. Word-internal phone timing is estimated. No official marketplace endorsement is implied.

## RC3 public registry verification

- npm: dsh-big-whale@0.6.0-rc.3, published 2026-10-30T12:30:23.997Z, next channel.
- Reviewed/public archive: 38474057 bytes, 236 files.
- SHA-256: `796b7a427fcd6bab0fe416a872ebd03a385b6696ed402681e1e3a69653c02dd8`.
- Public SHA-1/SHA-512 registry integrity and downloaded archive matched the reviewed package.
- Installed the exact public npm version in a fresh isolated Web-backed profile; all 236 files matched the reviewed source.
- The active user DSH profile and desktop preferences were not replaced by this isolated check.

## Previous release evidence

### RC2 — 2026-10-30

Public release: **dsh-big-whale@0.6.0-rc.2**. Tested host: **DSH 0.2.1-rc.5** on Windows.

- The public npm archive was downloaded without registry authentication and matched the approved archive: 38,475,845 bytes.
- SHA-256: `76ab469795dec911322f7aff86d56485073d22d950d21b7bd7c277599e37827f`.
- Installed `dsh-big-whale@next` from npm into a fresh Web-backed profile. All 236 release files matched; bundle activation and composed configuration passed.
- Prior targeted validation of this same runtime covered 78 mouth tracks, 11 actual voice playbacks, 5 idle controls, 8 expressions and idle-choice persistence.
- 32 existing regression checks and 2 Electron-runtime probe checks passed in release preparation.
- Explicit official Electron setup, Windows native readiness/topmost, plugin disable/re-enable and actual child exit passed on the development workstation.
- The public GitHub checkout adds multilingual documentation, repository metadata and a custom market index; the immutable npm archive remains the approved release artifact.

Other physical machines and native platforms have not been tested. Full editor/provider event E2E was not repeated for the registry publication. Phone durations within words are estimates. These checks do not imply official DeepSeek or marketplace certification.
