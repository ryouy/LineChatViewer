"use client";

import { forwardRef } from "react";
import { ChatMessageRow } from "./ChatMessageRow";
import { useChatStore } from "@/store/chatStore";
import { THEMES } from "@/store/themeStore";
import dayjs from "dayjs";
import type { ChatMessage } from "@/types/chat";

type ChatViewportProps = {
  messages: ChatMessage[];
  highlightId?: string | null;
};

export const ChatViewport = forwardRef<HTMLDivElement, ChatViewportProps>(
  function ChatViewport({ messages, highlightId }, ref) {
    const themeId = useChatStore((s) => s.theme);
    const theme = THEMES[themeId];

    let lastDate = "";

    return (
      <div
        ref={ref}
        className="flex-1 overflow-y-auto overflow-x-hidden p-4 min-h-full"
        style={{ backgroundColor: theme.background }}
      >
        {messages.map((message) => {
          const showDate = message.date !== lastDate;
          if (showDate) lastDate = message.date;

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
              />
            </div>
          );
        })}
      </div>
    );
  }
);
