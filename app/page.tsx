"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileDropzone } from "@/components/FileDropzone";
import { ChatListPanel } from "@/components/ChatListPanel";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";

export default function HomePage() {
  const router = useRouter();
  const initFromCookies = useChatStore((s) => s.initFromCookies);
  const sessions = useChatStore((s) => s.sessions);

  useEffect(() => {
    initFromCookies();
  }, [initFromCookies]);

  return (
    <div className="min-h-screen flex">
      <aside
        className={cn(
          "w-72 border-r bg-muted/30 flex-shrink-0",
          sessions.length === 0 && "hidden md:block"
        )}
      >
        <div className="p-4 border-b">
          <h2 className="font-semibold">トーク一覧</h2>
        </div>
        <ChatListPanel onSelectSession={() => router.push("/chat")} />
      </aside>
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-2">LINE トーク履歴ビューアー</h1>
        <p className="text-sm text-muted-foreground mb-4">
          トーク一覧から選択するか、新しいTXTをアップロードしてください
        </p>
        <p className="text-muted-foreground mb-8 text-sm text-center">
          LINEでエクスポートしたTXTファイルをアップロードしてください
        </p>
        <FileDropzone />
      </main>
    </div>
  );
}
