"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileDropzone } from "@/components/FileDropzone";
import { ChatListPanel } from "@/components/ChatListPanel";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import { MessageCircle, User, Users } from "lucide-react";

const SAMPLES = [
  { path: "/samples/personal1..txt", name: "個人会話1", icon: User },
  { path: "/samples/personal2..txt", name: "個人会話2", icon: User },
  { path: "/samples/group1..txt", name: "5人グループ1", icon: Users },
  { path: "/samples/group2..txt", name: "5人グループ2", icon: Users },
] as const;

export default function HomePage() {
  const router = useRouter();
  const initFromStorage = useChatStore((s) => s.initFromStorage);
  const loadFromFile = useChatStore((s) => s.loadFromFile);
  const sessions = useChatStore((s) => s.sessions);
  const [loadingSample, setLoadingSample] = useState<string | null>(null);

  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  const loadSample = async (path: string, name: string) => {
    setLoadingSample(path);
    try {
      const res = await fetch(path);
      const content = await res.text();
      loadFromFile(content, `${name}..txt`);
      router.push("/chat");
    } catch {
      alert("サンプルの読み込みに失敗しました");
    } finally {
      setLoadingSample(null);
    }
  };

  return (
    <div className="min-h-dvh min-h-screen flex flex-col bg-gradient-to-br from-[#e8e4df] via-[#e5ddd5] to-[#ddd8d0] overflow-x-hidden pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)]">
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden order-2 md:order-1">
        <div className="w-full max-w-lg text-center shrink-0">
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-white/90 shadow-lg mb-6">
            <MessageCircle className="size-8 text-[#00B900]" />
          </div>
          <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-3 tracking-tight">
            LINE トーク履歴ビューアー
          </h1>
          
          <p className="text-sm text-gray-500 mb-6">
            LINEでエクスポートした.txtファイルをドロップ
          </p>
          <FileDropzone />
        </div>
      </main>
      <aside className="flex-shrink-0 flex flex-col bg-white/80 backdrop-blur-sm border-b md:border-b-0 md:border-t border-white/50 shadow-sm min-h-0 order-1 md:order-2 w-full md:max-h-64">
        <div className="p-4 border-b border-black/5 shrink-0">
          <div className="flex items-center gap-2">
            <MessageCircle className="size-5 text-[#00B900]" />
            <h2 className="font-semibold text-gray-800">トーク一覧</h2>
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
          <ChatListPanel
            onSelectSession={() => router.push("/chat")}
            samples={SAMPLES}
            onSampleClick={loadSample}
            loadingSample={loadingSample}
          />
        </div>
      </aside>
    </div>
  );
}
