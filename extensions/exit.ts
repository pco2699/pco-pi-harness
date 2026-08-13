/**
 * Exit Extension
 *
 * Adds /exit to quit pi (alias for the built-in /quit).
 * Uses ctx.shutdown() for a graceful exit: it emits session_shutdown
 * so extensions can clean up, and saves the session before quitting.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function exitExtension(pi: ExtensionAPI) {
  pi.registerCommand("exit", {
    description: "Exit pi",
    handler: async (_args, ctx) => {
      ctx.shutdown();
    },
  });
}
