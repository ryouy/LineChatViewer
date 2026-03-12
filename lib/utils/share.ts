import LZString from "lz-string";
import type { ChatSession } from "@/types/chat";

export function createShareUrl(session: ChatSession): string {
  const data = {
    messages: session.messages,
    participants: session.participants,
    title: session.title,
  };
  const json = JSON.stringify(data);
  const compressed = LZString.compressToEncodedURIComponent(json);
  if (typeof window === "undefined") {
    return `/share?d=${compressed}`;
  }
  return `${window.location.origin}/share?d=${compressed}`;
}

export function parseShareData(d: string): {
  messages: ChatSession["messages"];
  participants: string[];
  title: string;
} | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(d);
    if (!json) return null;
    const data = JSON.parse(json);
    if (!data.messages || !Array.isArray(data.messages)) return null;
    return {
      messages: data.messages,
      participants: data.participants ?? [],
      title: data.title ?? "共有トーク",
    };
  } catch {
    return null;
  }
}
