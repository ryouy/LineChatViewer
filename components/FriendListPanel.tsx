"use client";

import { useChatStore } from "@/store/chatStore";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type FriendListPanelProps = {
  onSelectSender?: (name: string) => void;
  className?: string;
};

export function FriendListPanel({
  onSelectSender,
  className,
}: FriendListPanelProps) {
  const sessions = useChatStore((s) => s.sessions);
  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const myName = useChatStore((s) => s.myName);

  const session = sessions.find((s) => s.id === activeSessionId);
  const participants = session?.participants ?? [];

  return (
    <div className={cn("p-4 space-y-3", className)}>
      <h3 className="font-semibold text-sm text-muted-foreground">参加者</h3>
      <div className="space-y-1">
        {participants.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => onSelectSender?.(name)}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors text-left"
          >
            <span>{name}</span>
            {name === myName && (
              <Badge variant="secondary" className="text-xs">
                自分
              </Badge>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
