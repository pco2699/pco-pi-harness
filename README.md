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

Levels: `off`, `minimal`, `low`, `medium`, `high`, `xhigh`, `max`.

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
  "defaultProvider": "openrouter",
  "defaultModel": "deepseek/deepseek-v4-pro-0813",
  "defaultThinkingLevel": "xhigh",
  "hideThinkingBlock": true
}
```

## Reproducing the full harness on a new machine

One command installs pi (if needed), installs this package plus `pi-web-access`,
and merges the settings above into `~/.pi/agent/settings.json` (preserving any
existing keys):

```bash
curl -fsSL https://raw.githubusercontent.com/pco2699/pco-pi-harness/master/setup.sh | sh
```

Or manually:

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
pi install git:github.com/pco2699/pco-pi-harness
pi install npm:pi-web-access
# then apply the settings snippet above and run /login for credentials
```

`setup.sh` intentionally does **not** set `defaultProvider` or any credentials —
those stay per-machine via `/login`.

## License

MIT
