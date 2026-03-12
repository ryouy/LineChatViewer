"use client";

import { useState } from "react";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportChatToPdf } from "@/lib/pdf/exportPdf";

type PdfExportButtonProps = {
  viewportRef: React.RefObject<HTMLDivElement | null>;
  filename: string;
  className?: string;
};

export function PdfExportButton({
  viewportRef,
  filename,
  className,
}: PdfExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    const el = viewportRef.current;
    if (!el || isExporting) return;
    setIsExporting(true);
    try {
      await exportChatToPdf(el, filename);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={isExporting}
      className={className}
    >
      <FileDown className="size-4 mr-1" />
      {isExporting ? "出力中..." : "PDF"}
    </Button>
  );
}
