/**
 * Vim Editor Extension
 *
 * Replaces pi's prompt editor with a small modal editor. Escape enters normal
 * mode; insert-mode editing and application shortcuts continue to be handled
 * by pi's built-in editor.
 */

import { CustomEditor, type ExtensionAPI } from "@earendil-works/pi-coding-agent";

type Mode = "normal" | "insert";

const NORMAL_KEYS: Record<string, string> = {
  h: "\x1b[D", // left
  j: "\x1b[B", // down
  k: "\x1b[A", // up
  l: "\x1b[C", // right
  w: "\x1bf", // next word (Alt+F)
  b: "\x1bb", // previous word (Alt+B)
  "0": "\x01", // start of line (Ctrl+A)
  "^": "\x01",
  $: "\x05", // end of line (Ctrl+E)
  x: "\x1b[3~", // delete character under cursor
  D: "\x0b", // delete to end of line (Ctrl+K)
  u: "\x1a", // undo (Ctrl+Z)
};

export class VimEditor extends CustomEditor {
  private mode: Mode = "normal";
  onModeChange?: (mode: Mode) => void;

  private setMode(mode: Mode): void {
    this.mode = mode;
    this.onModeChange?.(mode);
    this.tui.requestRender();
  }

  handleInput(data: string): void {
    if (data === "\x1b") {
      if (this.mode === "insert") {
        this.setMode("normal");
      } else {
        // Preserve pi's normal Escape behavior (cancel/abort) on a second Esc.
        super.handleInput(data);
      }
      return;
    }

    if (this.mode === "insert") {
      super.handleInput(data);
      return;
    }

    const movement = NORMAL_KEYS[data];
    if (movement !== undefined) {
      super.handleInput(movement);
      return;
    }

    switch (data) {
      case "i":
        this.setMode("insert");
        return;
      case "a":
        super.handleInput("\x1b[C");
        this.setMode("insert");
        return;
      case "I":
        super.handleInput("\x01");
        this.setMode("insert");
        return;
      case "A":
        super.handleInput("\x05");
        this.setMode("insert");
        return;
      case "o":
        super.handleInput("\x05");
        super.handleInput("\n");
        this.setMode("insert");
        return;
      case "O":
        super.handleInput("\x01");
        super.handleInput("\n");
        super.handleInput("\x1b[A");
        this.setMode("insert");
        return;
    }

    // Keep application shortcuts and non-printable input working in normal
    // mode, while preventing ordinary characters from entering the prompt.
    if (data.length === 1 && data.charCodeAt(0) >= 32) return;
    super.handleInput(data);
  }
}

export default function vimExtension(pi: ExtensionAPI) {
  pi.on("session_start", (_event, ctx) => {
    ctx.ui.setStatus("vim", "VIM NORMAL");
    ctx.ui.setEditorComponent((tui, theme, keybindings) => {
      const editor = new VimEditor(tui, theme, keybindings);
      editor.onModeChange = (mode) => ctx.ui.setStatus("vim", `VIM ${mode.toUpperCase()}`);
      return editor;
    });
  });
}
