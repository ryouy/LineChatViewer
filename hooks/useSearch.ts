"use client";

import { useMemo, useState, useCallback } from "react";
import Fuse from "fuse.js";
import type { ChatMessage } from "@/types/chat";

type SearchResult = {
  item: ChatMessage;
  refIndex: number;
};

export function useSearch(messages: ChatMessage[]) {
  const [query, setQuery] = useState("");
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const fuse = useMemo(
    () =>
      new Fuse(messages, {
        keys: ["sender", "text", "date", "time"],
        threshold: 0.3,
        includeScore: true,
      }),
    [messages]
  );

  const results: SearchResult[] = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query).map((r) => ({ item: r.item, refIndex: r.refIndex }));
  }, [fuse, query]);

  const scrollToMessage = useCallback((id: string) => {
    setHighlightId(id);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => setHighlightId(null), 2000);
  }, []);

  return {
    query,
    setQuery,
    results,
    highlightId,
    scrollToMessage,
    totalCount: results.length,
  };
}
