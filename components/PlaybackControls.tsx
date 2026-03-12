"use client";

import { Play, Pause, Square, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider as SliderUI } from "@/components/ui/slider";
import { usePlayback } from "@/hooks/usePlayback";
import { cn } from "@/lib/utils";

type PlaybackControlsProps = {
  messages: { id: string }[];
  onScrollTo: (id: string) => void;
  className?: string;
};

export function PlaybackControls({
  messages,
  onScrollTo,
  className,
}: PlaybackControlsProps) {
  const {
    state,
    speed,
    setSpeed,
    play,
    pause,
    stop,
    progress,
  } = usePlayback(messages, onScrollTo);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-2">
        {state === "playing" ? (
          <Button variant="outline" size="icon-sm" onClick={pause}>
            <Pause className="size-4" />
          </Button>
        ) : (
          <Button variant="outline" size="icon-sm" onClick={play}>
            <Play className="size-4" />
          </Button>
        )}
        <Button variant="outline" size="icon-sm" onClick={stop}>
          <Square className="size-4" />
        </Button>
        <div className="flex items-center gap-2 flex-1 ml-2">
          <Gauge className="size-4 text-muted-foreground" />
          <SliderUI
            value={[speed]}
            onValueChange={(v) => setSpeed(Array.isArray(v) ? v[0] ?? 1 : v)}
            min={0.5}
            max={3}
            step={0.5}
            className="w-24"
          />
          <span className="text-xs text-muted-foreground">{speed}x</span>
        </div>
      </div>
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
