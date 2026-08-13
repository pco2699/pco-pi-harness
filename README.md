# pco-pi-harness

A personal [pi](https://pi.dev) coding-agent harness. Bundles my extensions and the
settings I run with, so I can reproduce the same setup on any machine.

> This repo intentionally contains **no secrets**. `auth.json`, `trust.json`,
> session history, caches, and binaries are excluded.

## Install

```bash
pi install git:github.com/pco2699/pco-pi-harness
# or pinned to a tag/commit:
#   pi install git:github.com/pco2699/pco-pi-harness@v1.0.0
# one-off without installing:
#   pi -e git:github.com/pco2699/pco-pi-harness
```

## What's included

### Extensions

| Extension | What it does |
|-----------|--------------|
| `thinking` | Adds `/thinking` and `/t` commands to view or change the thinking level (selector or direct value). |

Levels: `off`, `minimal`, `low`, `medium`, `high`, `xhigh`, `max`.

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

```bash
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
pi install git:github.com/pco2699/pco-pi-harness
# then apply the settings snippet above and run /login for credentials
```

## License

MIT
