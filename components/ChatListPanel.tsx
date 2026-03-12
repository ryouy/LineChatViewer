"use client";

import { useChatStore } from "@/store/chatStore";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

type ChatListPanelProps = {
  className?: string;
  onSelectSession?: (id: string) => void;
};

export function ChatListPanel({ className, onSelectSession }: ChatListPanelProps) {
  const { sessions, activeSessionId, selectSession } = useChatStore();

  const handleSelect = (id: string) => {
    selectSession(id);
    onSelectSession?.(id);
  };

  if (sessions.length === 0) {
    return (
      <div className={cn("p-6 text-center", className)}>
        <p className="text-sm text-gray-500">トークがありません</p>
        <p className="text-xs text-gray-400 mt-1">.txtをアップロードするとここに表示されます</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1 p-2", className)}>
      {sessions.map((session) => (
        <button
          key={session.id}
          type="button"
          onClick={() => handleSelect(session.id)}
          className={cn(
            "w-full text-left p-3 rounded-xl transition-all duration-200",
            activeSessionId === session.id
              ? "bg-[#00B900]/15 border border-[#00B900]/30 shadow-sm"
              : "hover:bg-gray-100/80 border border-transparent"
          )}
        >
          <p className="font-medium truncate text-gray-800">{session.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {session.participants.join(", ")} · {dayjs(session.importedAt).format("M/D HH:mm")}
          </p>
        </button>
      ))}
    </div>
  );
}
