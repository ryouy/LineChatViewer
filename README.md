# LINE トーク履歴ビューアー

LINEのトーク履歴TXTを読み込み、LINEに近いUIでトークを閲覧できるWebアプリです。

## 技術スタック

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Zustand** (状態管理)
- **react-dropzone** (TXTアップロード)
- **fuse.js** (あいまい検索)
- **dayjs** (日時処理)
- **html2canvas + jsPDF** (PDF出力)
- **lz-string** (共有URL用圧縮)

## ローカル起動手順

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

---

## GitHub公開方法

1. **リポジトリを作成**
   - GitHubで新規リポジトリを作成（例: `line-chat-viewer`）

2. **プッシュ**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: LINE chat viewer"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/line-chat-viewer.git
   git push -u origin main
   ```

3. **.gitignore の確認**
   - `node_modules/`, `.env.local`, `.next/` が含まれていること

---

## Vercelデプロイ方法

1. **Vercelにログイン**
   - [vercel.com](https://vercel.com) でGitHubアカウントと連携

2. **New Project**
   - 「Add New」→「Project」
   - 対象のGitHubリポジトリを選択

3. **設定**
   - Framework Preset: Next.js（自動検出）
   - Root Directory: そのまま
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Deploy**
   - 「Deploy」をクリック

---

## 機能一覧

| 機能 | 説明 |
|------|------|
| TXTアップロード | ドラッグ＆ドロップ、.txtのみ |
| 自動解析 | 日付行・メッセージ行の正規表現解析 |
| 自分/相手判定 | 送信者一覧から選択、Cookieに保存 |
| LINE風UI | 自分=右緑、相手=左白、日付区切り、連続投稿グルーピング |
| メッセージタイプ | Photos→仮画像(picsum)、Stickers→スタンプカード、Canceled→取り消し表示 |
| URLリンク | 自動検出、クリック可能、target="_blank" |
| 検索 | fuse.js、本文・送信者、ハイライト・ジャンプ |
| PDF出力 | html2canvas + jsPDF、複数ページ |
| 共有URL | トークを圧縮してURL生成、/share?d=xxx で再表示 |
| テーマ | LINE風 / Light / Dark |

---

## プロジェクト構成

```
line-chat-viewer/
├── app/
│   ├── page.tsx
│   ├── chat/page.tsx
│   ├── share/page.tsx
│   └── layout.tsx
├── components/
│   ├── FileDropzone.tsx
│   ├── SenderSelectDialog.tsx
│   ├── ChatHeader.tsx
│   ├── ChatViewport.tsx
│   ├── ChatBubble.tsx
│   ├── ChatMessageRow.tsx
│   ├── SearchBar.tsx
│   ├── SearchResultsPanel.tsx
│   ├── PdfExportButton.tsx
│   ├── ShareButton.tsx
│   ├── ThemeSettingsPanel.tsx
│   └── ui/
├── hooks/
├── lib/
│   ├── parser/parseLineChat.ts
│   ├── pdf/exportPdf.ts
│   └── utils/share.ts
├── store/
├── types/
└── styles/
```

---

## 対応フォーマット

- **日付行**: `YYYY.MM.DD weekday`
- **メッセージ行**: `HH:mm 名前 メッセージ`（正規表現: `^(\d{2}:\d{2})\s(.+?)\s(.+)`）

特殊: `Photos`, `Stickers`, `Video`, `Canceled` を自動判定

---

## ライセンス

MIT
