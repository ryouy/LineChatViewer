# [LINE Chat History Viewer](https://line-chat-viewer.vercel.app)

A web application that parses LINE chat export .txt files and renders them in a familiar messaging-style interface. Drop a file, pick your name, and browse.

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| State | Zustand |
| Search | fuse.js |
| PDF | html2canvas, jsPDF |

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Upload** — Drag-and-drop .txt import. `..txt` only.
- **Parser** — Regex-based extraction of date lines and message lines. Handles `Photos`, `Stickers`, `Video`, `Canceled` tokens.
- **Sender identification** — Select your name from the participant list for each chat. Messages are colored accordingly.
- **UI** — Right-aligned green bubbles for you, left-aligned gray for others. Date separators, grouped consecutive messages.
- **Search** — Full-text search with fuse.js. Highlights matches and scrolls to message.
- **PDF export** — Renders the visible chat to PDF via html2canvas + jsPDF. Multi-page layout.
- **Themes** — LINE-style, Light, Dark.

## File Format

Expected format from LINE export:

- **Date line**: `YYYY.MM.DD weekday`
- **Message line**: `HH:mm Sender Message` — regex: `^(\d{2}:\d{2})\s(.+?)\s(.+)`

## Project Structure

```
line-chat-viewer/
├── app/
│   ├── page.tsx
│   ├── chat/page.tsx
│   └── layout.tsx
├── components/
│   ├── FileDropzone.tsx
│   ├── SenderSelectDialog.tsx
│   ├── ChatHeader.tsx
│   ├── ChatViewport.tsx
│   ├── ChatBubble.tsx
│   ├── ChatMessageRow.tsx
│   ├── SearchResultsPanel.tsx
│   ├── PdfExportButton.tsx
│   ├── ThemeSettingsPanel.tsx
│   └── ui/
├── lib/
│   ├── parser/parseLineChat.ts
│   ├── pdf/exportPdf.ts
│   └── imageConfig.ts
├── store/
├── types/
└── styles/
```

## Deploy

Git push to GitHub, then connect the repo to Vercel. Framework preset: Next.js. No extra config required.

## License

MIT
