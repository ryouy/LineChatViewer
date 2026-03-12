export type MessageType =
  | "text"
  | "sticker"
  | "photo"
  | "video"
  | "call"
  | "videoCall"
  | "system"
  | "canceled"
  | "unknown";

export type ChatMessage = {
  id: string;
  sender: string;
  text: string;
  time: string;
  date: string;
  timestamp: number;
  type: MessageType;
  isMine: boolean;
  rawLine?: string;
};

export type ChatSession = {
  id: string;
  title: string;
  participants: string[];
  messages: ChatMessage[];
  sourceFileName: string;
  importedAt: number;
};

export type ParseResult = {
  messages: ChatMessage[];
  warnings: string[];
  participants: string[];
};
