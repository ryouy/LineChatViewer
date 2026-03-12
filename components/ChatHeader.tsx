"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/chatStore";
import { THEMES } from "@/store/themeStore";

type ChatHeaderProps = {
  title?: string;
};

export function ChatHeader({ title }: ChatHeaderProps) {
  const router = useRouter();
  const themeId = useChatStore((s) => s.theme);
  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const sessions = useChatStore((s) => s.sessions);

  const session = sessions.find((s) => s.id === activeSessionId);
  const displayTitle = title ?? session?.title ?? "トーク";
  const theme = THEMES[themeId];

  return (
    <header
      className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 shadow-sm"
      style={{ backgroundColor: theme.headerBg, color: theme.headerText }}
    >
      <button
        type="button"
        onClick={() => router.push("/")}
        className="p-1 -ml-1 rounded-lg hover:bg-white/20 transition-colors"
        aria-label="戻る"
      >
        <ChevronLeft className="size-6" />
      </button>
      <h1 className="flex-1 font-semibold text-lg truncate">{displayTitle}</h1>
    </header>
  );
}
