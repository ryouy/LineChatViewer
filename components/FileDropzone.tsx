"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useChatStore } from "@/store/chatStore";
import { cn } from "@/lib/utils";

export function FileDropzone() {
  const loadFromFile = useChatStore((s) => s.loadFromFile);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = (e.target?.result as string) || "";
        loadFromFile(content, file.name);
      };
      reader.readAsText(file, "UTF-8");
    },
    [loadFromFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/plain": [".txt"] },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-xl p-12 cursor-pointer transition-all duration-200",
        "flex flex-col items-center justify-center gap-4 min-h-[220px] w-full max-w-md",
        isDragActive
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30"
      )}
    >
      <input {...getInputProps()} />
      <div className="text-5xl">📱</div>
      <p className="text-center text-muted-foreground font-medium">
        {isDragActive ? "ここにドロップ..." : "LINEのトーク履歴TXTをドラッグ＆ドロップ"}
      </p>
      <p className="text-sm text-muted-foreground/70">またはクリックしてファイルを選択（.txtのみ）</p>
    </div>
  );
}
