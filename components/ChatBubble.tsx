"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { getPhotoUrl, getStickerUrl } from "@/lib/imageConfig";
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
      case "photo": {
        const photoSrc = getPhotoUrl(message.id);
        return (
          <div className="flex flex-col gap-1">
            <Image
              src={photoSrc}
              alt="写真"
              width={192}
              height={128}
              className="w-48 h-32 rounded-lg object-cover"
              unoptimized={photoSrc.startsWith("http")}
            />
          </div>
        );
      }
      case "sticker": {
        const stickerSrc = getStickerUrl(message.id);
        return (
          <Image
            src={stickerSrc}
            alt="スタンプ"
            width={96}
            height={96}
            className="w-24 h-24 rounded-xl object-cover"
            unoptimized={stickerSrc.startsWith("http")}
          />
        );
      }
      case "video":
        return (
          <div className="w-48 h-28 rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-sm">
            🎬 動画
          </div>
        );
      case "call":
        return (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-lg">📞</span>
            <span>通話</span>
          </div>
        );
      case "videoCall":
        return (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-lg">📹</span>
            <span>ビデオ通話</span>
          </div>
        );
      default:
        return (
          <p className="text-sm break-words text-left">
            {linkifyText(message.text)}
          </p>
        );
    }
  };

  const bubbleColor = isMine ? theme.bubbleMine : theme.bubbleOther;

  return (
    <div
      className={cn(
        "inline-flex max-w-[95%] min-w-0 rounded-[18px] px-4 py-2.5",
        isMine && "ml-auto"
      )}
      style={{
        backgroundColor: bubbleColor,
        color: isMine ? theme.bubbleMineText : theme.bubbleOtherText,
        boxShadow: isHighlighted
          ? "0 0 0 2px var(--primary), 0 1px 1px rgba(0,0,0,0.06)"
          : "0 1px 1px rgba(0,0,0,0.06)",
      }}
    >
      {displayContent()}
    </div>
  );
}
