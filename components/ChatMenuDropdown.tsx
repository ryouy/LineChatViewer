"use client";

import { useRef, useEffect } from "react";
import { Users, Settings, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";

type ChatMenuDropdownProps = {
  open: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  onOpenFriends: () => void;
  onOpenSettings: () => void;
  onPdfExport: () => void;
  className?: string;
};

export function ChatMenuDropdown({
  open,
  onClose,
  anchorRef,
  onOpenFriends,
  onOpenSettings,
  onPdfExport,
  className,
}: ChatMenuDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute right-0 top-full mt-1 z-50 min-w-[180px] rounded-lg border bg-background py-1 shadow-lg",
        className
      )}
    >
      <button
        type="button"
        className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
        onClick={() => {
          onOpenFriends();
          onClose();
        }}
      >
        <Users className="size-4" />
        参加者
      </button>
      <button
        type="button"
        className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
        onClick={() => {
          onOpenSettings();
          onClose();
        }}
      >
        <Settings className="size-4" />
        設定
      </button>
      <button
        type="button"
        className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
        onClick={() => {
          onPdfExport();
          onClose();
        }}
      >
        <FileDown className="size-4" />
        PDF出力
      </button>
    </div>
  );
}
