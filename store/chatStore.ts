import { create } from "zustand";
import type { ChatMessage, ChatSession } from "@/types/chat";
import type { ThemeId } from "@/types/theme";
import { parseLineChat, applyIsMine } from "@/lib/parser/parseLineChat";

const MY_NAME_COOKIE = "line-chat-my-name";
const THEME_COOKIE = "line-chat-theme";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

type ChatState = {
  sessions: ChatSession[];
  activeSessionId: string | null;
  myName: string | null;
  theme: ThemeId;
  needsSenderSelect: boolean;
  parseWarnings: string[];

  setTheme: (theme: ThemeId) => void;
  setMyName: (name: string) => void;
  loadFromFile: (content: string, filename: string) => void;
  selectSession: (id: string | null) => void;
  confirmSender: (name: string) => void;
  clearNeedsSenderSelect: () => void;
  initFromCookies: () => void;
  loadFromShare: (data: {
    messages: ChatMessage[];
    participants: string[];
    title: string;
  }) => void;
};

export const useChatStore = create<ChatState>((set, get) => ({
  sessions: [],
  activeSessionId: null,
  myName: null,
  theme: "line",
  needsSenderSelect: false,
  parseWarnings: [],

  initFromCookies: () => {
    const myName = getCookie(MY_NAME_COOKIE);
    const theme = (getCookie(THEME_COOKIE) as ThemeId) || "line";
    set({ myName: myName || null, theme });
  },

  setTheme: (theme) => {
    setCookie(THEME_COOKIE, theme);
    set({ theme });
  },

  setMyName: (name) => {
    setCookie(MY_NAME_COOKIE, name);
    const { sessions, activeSessionId } = get();
    if (!activeSessionId) return set({ myName: name });

    const session = sessions.find((s) => s.id === activeSessionId);
    if (!session) return set({ myName: name });

    const updatedMessages = session.messages.map((m) => ({
      ...m,
      isMine: m.sender === name,
    }));

    set({
      myName: name,
      sessions: sessions.map((s) =>
        s.id === activeSessionId ? { ...s, messages: updatedMessages } : s
      ),
    });
  },

  loadFromFile: (content, filename) => {
    const { myName } = get();
    const { messages, warnings, participants } = parseLineChat(content);
    const resolvedMyName =
      myName && participants.includes(myName) ? myName : participants[0] ?? "";
    const withIsMine = applyIsMine(messages, resolvedMyName);

    const session: ChatSession = {
      id: `session-${Date.now()}`,
      title: filename.replace(/\.txt$/i, "") || "トーク",
      participants,
      messages: withIsMine,
      sourceFileName: filename,
      importedAt: Date.now(),
    };

    if (resolvedMyName) setCookie(MY_NAME_COOKIE, resolvedMyName);

    set((state) => ({
      sessions: [...state.sessions, session],
      activeSessionId: session.id,
      myName: resolvedMyName,
      needsSenderSelect: participants.length > 1 && !myName,
      parseWarnings: warnings,
    }));
  },

  selectSession: (id) => set({ activeSessionId: id }),

  confirmSender: (name) => {
    get().setMyName(name);
    set({ needsSenderSelect: false });
  },

  clearNeedsSenderSelect: () => set({ needsSenderSelect: false }),

  loadFromShare: (data) => {
    const { myName } = get();
    const resolvedMyName =
      myName && data.participants.includes(myName)
        ? myName
        : data.participants[0] ?? "";
    const withIsMine = data.messages.map((m) => ({
      ...m,
      isMine: m.sender === resolvedMyName,
    }));

    const session: ChatSession = {
      id: `session-share-${Date.now()}`,
      title: data.title,
      participants: data.participants,
      messages: withIsMine,
      sourceFileName: "共有",
      importedAt: Date.now(),
    };

    if (resolvedMyName) setCookie(MY_NAME_COOKIE, resolvedMyName);

    set((state) => ({
      sessions: [...state.sessions, session],
      activeSessionId: session.id,
      myName: resolvedMyName,
      needsSenderSelect: false,
    }));
  },
}));
