const URL_PATTERN = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/gi;

export function extractUrls(text: string): string[] {
  const matches = text.match(URL_PATTERN);
  return matches ? Array.from(new Set(matches)) : [];
}
