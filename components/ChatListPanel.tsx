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
      <div className={cn("p-4 text-sm text-muted-foreground", className)}>
        トークがありません
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      {sessions.map((session) => (
        <button
          key={session.id}
          type="button"
          onClick={() => handleSelect(session.id)}
          className={cn(
            "w-full text-left p-3 rounded-lg transition-colors",
            activeSessionId === session.id
              ? "bg-primary/10 border border-primary/20"
              : "hover:bg-muted/50"
          )}
        >
          <p className="font-medium truncate">{session.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {session.participants.join(", ")} · {dayjs(session.importedAt).format("M/D HH:mm")}
          </p>
        </button>
      ))}
    </div>
  );
}
