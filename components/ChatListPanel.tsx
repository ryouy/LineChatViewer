"use client";

import { useChatStore } from "@/store/chatStore";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import type { LucideIcon } from "lucide-react";

type SampleItem = {
  path: string;
  name: string;
  icon: LucideIcon;
};

type ChatListPanelProps = {
  className?: string;
  onSelectSession?: (id: string) => void;
  samples?: readonly SampleItem[];
  onSampleClick?: (path: string, name: string) => void;
  loadingSample?: string | null;
};

export function ChatListPanel({
  className,
  onSelectSession,
  samples = [],
  onSampleClick,
  loadingSample = null,
}: ChatListPanelProps) {
  const { sessions, activeSessionId, selectSession } = useChatStore();

  const handleSelect = (id: string) => {
    selectSession(id);
    onSelectSession?.(id);
  };

  const hasSessions = sessions.length > 0;
  const hasSamples = samples.length > 0;

  if (!hasSessions && !hasSamples) {
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
      {hasSamples && (
        <div className={cn("flex flex-wrap items-center gap-1.5", hasSessions && "pt-1")}>
          <span className="text-xs font-medium text-gray-600 shrink-0">サンプル:</span>
          {samples.map(({ path, name, icon: Icon }) => (
            <button
              key={path}
              type="button"
              onClick={() => onSampleClick?.(path, name)}
              disabled={loadingSample !== null}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-gray-700",
                "hover:bg-gray-100/80 border border-transparent transition-colors",
                loadingSample === path && "opacity-70"
              )}
            >
              <Icon className="size-3 shrink-0 text-gray-500" />
              {loadingSample === path ? "読込中" : name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
