# LINE トーク履歴ビューアー

LINEのトーク履歴TXTをアップロードすると、LINE風UIでチャットを復元するWebアプリです。

## 技術スタック

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Zustand** (状態管理)
- **dayjs** (日時処理)
- **react-dropzone** (TXTアップロード)
- **fuse.js** (あいまい検索)
- **html2canvas + jsPDF** (PDF出力)
- **clsx** (class管理)
- **framer-motion** (アニメーション・必要に応じて)

## ローカル起動手順

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## Vercelデプロイ手順

1. **GitHubリポジトリにプッシュ**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/line-chat-viewer.git
   git push -u origin main
   ```

2. **Vercelでデプロイ**
   - [Vercel](https://vercel.com) にログイン
   - 「New Project」→ GitHubリポジトリを選択
   - Framework Preset: Next.js が自動検出
   - 「Deploy」をクリック

3. **環境変数**（必要に応じて設定）

Next.jsプロジェクトのため、追加設定なしでデプロイ可能です。

## 機能一覧

### 必須機能

| 機能 | 説明 |
|------|------|
| TXTアップロード | ドラッグ＆ドロップ、.txtのみ受付 |
| パーサー | 日付行・メッセージ行の解析、Stickers/Photos/Video/Canceled判定、パース失敗はwarningsに記録 |
| 自分/相手の識別 | 送信者一覧から「自分の名前」を選択、Cookieに保存、後から変更可能 |
| トーク画面UI | 自分=右緑吹き出し、相手=左白吹き出し、日付区切り、同一送信者グルーピング |
| メッセージ表示 | URL自動リンク化、写真/スタンプ/取り消しの専用表示 |
| 検索 | fuse.jsであいまい検索、ヒット件数、ハイライト、クリックでスクロール |
| スクロール同期 | 検索結果クリックで該当箇所へ移動 |
| トーク再生 | 時系列で1件ずつ再生、再生/一時停止/停止、速度変更 |
| PDF化 | トークをPDF出力、複数ページ対応 |
| リストUI | トーク一覧、参加者一覧 |
| テーマ変更 | LINE / Light / Dark の切り替え |

## プロジェクト構成

```
line-chat-viewer/
├── app/
│   ├── page.tsx           # トップ（アップロード・トーク一覧）
│   ├── chat/
│   │   └── page.tsx       # チャットビューアー
│   └── layout.tsx
├── components/
│   ├── FileDropzone.tsx
│   ├── SenderSelectDialog.tsx
│   ├── FriendListPanel.tsx
│   ├── ChatListPanel.tsx
│   ├── ChatHeader.tsx
│   ├── ChatViewport.tsx
│   ├── ChatMessageRow.tsx
│   ├── ChatBubble.tsx
│   ├── SearchBar.tsx
│   ├── SearchResultsPanel.tsx
│   ├── PlaybackControls.tsx
│   ├── PdfExportButton.tsx
│   ├── ThemeSettingsPanel.tsx
│   └── ui/                # shadcn/ui
├── hooks/
│   ├── useSearch.ts
│   ├── useScrollSync.ts
│   └── usePlayback.ts
├── lib/
│   ├── parser/
│   │   └── parseLineChat.ts
│   ├── pdf/
│   │   └── exportPdf.ts
│   ├── utils/
│   │   └── url.ts
│   └── utils.ts
├── store/
│   ├── chatStore.ts
│   └── themeStore.ts
├── types/
│   ├── chat.ts
│   └── theme.ts
└── styles/
    └── globals.css
```

## 対応フォーマット

LINEのトーク履歴エクスポート形式：

- **日付行**: `YYYY.MM.DD weekday`
- **メッセージ行**: `HH:mm 名前 本文`

特殊メッセージ: `Photos`, `Stickers`, `Video`, `Canceled` を自動判定

## ライセンス

MIT
