import { create } from "zustand";
import type { ChatMessage, ChatSession } from "@/types/chat";
import type { ThemeId } from "@/types/theme";
import { parseLineChat, applyIsMine } from "@/lib/parser/parseLineChat";

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
  initFromStorage: () => void;
};

export const useChatStore = create<ChatState>()((set, get) => ({
  sessions: [],
  activeSessionId: null,
  myName: null,
  theme: "line",
  needsSenderSelect: false,
  parseWarnings: [],

  initFromStorage: () => {
    // 永続化なし
  },

  setTheme: (theme) => set({ theme }),

  setMyName: (name) => {
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
    const { messages, warnings, participants } = parseLineChat(content);
    const initialName = participants[0] ?? "";
    const withIsMine = applyIsMine(messages, initialName);

    const session: ChatSession = {
      id: `session-${Date.now()}`,
      title: filename.replace(/\.txt$/i, "") || "トーク",
      participants,
      messages: withIsMine,
      sourceFileName: filename,
      importedAt: Date.now(),
    };

    set((state) => ({
      sessions: [...state.sessions, session],
      activeSessionId: session.id,
      myName: initialName,
      needsSenderSelect: participants.length > 1,
      parseWarnings: warnings,
    }));
  },

  selectSession: (id) => {
    const { sessions } = get();
    const session = sessions.find((s) => s.id === id);
    const needsSenderSelect = session && session.participants.length > 1;
    set({
      activeSessionId: id,
      ...(needsSenderSelect && { needsSenderSelect: true }),
    });
  },

  confirmSender: (name) => {
    get().setMyName(name);
    set({ needsSenderSelect: false });
  },

  clearNeedsSenderSelect: () => set({ needsSenderSelect: false }),
}));
