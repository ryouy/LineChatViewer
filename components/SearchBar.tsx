"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultCount?: number;
  className?: string;
};

export function SearchBar({
  value,
  onChange,
  placeholder = "メッセージを検索...",
  resultCount,
  className,
}: SearchBarProps) {
  return (
    <div className={cn("relative flex items-center", className)}>
      <Search className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-16"
      />
      {value && (
        <div className="absolute right-2 flex items-center gap-1">
          {resultCount !== undefined && (
            <span className="text-xs text-muted-foreground">{resultCount}件</span>
          )}
          <Button
            variant="ghost"
            size="icon-xs"
            className="h-6 w-6"
            onClick={() => onChange("")}
          >
            <X className="size-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
