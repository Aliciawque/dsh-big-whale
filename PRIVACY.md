# Local data and network behavior

The plugin uses the existing DSH local web server for model files, speech files, event status and a single-speaker audio lease. It does not include an LLM/TTS API key or change DSH's provider configuration. Bundled speech plays locally; arbitrary new sentences are not generated at runtime.

Desktop position, size, view, language, expression and idle preferences are browser/Electron profile data. Native profile and bounded runtime status live under `$DSH_HOME/plugin-data/big-whale` (default `~/.dsh/plugin-data/big-whale`). These are writable user data; the installed npm package is treated as read-only. The Electron child receives only a small system-environment allowlist, the local DSH origin, an owner PID and its data path.

The companion subscribes to DSH status events (turn/tool/approval/compaction). It does not create a workspace or copy source files, chat history, model credentials or DSH logs into the published package. Local status records contain current animation/voice metrics and bounded event labels. Closing DSH stops its owned desktop companion.

Installing the optional Electron runtime may download the official runtime. Registry installation and DSH's own model calls follow their respective products' network settings. No external analytics is added by this plugin.
