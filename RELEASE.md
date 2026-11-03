# Release 0.6.0-rc.6

Desktop runtime hardening and state/voice regression coverage from merged PR #5 (commit `e60309f858db1a56a3e24fb5d628298c4b180096`). Publish on the npm `next` prerelease channel; leave `latest` unchanged.

The host and Electron report their package versions, the desktop runtime accepts IPv4/IPv6 localhost origins, explicit starts reset the single-instance retry budget, and the DSH page polls less often while the desktop window runs. The RC5 Halloween outfit, normal outfit, expressions, voices, idle amplitude, and DSH page fallback are retained.

Install after registry publication:

```sh
dsh plugin --profile web add dsh-big-whale@0.6.0-rc.6
```

The exact npm archive is tested in an isolated Web-backed DSH profile. See docs/VERIFICATION.md for bounded evidence. Character assets remain CC BY-NC-SA 4.0, code retains MIT notices.
