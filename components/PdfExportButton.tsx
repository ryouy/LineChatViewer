"use client";

import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { createRoot } from "react-dom/client";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PdfChatView } from "./PdfChatView";
import { exportChatToPdf } from "@/lib/pdf/exportPdf";
import type { ChatMessage } from "@/types/chat";

export type PdfExportHandle = { trigger: () => void };

type PdfExportButtonProps = {
  messages: ChatMessage[];
  filename: string;
  isGroup?: boolean;
  className?: string;
};

export const PdfExportButton = forwardRef<PdfExportHandle, PdfExportButtonProps>(
  function PdfExportButton({ messages, filename, isGroup = false, className }, ref) {
  const [isExporting, setIsExporting] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useImperativeHandle(ref, () => ({
    trigger: () => {
      if (messages.length === 0) {
        alert("トークがありません");
        return;
      }
      setIsExporting(true);
    },
  }));

  useEffect(() => {
    if (!isExporting || messages.length === 0) return;

    const container = document.createElement("div");
    container.style.cssText =
      "position:fixed;left:-9999px;top:0;z-index:-1;visibility:hidden;";
    document.body.appendChild(container);
    containerRef.current = container;

    const root = createRoot(container);
    root.render(<PdfChatView messages={messages} isGroup={isGroup} />);

    const run = async () => {
      await new Promise((r) => requestAnimationFrame(r));
      await new Promise((r) => requestAnimationFrame(r));
      try {
        await exportChatToPdf(container, filename);
      } catch (err) {
        console.error("PDF export error:", err);
        alert(
          "PDFの出力に失敗しました。トークが長い場合は、少しずつ試してみてください。"
        );
      } finally {
        root.unmount();
        document.body.removeChild(container);
        containerRef.current = null;
        setIsExporting(false);
      }
    };

    run();
  }, [isExporting, messages, filename, isGroup]);

  const handleClick = () => {
    if (messages.length === 0) {
      alert("トークがありません");
      return;
    }
    setIsExporting(true);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isExporting}
      className={className}
    >
      <FileDown className="size-4 mr-1" />
      {isExporting ? "出力中..." : "PDF"}
    </Button>
  );
});
