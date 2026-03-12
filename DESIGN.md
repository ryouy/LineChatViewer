# LINE トーク履歴ビューアー 設計書

## 1. 全体設計

### 目的
- LINE履歴TXTを読み込み、LINEに近いUIでトークを閲覧する
- ローカル開発 → GitHub公開 → Vercelデプロイを前提

### アーキテクチャ
- **フロント**: Next.js App Router + React
- **状態管理**: Zustand (chatStore)
- **永続化**: Cookie（自分の名前、テーマ）

---

## 2. データ型

```typescript
type ChatMessage = {
  id: string;
  sender: string;
  text: string;
  time: string;
  date: string;
  timestamp: number;
  type: "text" | "photo" | "sticker" | "system" | "canceled";
  isMine: boolean;
};

type ChatSession = {
  id: string;
  title: string;
  messages: ChatMessage[];
  participants: string[];
};
```

---

## 3. ディレクトリ構成（推奨）

```
src/
├── app/
├── components/
├── hooks/
├── lib/
│   ├── parser/
│   ├── pdf/
│   └── utils/
├── store/
└── types/
```

※ 本プロジェクトはルート直下に配置（Next.js標準）

---

## 4. 主要フロー

### ファイル読み込み
1. FileDropzone で TXT をドロップ
2. parseLineChat で解析
3. 参加者2人以上 → SenderSelectDialog
4. 自分の名前を選択 → Cookie 保存
5. /chat へ遷移

---

## 5. 実装方針

- 型安全
- 巨大コンポーネントを避ける
- パーサーは堅牢に（warnings で失敗行を記録）
- UI を安っぽくしない
