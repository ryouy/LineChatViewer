/**
 * 画像アセットの設定
 *
 * 【方法1】URLで指定（おすすめ）
 * lib/imageUrls.ts で URL を編集
 *
 * 【方法2】public/images/ にファイルを置く
 * PHOTO_COUNT などを設定し、1.jpg, 2.jpg のように連番で配置
 *
 * どちらも空なら picsum.photos のランダム画像を使用
 */

import {
  PHOTO_URLS,
  STICKER_URLS,
  AVATAR_URLS,
} from "./imageUrls";

// ファイル配置の場合
export const PHOTO_COUNT = 0;
export const STICKER_COUNT = 0;
export const AVATAR_COUNT = 0;
export const PHOTO_EXT = "jpg";
export const STICKER_EXT = "png";
export const AVATAR_EXT = "jpg";

function getLocalPath(folder: string, index: number, ext: string): string {
  return `/images/${folder}/${index}.${ext}`;
}

function pickFromUrls(urls: string[], seed: number): string {
  const index = Math.abs(seed % urls.length);
  return urls[index];
}

export function getPhotoUrl(messageId: string): string {
  const seed = messageId
    .split("")
    .reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0);
  if (PHOTO_URLS.length > 0) return pickFromUrls(PHOTO_URLS, seed);
  if (PHOTO_COUNT > 0) {
    const index = (Math.abs(seed % PHOTO_COUNT) % PHOTO_COUNT) + 1;
    return getLocalPath("photos", index, PHOTO_EXT);
  }
  const id = Math.abs(seed % 1000) + 1;
  return `https://picsum.photos/id/${id}/300/200`;
}

export function getStickerUrl(messageId: string): string {
  const seed = (messageId + "sticker")
    .split("")
    .reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0);
  if (STICKER_URLS.length > 0) return pickFromUrls(STICKER_URLS, seed);
  if (STICKER_COUNT > 0) {
    const index = (Math.abs(seed % STICKER_COUNT) % STICKER_COUNT) + 1;
    return getLocalPath("stickers", index, STICKER_EXT);
  }
  const id = Math.abs(seed % 1000) + 1;
  return `https://picsum.photos/id/${id}/120/120`;
}

export function getAvatarUrl(sender: string): string {
  const seed = sender
    .split("")
    .reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0);
  if (AVATAR_URLS.length > 0) return pickFromUrls(AVATAR_URLS, seed);
  if (AVATAR_COUNT > 0) {
    const index = (Math.abs(seed % AVATAR_COUNT) % AVATAR_COUNT) + 1;
    return getLocalPath("avatars", index, AVATAR_EXT);
  }
  const id = Math.abs(seed % 1000) + 1;
  return `https://picsum.photos/id/${id}/64/64`;
}
