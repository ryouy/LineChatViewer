"use client";

import dayjs from "dayjs";
import { getStickerUrl, getAvatarUrl } from "@/lib/imageConfig";
import type { ChatMessage } from "@/types/chat";

// PDF用：本物のLINE UIに寄せた固定スタイル
const LINE_STYLE = {
  background: "#e5ddd5",
  bubbleMine: "#a7e070",
  bubbleOther: "#ffffff",
  bubbleMineShadow: "0 1px 2px rgba(0,0,0,0.1)",
  bubbleOtherShadow: "0 1px 1px rgba(0,0,0,0.08)",
  dateBg: "rgba(0,0,0,0.12)",
  dateText: "#5a5a5a",
  timeText: "#8e8e93",
  systemBg: "rgba(0,0,0,0.08)",
  systemText: "#5a5a5a",
};

type PdfChatViewProps = {
  messages: ChatMessage[];
  isGroup?: boolean;
};

function PdfBubble({
  message,
  isGroup,
}: {
  message: ChatMessage;
  isGroup: boolean;
}) {
  const isSystem = message.type === "system" || message.type === "canceled";
  const isMine = message.isMine;

  if (isSystem) {
    return (
      <div style={{ textAlign: "center" as const, margin: "12px 0" }}>
        <span
          style={{
            display: "inline-block",
            fontSize: 11,
            padding: "6px 14px",
            borderRadius: 12,
            backgroundColor: LINE_STYLE.systemBg,
            color: LINE_STYLE.systemText,
          }}
        >
          {message.type === "canceled"
            ? "メッセージの送信を取り消しました"
            : message.text}
        </span>
      </div>
    );
  }

  const content = () => {
    switch (message.type) {
      case "photo":
        return (
          <div
            style={{
              width: 160,
              height: 107,
              borderRadius: 8,
              backgroundColor: "rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: LINE_STYLE.timeText,
            }}
          >
            📷 写真
          </div>
        );
      case "sticker":
        return (
          // eslint-disable-next-line @next/next/no-img-element -- PDF用: 外部画像はimgで表示
          <img
            src={getStickerUrl(message.id)}
            alt="スタンプ"
            style={{
              width: 72,
              height: 72,
              borderRadius: 12,
              objectFit: "cover",
            }}
          />
        );
      case "video":
        return (
          <div
            style={{
              width: 160,
              height: 90,
              borderRadius: 8,
              backgroundColor: "rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: LINE_STYLE.timeText,
            }}
          >
            🎬 動画
          </div>
        );
      case "call":
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
            }}
          >
            <span>📞</span>
            <span>通話</span>
          </div>
        );
      case "videoCall":
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
            }}
          >
            <span>📹</span>
            <span>ビデオ通話</span>
          </div>
        );
      default:
        return (
          <span
            style={{
              fontSize: 14,
              lineHeight: 1.5,
              wordBreak: "break-word" as const,
              whiteSpace: "pre-wrap" as const,
            }}
          >
            {message.text}
          </span>
        );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 8,
        alignItems: "flex-start",
        justifyContent: isMine ? "flex-end" : "flex-start",
      }}
    >
      {!isMine && (
        // eslint-disable-next-line @next/next/no-img-element -- PDF用: 外部画像はimgで表示
        <img
          src={getAvatarUrl(message.sender)}
          alt={message.sender}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            objectFit: "cover",
            flexShrink: 0,
          }}
        />
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: isMine ? "flex-end" : "flex-start",
          maxWidth: "75%",
        }}
      >
        {isGroup && !isMine && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: LINE_STYLE.dateText,
              marginBottom: 2,
            }}
          >
            {message.sender}
          </span>
        )}
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 18,
            ...(isMine
              ? {
                  borderBottomRightRadius: 4,
                  backgroundColor: LINE_STYLE.bubbleMine,
                  boxShadow: LINE_STYLE.bubbleMineShadow,
                }
              : {
                  borderBottomLeftRadius: 4,
                  backgroundColor: LINE_STYLE.bubbleOther,
                  boxShadow: LINE_STYLE.bubbleOtherShadow,
                }),
            color: "#000",
          }}
        >
          {content()}
        </div>
        <span
          style={{
            fontSize: 10,
            color: LINE_STYLE.timeText,
            marginTop: 2,
            marginRight: isMine ? 4 : 0,
            marginLeft: isMine ? 0 : 4,
          }}
        >
          {message.time}
        </span>
      </div>
    </div>
  );
}

export function PdfChatView({ messages, isGroup = false }: PdfChatViewProps) {
  let lastDate = "";
  let lastSender: string | null = null;

  return (
    <div
      style={{
        width: 400,
        minHeight: 600,
        padding: "24px 16px",
        backgroundColor: LINE_STYLE.background,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {messages.map((message) => {
        const showDate = message.date !== lastDate;
        if (showDate) {
          lastDate = message.date;
          lastSender = null;
        }

        const isSystem = message.type === "system" || message.type === "canceled";
        const isSameSender = !isSystem && !showDate && lastSender === message.sender;
        if (!isSystem) lastSender = message.sender;

        return (
          <div
            key={message.id}
            style={{
              marginTop: isSameSender ? 2 : 8,
            }}
          >
            {showDate && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "20px 0 16px",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    padding: "6px 12px",
                    borderRadius: 14,
                    backgroundColor: LINE_STYLE.dateBg,
                    color: LINE_STYLE.dateText,
                  }}
                >
                  {dayjs(message.date).format("YYYY年M月D日")}
                </span>
              </div>
            )}
            <PdfBubble message={message} isGroup={isGroup} />
          </div>
        );
      })}
    </div>
  );
}
