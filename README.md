# pco-pi-harness

A personal [pi](https://pi.dev) coding-agent harness. Bundles my extensions and the
settings I run with, so I can reproduce the same setup on any machine.

> This repo intentionally contains **no secrets**. `auth.json`, `trust.json`,
> session history, caches, and binaries are excluded.

## Install

```bash
pi install git:github.com/pco2699/pco-pi-harness
pi install npm:pi-web-access
# or pinned to a tag/commit:
#   pi install git:github.com/pco2699/pco-pi-harness@v1.0.0
# one-off without installing:
#   pi -e git:github.com/pco2699/pco-pi-harness
```

## What's included

### Extensions

| Extension | What it does |
|-----------|--------------|
| `thinking` | Adds `/t` as a short alias for the built-in `/thinking` command (selector or direct value). |
| `exit` | Adds `/exit` to quit pi (alias for the built-in `/quit`). |
| `vim` | Adds a modal prompt editor with Vim-style movement and editing keys. |

Levels: `off`, `minimal`, `low`, `medium`, `high`, `xhigh`, `max`.

The Vim editor starts in normal mode. Press `i`, `a`, `I`, `A`, `o`, or `O` to
enter insert mode and `Esc` to return to normal mode. Normal mode supports
`h/j/k/l`, `w`, `b`, `0`, `^`, `$`, `x`, `D`, and `u`. Pressing `Esc` again in
normal mode preserves pi's cancel/abort behavior; application shortcuts such as
Ctrl+C and Ctrl+D continue to work in both modes.

### Packages

| Package | What it provides |
|---------|------------------|
| [`pi-web-access`](https://github.com/nicobailon/pi-web-access) | Web search (`web_search`), page fetch (`fetch_content`), GitHub repo cloning, PDF extraction, and YouTube/local video understanding. Zero-config via Exa search. |

`pi-web-access` works out of the box with no API keys. To enable extra search
providers, add keys to `~/.pi/web-search.json` (never commit this file):

```json
{
  "openaiApiKey": "sk-...",
  "braveApiKey": "BSA_...",
  "exaApiKey": "exa-...",
  "tavilyApiKey": "tvly-..."
}
```

See its [README](https://github.com/nicobailon/pi-web-access) for the full list of
supported providers. Requires pi v0.37.3+.

### Settings

Settings are not part of a pi package, so they live here as reference. Merge what
you want into `~/.pi/agent/settings.json`:

```json
{
  "theme": "dark",
  "defaultProvider": "opencode-go",
  "defaultModel": "deepseek-v4.1-flash",
  "defaultThinkingLevel": "max",
  "hideThinkingBlock": true
}
```

### Web search defaults

`pi-web-access` reads `~/.pi/web-search.json` for defaults. This harness sets
`workflow` to `"auto-summary"` so searches skip the interactive browser curator
and stream a model-generated summary directly (no `localhost` popup, no 20s idle
wait). You can still override per-call with `"workflow": "none"` or
`"summary-review"`.

```json
{
  "workflow": "auto-summary"
}
```

## Reproducing the full harness on a new machine

One command installs pi (if needed), installs this package plus `pi-web-access`,
and merges the settings and web-search defaults into `~/.pi/agent/settings.json`
and `~/.pi/web-search.json` (preserving any existing keys):

```bash
curl -fsSL https://raw.githubusercontent.com/pco2699/pco-pi-harness/master/setup.sh | sh
```

Or manually:

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
pi install git:github.com/pco2699/pco-pi-harness
pi install npm:pi-web-access
# then apply the settings snippets above, copy web-search.json to ~/.pi/,
# and run /login for credentials
```

`setup.sh` applies the provider/model above but never writes credentials or
`auth.json` — run `/login` for `opencode-go` (or set `OPENCODE_API_KEY`) on each
machine.

## License

MIT
