export type ThemeId = "line" | "light" | "dark";

export type ThemeConfig = {
  id: ThemeId;
  name: string;
  background: string;
  bubbleMine: string;
  bubbleOther: string;
  bubbleMineText: string;
  bubbleOtherText: string;
  headerBg: string;
  headerText: string;
  dateSeparatorBg: string;
  dateSeparatorText: string;
  systemMessageBg: string;
  systemMessageText: string;
};
