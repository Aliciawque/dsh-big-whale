# Release 0.6.0-rc.7

Claude Code integration from merged PR #6 (commit `9f9d2a4186560663480c47385f1f501247d8f95a`). Publish on the npm `next` prerelease channel; leave `latest` unchanged.

The Claude Code plugin follows main-conversation turns, tools, permission prompts and compaction through a local companion. The shared routes preserve DSH behavior. The standalone companion survives Claude Code exit until its idle timer cleans up, and its runtime token file has restricted Windows permissions. The RC6 desktop runtime and existing character assets are retained.

Install after registry publication:

```sh
dsh plugin --profile web add dsh-big-whale@0.6.0-rc.7
```

The exact npm archive is tested in an isolated Web-backed DSH profile. See docs/VERIFICATION.md for bounded evidence. Character assets remain CC BY-NC-SA 4.0, code retains MIT notices.
