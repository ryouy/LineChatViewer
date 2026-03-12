"use client";

import { useState, useRef, useCallback, useEffect } from "react";

type PlaybackState = "idle" | "playing" | "paused";

export function usePlayback(
  messages: { id: string }[],
  onScrollTo: (id: string) => void
) {
  const [state, setState] = useState<PlaybackState>("idle");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const play = useCallback(() => {
    if (messages.length === 0) return;
    setState("playing");
    if (currentIndex >= messages.length - 1) setCurrentIndex(0);
  }, [messages.length, currentIndex]);

  const pause = useCallback(() => {
    setState("paused");
  }, []);

  const stop = useCallback(() => {
    setState("idle");
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    if (state !== "playing") {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const delay = Math.max(200, 1500 / speed);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((i) => {
        const next = i + 1;
        if (next >= messages.length) {
          setState("idle");
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return i;
        }
        const msg = messages[next];
        if (msg) onScrollTo(msg.id);
        return next;
      });
    }, delay);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state, speed, messages, onScrollTo]);

  return {
    state,
    currentIndex,
    speed,
    setSpeed,
    play,
    pause,
    stop,
    progress: messages.length > 0 ? (currentIndex / messages.length) * 100 : 0,
  };
}
