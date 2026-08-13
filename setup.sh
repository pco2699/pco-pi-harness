#!/bin/sh
set -eu

REPO="github.com/pco2699/pco-pi-harness"

# Settings to apply. The provider is implied by the model id (deepseek/...).
# Credentials and defaultProvider are intentionally NOT set here.
DEFAULTS='{"theme":"dark","defaultModel":"deepseek/deepseek-v4-pro-0813","defaultThinkingLevel":"xhigh","hideThinkingBlock":true}'

AGENT_DIR="${PI_CODING_AGENT_DIR:-$HOME/.pi/agent}"
SETTINGS_FILE="$AGENT_DIR/settings.json"

echo "==> Checking for pi..."
if ! command -v pi >/dev/null 2>&1; then
  if ! command -v npm >/dev/null 2>&1; then
    echo "ERROR: npm not found. Install Node.js first: https://nodejs.org" >&2
    exit 1
  fi
  echo "    pi not found, installing..."
  npm install -g --ignore-scripts @earendil-works/pi-coding-agent
fi

install_if_missing() {
  spec="$1"
  if pi list 2>/dev/null | grep -qF "$spec"; then
    echo "    already installed: $spec"
  else
    pi install "$spec"
  fi
}

echo "==> Installing packages..."
install_if_missing "git:$REPO"
install_if_missing "npm:pi-web-access"

echo "==> Merging settings into $SETTINGS_FILE ..."
PI_HARNESS_DEFAULTS="$DEFAULTS" \
PI_HARNESS_SETTINGS_FILE="$SETTINGS_FILE" \
node -e '
const fs = require("fs");
const path = require("path");
const file = process.env.PI_HARNESS_SETTINGS_FILE;
const defaults = JSON.parse(process.env.PI_HARNESS_DEFAULTS);
let current = {};
if (fs.existsSync(file)) {
  try {
    current = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    console.warn("Warning: " + file + " is not valid JSON; starting fresh.");
  }
}
const merged = Object.assign({}, current, defaults);
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, JSON.stringify(merged, null, 2) + "\n");
console.log("    Applied: " + Object.keys(defaults).join(", "));
'

echo ""
echo "Done. Your harness is installed and settings are applied."
echo "Next steps:"
echo "  1. pi /login                     # add your provider credentials on this machine"
echo "  2. (optional) ~/.pi/web-search.json   # add web-search API keys (zero-config by default)"
echo "  3. pi                            # start a session"
