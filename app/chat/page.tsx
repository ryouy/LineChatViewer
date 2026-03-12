"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatViewport } from "@/components/ChatViewport";
import { ChatMenuDropdown } from "@/components/ChatMenuDropdown";
import { SearchResultsPanel } from "@/components/SearchResultsPanel";
import { PdfExportButton, type PdfExportHandle } from "@/components/PdfExportButton";
import { SenderSelectDialog } from "@/components/SenderSelectDialog";
import { useSearch } from "@/hooks/useSearch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/chatStore";
import { FriendListPanel } from "@/components/FriendListPanel";
import { ThemeSettingsPanel } from "@/components/ThemeSettingsPanel";

export default function ChatPage() {
  const router = useRouter();
  const viewportRef = useRef<HTMLDivElement>(null);
  const pdfExportRef = useRef<PdfExportHandle>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const sessions = useChatStore((s) => s.sessions);
  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const initFromStorage = useChatStore((s) => s.initFromStorage);

  const session = sessions.find((s) => s.id === activeSessionId);
  const messages = session?.messages ?? [];

  const {
    query,
    setQuery,
    results,
    totalCount,
    scrollToMessage,
    highlightId,
  } = useSearch(messages);

  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  useEffect(() => {
    if (sessions.length === 0) {
      router.push("/");
    }
  }, [sessions.length, router]);

  const handleSearchScroll = useCallback(
    (id: string) => {
      scrollToMessage(id);
    },
    [scrollToMessage]
  );

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <SenderSelectDialog />

      <header className="relative shrink-0">
        <ChatHeader
          onSearchClick={() => setShowSearch(!showSearch)}
          onMenuClick={() => setShowMenu(!showMenu)}
          menuButtonRef={menuButtonRef}
        />
        <ChatMenuDropdown
          open={showMenu}
          onClose={() => setShowMenu(false)}
          anchorRef={menuButtonRef}
          onOpenFriends={() => setShowFriends(true)}
          onOpenSettings={() => setShowSettings(true)}
          onPdfExport={() => pdfExportRef.current?.trigger()}
        />
      </header>

      <div className="flex-1 flex min-h-0">
        <div className="flex-1 flex flex-col min-w-[min(280px,100%)]">
          <div className="flex-1 flex min-h-0">
            <ChatViewport
              ref={viewportRef}
              messages={messages}
              highlightId={highlightId}
              isGroup={session.participants.length > 1}
            />

            {showSearch && (
              <div className="w-80 shrink-0 border-l">
                <SearchResultsPanel
                  query={query}
                  setQuery={setQuery}
                  results={results}
                  totalCount={totalCount}
                  onResultClick={handleSearchScroll}
                  highlightId={highlightId}
                  onClose={() => setShowSearch(false)}
                />
              </div>
            )}
          </div>
        </div>

        {showFriends && (
          <aside className="w-64 border-l bg-background shrink-0">
            <div className="p-2 border-b flex justify-between items-center">
              <h3 className="font-semibold">参加者</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowFriends(false)}>
                閉じる
              </Button>
            </div>
            <FriendListPanel
              onSelectSender={(name) => {
                useChatStore.getState().setMyName(name);
              }}
            />
          </aside>
        )}
      </div>

      <div className="sr-only" aria-hidden>
        <PdfExportButton
          ref={pdfExportRef}
          messages={messages}
          filename={session.title}
          isGroup={session.participants.length > 1}
        />
      </div>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>設定</DialogTitle>
          </DialogHeader>
          <ThemeSettingsPanel onClose={() => setShowSettings(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
