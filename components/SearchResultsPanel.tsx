"use client";

import { SearchBar } from "./SearchBar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/chat";
import dayjs from "dayjs";

type SearchResult = { item: ChatMessage; refIndex: number };

type SearchResultsPanelProps = {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  totalCount: number;
  onResultClick: (id: string) => void;
  highlightId: string | null;
  onClose?: () => void;
};

export function SearchResultsPanel({
  query,
  setQuery,
  results,
  totalCount,
  onResultClick,
  highlightId,
  onClose,
}: SearchResultsPanelProps) {
  return (
    <div className="flex flex-col h-full border-l bg-background">
      <div className="p-3 border-b flex items-center gap-2">
        <SearchBar
          value={query}
          onChange={setQuery}
          resultCount={query ? totalCount : undefined}
          className="flex-1"
        />
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            閉じる
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {query && results.length === 0 && (
            <p className="text-sm text-muted-foreground py-4 text-center">
              検索結果がありません
            </p>
          )}
          {query &&
            results.map(({ item }) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onResultClick(item.id)}
                className={cn(
                  "w-full text-left p-2 rounded-lg text-sm hover:bg-muted transition-colors",
                  highlightId === item.id && "bg-primary/10"
                )}
              >
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-medium truncate">{item.sender}</span>
                  <span className="text-xs text-muted-foreground">
                    {dayjs(item.date).format("M/D")} {item.time}
                  </span>
                </div>
                <p className="text-muted-foreground truncate line-clamp-2">
                  {item.text}
                </p>
              </button>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}
