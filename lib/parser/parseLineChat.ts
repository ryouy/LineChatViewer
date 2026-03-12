import type { ChatMessage, MessageType } from "@/types/chat";
import dayjs from "dayjs";

// 日付行: 英語曜日 or 日本語曜日
const DATE_PATTERN =
  /^(\d{4})[.\/](\d{2})[.\/](\d{2})\s+(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|月曜日|火曜日|水曜日|木曜日|金曜日|土曜日|日曜日)$/i;
const MESSAGE_PATTERN = /^(\d{2}:\d{2})\s+(.+?)\s+(.+)$/;

const SPECIAL_TYPES: Record<string, MessageType> = {
  // 写真 (EN/JA)
  Photos: "photo",
  Photo: "photo",
  写真: "photo",
  // スタンプ (EN/JA)
  Stickers: "sticker",
  Sticker: "sticker",
  スタンプ: "sticker",
  // 動画 (EN/JA)
  Video: "video",
  Videos: "video",
  動画: "video",
  // 取消 (EN/JA)
  Canceled: "canceled",
  Cancelled: "canceled",
  取消: "canceled",
  取消済み: "canceled",
  キャンセル: "canceled",
  // 通話・音声 (EN/JA)
  "通話": "call",
  "音声通話": "call",
  Call: "call",
  "Voice call": "call",
  "Voice Call": "call",
  // ビデオ通話 (EN/JA)
  "ビデオ通話": "videoCall",
  "Video call": "videoCall",
  "Video Call": "videoCall",
};

export type ParseOutput = {
  messages: Omit<ChatMessage, "isMine">[];
  warnings: string[];
  participants: string[];
};

function getMessageType(text: string): MessageType {
  if (text in SPECIAL_TYPES) return SPECIAL_TYPES[text];
  return "text";
}

export function parseLineChat(content: string): ParseOutput {
  const lines = content.split(/\r?\n/);
  const messages: Omit<ChatMessage, "isMine">[] = [];
  const warnings: string[] = [];
  const participantSet = new Set<string>();
  let currentDate = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    if (!line.trim()) continue;

    const dateMatch = line.match(DATE_PATTERN);
    if (dateMatch) {
      currentDate = `${dateMatch[1]}.${dateMatch[2]}.${dateMatch[3]}`;
      continue;
    }

    const messageMatch = line.match(MESSAGE_PATTERN);
    if (messageMatch) {
      const [, time, sender, text] = messageMatch;
      participantSet.add(sender);

      const type = getMessageType(text);
      const dateStr = currentDate || "1970.01.01";
      const [year, month, day] = dateStr.split(".").map(Number);
      const [hour, min] = time.split(":").map(Number);
      const timestamp = dayjs()
        .year(year)
        .month(month - 1)
        .date(day)
        .hour(hour)
        .minute(min)
        .second(0)
        .millisecond(0)
        .valueOf();

      messages.push({
        id: `msg-${i}-${timestamp}-${Math.random().toString(36).slice(2, 9)}`,
        sender,
        text,
        time,
        date: currentDate || dateStr,
        timestamp,
        type,
        rawLine: line,
      });
    } else {
      if (line.trim()) {
        warnings.push(
          `Line ${lineNum}: Could not parse - "${line.slice(0, 50)}${line.length > 50 ? "..." : ""}"`
        );
      }
    }
  }

  return {
    messages,
    warnings,
    participants: Array.from(participantSet),
  };
}

export function applyIsMine(
  messages: Omit<ChatMessage, "isMine">[],
  myName: string
): ChatMessage[] {
  return messages.map((m) => ({
    ...m,
    isMine: m.sender === myName,
  }));
}
