"use client";

import { cn } from "@/lib/utils";
import { ChatBubble } from "./ChatBubble";
import type { ChatMessage } from "@/types/chat";
import type { ThemeConfig } from "@/types/theme";

type ChatMessageRowProps = {
  message: ChatMessage;
  theme: ThemeConfig;
  showTime?: boolean;
  isHighlighted?: boolean;
};

export function ChatMessageRow({
  message,
  theme,
  showTime = true,
  isHighlighted,
}: ChatMessageRowProps) {
  const isSystem = message.type === "system" || message.type === "canceled";
  const isMine = message.isMine;

  return (
    <div
      id={message.id}
      data-message-id={message.id}
      data-date={message.date}
      className="mb-2"
    >
      <div className={cn("flex flex-col gap-0.5", isMine ? "items-end" : "items-start")}>
        <ChatBubble message={message} theme={theme} isHighlighted={isHighlighted} />
        {showTime && !isSystem && (
          <span
            className="text-[10px] px-1"
            style={{ color: theme.dateSeparatorText }}
          >
            {message.time}
          </span>
        )}
      </div>
    </div>
  );
}
