"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="ml-2 text-[11px] uppercase tracking-wider text-dim transition-colors hover:text-acid"
    >
      {copied ? "copied" : "copy"}
    </button>
  );
}
