"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useChatStore } from "@/store/chatStore";

export function SummarizeButton() {
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sessions = useChatStore((s) => s.sessions);
  const activeSessionId = useChatStore((s) => s.activeSessionId);

  const session = sessions.find((s) => s.id === activeSessionId);

  const handleSummarize = async () => {
    if (!session) return;
    setOpen(true);
    setLoading(true);
    setError("");
    setSummary("");

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: session.messages.map((m) => ({
            sender: m.sender,
            text: m.text,
            time: m.time,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "要約に失敗しました");
      }
      setSummary(data.summary);
    } catch (e) {
      setError(e instanceof Error ? e.message : "要約に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleSummarize}
        className="gap-1"
      >
        <Sparkles className="size-4" />
        AI要約
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AIトーク要約</DialogTitle>
          </DialogHeader>
          {loading && (
            <p className="text-muted-foreground py-8 text-center">
              要約を生成中...
            </p>
          )}
          {error && (
            <p className="text-destructive py-4">{error}</p>
          )}
          {summary && (
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
              {summary}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
