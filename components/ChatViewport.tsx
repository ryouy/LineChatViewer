"use client";

import { forwardRef, useState, useEffect, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { ChatMessageRow } from "./ChatMessageRow";
import { useChatStore } from "@/store/chatStore";
import { THEMES } from "@/store/themeStore";
import dayjs from "dayjs";
import type { ChatMessage } from "@/types/chat";

type ChatViewportProps = {
  messages: ChatMessage[];
  highlightId?: string | null;
  isGroup?: boolean;
};

export const ChatViewport = forwardRef<HTMLDivElement, ChatViewportProps>(
  function ChatViewport({ messages, highlightId, isGroup = false }, ref) {
    const themeId = useChatStore((s) => s.theme);
    const theme = THEMES[themeId];
    const [showScrollDown, setShowScrollDown] = useState(false);
    const scrollRef = ref as React.RefObject<HTMLDivElement | null>;

    const checkScroll = useCallback(() => {
      const el = scrollRef?.current;
      if (!el) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      setShowScrollDown(scrollHeight - scrollTop - clientHeight > 100);
    }, [scrollRef]);

    useEffect(() => {
      const el = scrollRef?.current;
      if (!el) return;
      checkScroll();
      el.addEventListener("scroll", checkScroll);
      return () => el.removeEventListener("scroll", checkScroll);
    }, [scrollRef, checkScroll, messages.length]);

    const scrollToBottom = useCallback(() => {
      scrollRef?.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [scrollRef]);

    let lastDate = "";
    let lastSender: string | null = null;

    return (
      <div
        ref={ref}
        className="relative flex-1 overflow-y-auto overflow-x-hidden px-1 py-4 min-h-full"
        style={{ backgroundColor: theme.background }}
      >
        <div className="w-full min-w-0">
          {messages.map((message) => {
            const showDate = message.date !== lastDate;
            if (showDate) {
              lastDate = message.date;
              lastSender = null;
            }

            const isSystem = message.type === "system" || message.type === "canceled";
            const showSenderName =
              isGroup &&
              !isSystem &&
              !message.isMine &&
              lastSender !== message.sender;
            if (!isSystem) lastSender = message.sender;

            const dateDisplay = dayjs(message.date).format("YYYY年M月D日");

            return (
              <div key={message.id}>
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span
                      className="text-xs px-3 py-1.5 rounded-full"
                      style={{
                        backgroundColor: theme.dateSeparatorBg,
                        color: theme.dateSeparatorText,
                      }}
                    >
                      {dateDisplay}
                    </span>
                  </div>
                )}
                <ChatMessageRow
                  message={message}
                  theme={theme}
                  isHighlighted={highlightId === message.id}
                  showSenderName={showSenderName}
                />
              </div>
            );
          })}
        </div>
        {showScrollDown && (
          <button
            type="button"
            onClick={scrollToBottom}
            className="absolute right-4 bottom-20 size-10 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors"
            aria-label="最新へ"
          >
            <ChevronDown className="size-5" />
          </button>
        )}
      </div>
    );
  }
);
