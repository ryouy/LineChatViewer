"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileDropzone } from "@/components/FileDropzone";
import { ChatListPanel } from "@/components/ChatListPanel";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import { MessageCircle, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const SAMPLES = [
  { path: "/samples/personal1.txt", name: "個人会話1", icon: User },
  { path: "/samples/personal2.txt", name: "個人会話2", icon: User },
  { path: "/samples/group1.txt", name: "5人グループ1", icon: Users },
  { path: "/samples/group2.txt", name: "5人グループ2", icon: Users },
] as const;

export default function HomePage() {
  const router = useRouter();
  const initFromCookies = useChatStore((s) => s.initFromCookies);
  const loadFromFile = useChatStore((s) => s.loadFromFile);
  const sessions = useChatStore((s) => s.sessions);
  const [loadingSample, setLoadingSample] = useState<string | null>(null);

  useEffect(() => {
    initFromCookies();
  }, [initFromCookies]);

  const loadSample = async (path: string, name: string) => {
    setLoadingSample(path);
    try {
      const res = await fetch(path);
      const content = await res.text();
      loadFromFile(content, `${name}.txt`);
      router.push("/chat");
    } catch {
      alert("サンプルの読み込みに失敗しました");
    } finally {
      setLoadingSample(null);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#e8e4df] via-[#e5ddd5] to-[#ddd8d0]">
      <aside
        className={cn(
          "w-72 flex-shrink-0 bg-white/80 backdrop-blur-sm border-r border-white/50 shadow-sm",
          sessions.length === 0 && "hidden md:block"
        )}
      >
        <div className="p-5 border-b border-black/5">
          <div className="flex items-center gap-2">
            <MessageCircle className="size-5 text-[#00B900]" />
            <h2 className="font-semibold text-gray-800">トーク一覧</h2>
          </div>
        </div>
        <ChatListPanel onSelectSession={() => router.push("/chat")} />
      </aside>
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-lg text-center">
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-white/90 shadow-lg mb-6">
            <MessageCircle className="size-8 text-[#00B900]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3 tracking-tight">
            LINE トーク履歴ビューアー
          </h1>
          <p className="text-gray-600 mb-2">
            トーク一覧から選択するか、新しいTXTをアップロード
          </p>
          <p className="text-sm text-gray-500 mb-6">
            LINEでエクスポートしたTXTファイルをドロップ
          </p>
          <FileDropzone />
          <div className="mt-8 pt-8 border-t border-gray-200/60">
            <p className="text-xs text-gray-500 mb-3">サンプルを試す</p>
            <div className="flex flex-wrap justify-center gap-2">
              {SAMPLES.map(({ path, name, icon: Icon }) => (
                <Button
                  key={path}
                  variant="outline"
                  size="sm"
                  onClick={() => loadSample(path, name)}
                  disabled={loadingSample !== null}
                  className="gap-1.5"
                >
                  <Icon className="size-3.5" />
                  {loadingSample === path ? "読み込み中..." : name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
