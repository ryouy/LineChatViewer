# 画像アセットの設定

## 方法1: URLで指定（おすすめ）

`lib/imageUrls.ts` で URL を編集。画像のアップロードは不要です。

```ts
export const PHOTO_URLS = [
  "https://example.com/photo1.jpg",
  "https://example.com/photo2.jpg",
];
export const STICKER_URLS = ["https://example.com/sticker1.png", ...];
export const AVATAR_URLS = ["https://example.com/avatar1.jpg", ...];
```

## 方法2: ファイルを配置

```
public/images/
├── photos/    … 1.jpg, 2.jpg, 3.jpg …
├── stickers/  … 1.png, 2.png …
└── avatars/   … 1.jpg, 2.jpg …
```

`lib/imageConfig.ts` の `PHOTO_COUNT` などを実際の枚数に設定。

## どちらも空の場合

picsum.photos のランダム画像が使われます。
