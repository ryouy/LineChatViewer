"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { getAvatarUrl } from "@/lib/imageConfig";
import { ChatBubble } from "./ChatBubble";
import type { ChatMessage } from "@/types/chat";
import type { ThemeConfig } from "@/types/theme";

type ChatMessageRowProps = {
  message: ChatMessage;
  theme: ThemeConfig;
  showTime?: boolean;
  isHighlighted?: boolean;
  showSenderName?: boolean;
};

export function ChatMessageRow({
  message,
  theme,
  showTime = true,
  isHighlighted,
  showSenderName = false,
}: ChatMessageRowProps) {
  const isSystem = message.type === "system" || message.type === "canceled";
  const isMine = message.isMine;

  return (
    <div
      id={message.id}
      data-message-id={message.id}
      data-date={message.date}
      className="mb-2 w-full"
    >
      <div
        className={cn(
          "flex w-full gap-1.5",
          isSystem ? "justify-center" : isMine ? "flex-row-reverse" : "flex-row"
        )}
      >
        {!isSystem && !isMine && (() => {
          const avatarSrc = getAvatarUrl(message.sender);
          return (
            <div className="shrink-0 pt-1">
              <Image
                src={avatarSrc}
                alt={message.sender}
                width={36}
                height={36}
                className="size-9 rounded-full object-cover"
                unoptimized={avatarSrc.startsWith("http")}
              />
            </div>
          );
        })()}
        <div
          className={cn(
            "flex flex-1 gap-1",
            isSystem ? "flex-col items-center w-full min-w-0" : isMine ? "flex-col items-end w-full min-w-[min(200px,100%)]" : "flex-col items-start w-full min-w-0"
          )}
        >
          {showSenderName && (
            <span
              className="text-xs font-medium px-1"
              style={{ color: theme.dateSeparatorText }}
            >
              {message.sender}
            </span>
          )}
          <div
            className={cn(
              "flex gap-1.5 items-end",
              isMine ? "flex-col items-end" : "flex-row items-end"
            )}
          >
            <ChatBubble message={message} theme={theme} isHighlighted={isHighlighted} />
            {showTime && !isSystem && (
              <span
                className="text-[10px] shrink-0"
                style={{ color: theme.dateSeparatorText }}
              >
                {message.time}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
