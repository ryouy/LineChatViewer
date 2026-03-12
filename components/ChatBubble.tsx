"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chat";
import type { ThemeConfig } from "@/types/theme";

const URL_PATTERN = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/gi;

function linkifyText(text: string) {
  const parts = text.split(URL_PATTERN);
  return parts.map((part, i) => {
    if (part.match(URL_PATTERN)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800 break-all"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

type ChatBubbleProps = {
  message: ChatMessage;
  theme: ThemeConfig;
  isHighlighted?: boolean;
};

export function ChatBubble({ message, theme, isHighlighted }: ChatBubbleProps) {
  const isSystem = message.type === "system" || message.type === "canceled";
  const isMine = message.isMine;

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <span
          className={cn(
            "text-xs px-4 py-1.5 rounded-full",
            isHighlighted && "ring-2 ring-primary"
          )}
          style={{
            backgroundColor: theme.systemMessageBg,
            color: theme.systemMessageText,
          }}
        >
          {message.type === "canceled"
            ? "メッセージの送信を取り消しました"
            : message.text}
        </span>
      </div>
    );
  }

  const displayContent = () => {
    switch (message.type) {
      case "photo":
        return (
          <div className="flex flex-col gap-1">
            <Image
              src="https://picsum.photos/300/200"
              alt="写真"
              width={192}
              height={128}
              className="w-48 h-32 rounded-lg object-cover"
            />
          </div>
        );
      case "sticker":
        return (
          <div className="w-24 h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center bg-muted/30 px-3 py-2">
            <span className="text-2xl mb-1">🎭</span>
            <span className="text-[10px] text-muted-foreground">スタンプ</span>
          </div>
        );
      case "video":
        return (
          <div className="w-48 h-28 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-sm">
            🎬 動画
          </div>
        );
      default:
        return <p className="text-sm break-words">{linkifyText(message.text)}</p>;
    }
  };

  return (
    <div
      className={cn(
        "flex max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm",
        isMine ? "rounded-br-md ml-auto" : "rounded-bl-md"
      )}
      style={{
        backgroundColor: isMine ? theme.bubbleMine : theme.bubbleOther,
        color: isMine ? theme.bubbleMineText : theme.bubbleOtherText,
        boxShadow: isHighlighted ? "0 0 0 2px var(--primary)" : undefined,
      }}
    >
      {displayContent()}
    </div>
  );
}
