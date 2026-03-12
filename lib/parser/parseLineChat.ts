import type { ChatMessage, MessageType } from "@/types/chat";
import dayjs from "dayjs";

const DATE_PATTERN =
  /^(\d{4})\.(\d{2})\.(\d{2})\s+(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/i;
const MESSAGE_PATTERN = /^(\d{2}:\d{2})\s+(.+?)\s+(.+)$/;

const SPECIAL_TYPES: Record<string, MessageType> = {
  Photos: "photo",
  Stickers: "sticker",
  Video: "video",
  Canceled: "canceled",
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
