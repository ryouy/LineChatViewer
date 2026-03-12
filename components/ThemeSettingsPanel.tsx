"use client";

import { useChatStore } from "@/store/chatStore";
import { THEMES } from "@/store/themeStore";
import type { ThemeId } from "@/types/theme";

type ThemeSettingsPanelProps = {
  onClose?: () => void;
};

export function ThemeSettingsPanel({ onClose }: ThemeSettingsPanelProps) {
  const { theme, setTheme } = useChatStore();

  const themes: ThemeId[] = ["line", "light", "dark"];

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold">テーマ</h3>
      <div className="flex flex-col gap-2">
        {themes.map((id) => {
          const t = THEMES[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTheme(id);
                onClose?.();
              }}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-colors text-left ${
                theme === id ? "border-primary bg-primary/5" : "border-transparent hover:bg-muted/50"
              }`}
            >
              <div
                className="size-10 rounded-lg shrink-0"
                style={{ backgroundColor: t.background }}
              />
              <div className="flex-1">
                <p className="font-medium">{t.name}</p>
                <div className="flex gap-1 mt-1">
                  <span
                    className="inline-block size-4 rounded"
                    style={{ backgroundColor: t.bubbleMine }}
                  />
                  <span
                    className="inline-block size-4 rounded"
                    style={{ backgroundColor: t.bubbleOther }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
