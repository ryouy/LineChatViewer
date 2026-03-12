"use client";

import { ChevronLeft, Search, Phone, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/store/chatStore";
import { THEMES } from "@/store/themeStore";
import { Button } from "@/components/ui/button";

type ChatHeaderProps = {
  title?: string;
  onSearchClick?: () => void;
  onMenuClick?: () => void;
  menuButtonRef?: React.RefObject<HTMLButtonElement | null>;
};

export function ChatHeader({ title, onSearchClick, onMenuClick, menuButtonRef }: ChatHeaderProps) {
  const router = useRouter();
  const themeId = useChatStore((s) => s.theme);
  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const sessions = useChatStore((s) => s.sessions);

  const session = sessions.find((s) => s.id === activeSessionId);
  const displayTitle = title ?? session?.title ?? "トーク";
  const participantCount = session?.participants.length ?? 0;
  const isGroup = participantCount > 1;
  const theme = THEMES[themeId];

  return (
    <header
      className="sticky top-0 z-20 flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 shadow-sm shrink-0"
      style={{ backgroundColor: theme.headerBg, color: theme.headerText }}
    >
      <button
        type="button"
        onClick={() => router.push("/")}
        className="p-1.5 -ml-1 rounded-lg hover:bg-white/20 transition-colors shrink-0"
        aria-label="トーク一覧に戻る"
      >
        <ChevronLeft className="size-6" />
      </button>
      <h1 className="flex-1 min-w-0 font-semibold text-base sm:text-lg truncate">
        {displayTitle}
        {isGroup && (
          <span className="font-normal opacity-90 ml-0.5">({participantCount})</span>
        )}
      </h1>
      <div className="flex items-center gap-0.5 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="size-9 text-inherit hover:bg-white/20"
          onClick={onSearchClick}
          aria-label="検索"
        >
          <Search className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 text-inherit hover:bg-white/20 hidden sm:flex"
          aria-label="通話"
        >
          <Phone className="size-5" />
        </Button>
        <Button
          ref={menuButtonRef as React.RefObject<HTMLButtonElement>}
          variant="ghost"
          size="icon"
          className="size-9 text-inherit hover:bg-white/20"
          onClick={onMenuClick}
          aria-label="メニュー"
        >
          <Menu className="size-5" />
        </Button>
      </div>
    </header>
  );
}
