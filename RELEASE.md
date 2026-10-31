# Release 0.6.0-rc.5

Halloween outfit and companion layout correction. This candidate must pass the pull-request checks and review before merging and publishing to the npm `next` prerelease channel. `latest` is unchanged.

The release includes the layered witch costume, pumpkin button, ghost lantern physics, matching rigid rice pose, and Chinese / English / Japanese outfit greeting. Menus avoid the character, and outfit padding no longer changes body scale. Existing idle amplitude, normal outfit, expressions, introductions and DSH page fallback are retained.

Install after registry publication:

```sh
dsh plugin --profile web add dsh-big-whale@0.6.0-rc.5
```

The exact npm archive is tested in an isolated Web-backed DSH profile. See docs/VERIFICATION.md for bounded evidence. Character assets remain CC BY-NC-SA 4.0, code retains MIT notices.
