# Release: 0.6.0-rc.3

This prerelease adds the persistent idle-motion amplitude control from PR #1 and includes synchronized Chinese, English and Japanese documentation with LINUX DO acknowledgement links.

- Amplitude: 20%–120%, 5% steps, default 80%; changes apply immediately and survive restart.
- Recorded voices, character proportions, licenses and existing motion behavior are retained.
- Host and desktop diagnostics identify 0.6.0-rc.3.

Install the pinned release:

    dsh plugin --profile web add dsh-big-whale@0.6.0-rc.3

Or use the public prerelease channel: dsh-big-whale@next. Replace web with your Web-backed DSH profile and restart it after upgrading.

Package: https://www.npmjs.com/package/dsh-big-whale/v/0.6.0-rc.3

Tested scope: Windows, DSH 0.2.1-rc.5, Node.js 22.17+. Release preparation validates the market index and installs the exact npm archive into a separate Web-backed profile. The public archive is checked against that reviewed artifact after publication. See docs/VERIFICATION.md in the repository for the verification scope.

Character design credits: 上善无形 and ZipZipPipe. Character visuals remain CC BY-NC-SA 4.0; code has separate MIT notices. This is a fan-made project, not official DeepSeek or community-market certification.
