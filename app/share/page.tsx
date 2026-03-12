"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useChatStore } from "@/store/chatStore";
import { parseShareData } from "@/lib/utils/share";

function ShareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loadFromShare = useChatStore((s) => s.loadFromShare);

  useEffect(() => {
    const d = searchParams.get("d");
    if (!d) {
      router.replace("/");
      return;
    }
    const data = parseShareData(d);
    if (!data) {
      router.replace("/");
      return;
    }
    loadFromShare(data);
    router.replace("/chat");
  }, [searchParams, router, loadFromShare]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">読み込み中...</p>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      }
    >
      <ShareContent />
    </Suspense>
  );
}
