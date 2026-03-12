"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/chatStore";
import { createShareUrl } from "@/lib/utils/share";

export function ShareButton() {
  const [copied, setCopied] = useState(false);
  const sessions = useChatStore((s) => s.sessions);
  const activeSessionId = useChatStore((s) => s.activeSessionId);

  const session = sessions.find((s) => s.id === activeSessionId);

  const handleShare = async () => {
    if (!session) return;
    const url = createShareUrl(session);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.open(url, "_blank");
    }
  };

  if (!session) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      className="gap-1"
    >
      {copied ? (
        <>
          <Check className="size-4" />
          コピーしました
        </>
      ) : (
        <>
          <Share2 className="size-4" />
          共有
        </>
      )}
    </Button>
  );
}
