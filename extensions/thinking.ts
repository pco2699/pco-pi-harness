/**
 * Thinking Level Extension
 *
 * Adds /thinking and /t commands to view and change the current thinking level.
 *
 * Usage:
 *   /thinking            - show a selector to pick a level
 *   /thinking high       - set the level directly
 *   /t                   - alias for /thinking (no args = selector)
 *   /t max               - set directly
 *
 * Levels: off, minimal, low, medium, high, xhigh, max
 * The level is clamped to the model's capabilities (non-reasoning models -> "off").
 */

import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

const LEVELS = ["off", "minimal", "low", "medium", "high", "xhigh", "max"] as const;
type Level = (typeof LEVELS)[number];

function isLevel(value: string): value is Level {
  return (LEVELS as readonly string[]).includes(value);
}

export default function thinkingExtension(pi: ExtensionAPI) {
  async function chooseLevel(args: string, ctx: ExtensionContext): Promise<void> {
    const arg = args.trim();

    if (arg) {
      if (!isLevel(arg)) {
        ctx.ui.notify(`Unknown level "${arg}". Use: ${LEVELS.join(", ")}`, "error");
        return;
      }
      pi.setThinkingLevel(arg);
      ctx.ui.notify(`Thinking level set to "${pi.getThinkingLevel()}"`, "info");
      return;
    }

    // No argument: show a selector, marking the current level.
    const current = pi.getThinkingLevel();
    const items = LEVELS.map((level) => ({
      value: level,
      label: level === current ? `${level} (current)` : level,
    }));

    const choice = await ctx.ui.select("Thinking level", items);
    if (!choice) return;
    pi.setThinkingLevel(choice.value);
    ctx.ui.notify(`Thinking level set to "${pi.getThinkingLevel()}"`, "info");
  }

  const argumentCompletions = (prefix: string) => {
    const items = LEVELS.filter((l) => l.startsWith(prefix)).map((l) => ({ value: l, label: l }));
    return items.length > 0 ? items : null;
  };

  pi.registerCommand("thinking", {
    description: "View or change the thinking level",
    getArgumentCompletions: argumentCompletions,
    handler: (args: string, ctx: ExtensionContext) => chooseLevel(args, ctx),
  });

  pi.registerCommand("t", {
    description: "View or change the thinking level (alias for /thinking)",
    getArgumentCompletions: argumentCompletions,
    handler: (args: string, ctx: ExtensionContext) => chooseLevel(args, ctx),
  });
}
