# LINE トーク履歴ビューアー 設計書

## 1. 全体設計

### 目的
- LINE履歴TXTをアップロードして、LINE風UIでトークを再現する
- GitHubへpushしてVercelで公開できる構成
- UIはLINEっぽく、実装は保守しやすく

### アーキテクチャ
- **フロントエンド**: Next.js App Router + React
- **状態管理**: Zustand（chatStore, themeStore）
- **永続化**: Cookie（自分の名前、テーマ）
- **パーサー**: 正規表現ベース、堅牢なエラーハンドリング

## 2. データ設計

### ChatMessage
```typescript
type MessageType = "text" | "sticker" | "photo" | "video" | "system" | "canceled" | "unknown";

type ChatMessage = {
  id: string;
  sender: string;
  text: string;
  time: string;
  date: string;
  timestamp: number;
  type: MessageType;
  isMine: boolean;
  rawLine?: string;
};
```

### ChatSession
```typescript
type ChatSession = {
  id: string;
  title: string;
  participants: string[];
  messages: ChatMessage[];
  sourceFileName: string;
  importedAt: number;
};
```

## 3. ディレクトリ構成

```
line-chat-viewer/
├── app/              # ページ
├── components/       # UIコンポーネント
├── hooks/            # カスタムフック
├── lib/              # ユーティリティ・パーサー・PDF
├── store/            # Zustandストア
├── types/            # 型定義
└── styles/           # グローバルスタイル
```

## 4. 主要フロー

### ファイル読み込み
1. FileDropzoneでTXTをドロップ
2. parseLineChatで解析
3. 参加者が2人以上ならSenderSelectDialog表示
4. 自分の名前を選択（Cookie保存）
5. /chatへ遷移

### 検索
1. useSearchでfuse.js初期化
2. クエリ入力でresults更新
3. 結果クリックでscrollToMessage
4. 該当メッセージにハイライト（2秒）

### テーマ
1. chatStore.setThemeでテーマID更新
2. Cookieに保存
3. THEMESからThemeConfig取得
4. ChatViewport/ChatBubbleで適用

## 5. 実装方針

- パーサーは堅牢に（warningsで失敗行を記録）
- 巨大コンポーネントを避ける
- 長文・大量メッセージでもパフォーマンスを考慮
- 型安全を徹底
