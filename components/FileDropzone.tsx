"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useChatStore } from "@/store/chatStore";
import { cn } from "@/lib/utils";
import { Upload, FileText } from "lucide-react";

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || "");
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file, "UTF-8");
  });
}

export function FileDropzone() {
  const loadFromFile = useChatStore((s) => s.loadFromFile);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        const content = await readFileAsText(file);
        loadFromFile(content, file.name);
      }
    },
    [loadFromFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/plain": ["..txt"] },
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 sm:p-10 cursor-pointer transition-all duration-300",
        "flex flex-col items-center justify-center gap-4 sm:gap-5 min-h-[180px] sm:min-h-[240px] w-full",
        "border-2 border-dashed",
        "bg-white/70 backdrop-blur-sm shadow-lg",
        isDragActive
          ? "border-[#00B900] bg-[#00B900]/10 scale-[1.02] shadow-[#00B900]/20"
          : "border-gray-300/80 hover:border-[#00B900]/60 hover:bg-white/90 hover:shadow-xl"
      )}
    >
      <input {...getInputProps()} />
      <div
        className={cn(
          "flex items-center justify-center size-16 rounded-2xl transition-colors",
          isDragActive ? "bg-[#00B900]/20" : "bg-gray-100"
        )}
      >
        {isDragActive ? (
          <Upload className="size-8 text-[#00B900]" />
        ) : (
          <FileText className="size-8 text-gray-500" />
        )}
      </div>
      <div className="space-y-1">
        <p
          className={cn(
            "text-center font-medium transition-colors",
            isDragActive ? "text-[#00B900]" : "text-gray-700"
          )}
        >
          {isDragActive ? "ここにドロップ..." : "LINEのトーク履歴.txtをドラッグ＆ドロップ"}
        </p>
        
      </div>
    </div>
  );
}
