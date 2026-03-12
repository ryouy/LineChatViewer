"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/chatStore";

export function SenderSelectDialog() {
  const {
    needsSenderSelect,
    sessions,
    activeSessionId,
    confirmSender,
    clearNeedsSenderSelect,
  } = useChatStore();

  const session = sessions.find((s) => s.id === activeSessionId);
  const participants = session?.participants ?? [];

  return (
    <Dialog open={needsSenderSelect} onOpenChange={(open) => !open && clearNeedsSenderSelect()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>自分の名前を選択</DialogTitle>
          <DialogDescription>
            トークの送信者一覧から、あなたの名前を選んでください。選択した名前のメッセージは右側（緑）に表示されます。
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-4">
          {participants.map((name) => (
            <Button
              key={name}
              variant="outline"
              className="justify-start h-12 text-base"
              onClick={() => confirmSender(name)}
            >
              {name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
