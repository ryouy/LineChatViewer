"use client";

import { useState, useCallback, useEffect } from "react";
import type { ChatMessage } from "@/types/chat";

export function useScrollSync(messages: ChatMessage[], viewportRef: React.RefObject<HTMLElement | null>) {
  const [visibleDate, setVisibleDate] = useState<string | null>(null);

  const updateVisibleDate = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport || messages.length === 0) return;

    const rect = viewport.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const messageElements = viewport.querySelectorAll("[data-message-id]");

    let foundDate: string | null = null;
    for (const el of Array.from(messageElements)) {
      const r = (el as HTMLElement).getBoundingClientRect();
      if (r.top <= centerY && r.bottom >= centerY) {
        foundDate = (el as HTMLElement).dataset.date ?? null;
        break;
      }
    }
    if (!foundDate && messageElements.length > 0) {
      const last = messageElements[messageElements.length - 1] as HTMLElement;
      foundDate = last.dataset.date ?? null;
    }
    setVisibleDate(foundDate);
  }, [messages.length, viewportRef]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.addEventListener("scroll", updateVisibleDate, { passive: true });
    updateVisibleDate();
    return () => viewport.removeEventListener("scroll", updateVisibleDate);
  }, [updateVisibleDate, viewportRef]);

  return { visibleDate, updateVisibleDate };
}
