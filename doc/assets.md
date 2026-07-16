# 画像・部品の置き場所

## 方針

| 種類 | 置き場所 | 理由 |
|------|----------|------|
| **記事固有の画像** | `src/content/blog/<slug>/` | 記事と画像を同じフォルダにまとめる。削除・移動が楽 |
| **サイト共通の画像** | `src/assets/` | ロゴ・デフォルトOGP・アバターなど複数ページで再利用 |
| **UI部品（コンポーネント）** | `src/components/` | Header / Sidebar / XReply など |
| **そのまま配信したい静的ファイル** | `public/` | favicon、robots.txt など URL 固定が必要なもの |

Astro の画像最適化（`astro:assets` / `image()`）を効かせたいものは **`src/` 配下** に置く。  
`public/` は最適化されず、パスそのままで配信される。

---

## 記事ごと（推奨）

```text
src/content/blog/
└── yokoso-majo-sokuho/          ← スラッグ＝URLの /blog/yokoso-majo-sokuho/
    ├── index.md                 ← 本文
    ├── hero.webp                ← アイキャッチ（任意）
    └── images/                  ← 本文中の図・スクショ（任意）
        ├── figure-01.webp
        └── figure-02.webp
```

### フロントマター（アイキャッチ）

`index.md` と同じフォルダからの相対パスで指定する。

```markdown
---
title: '記事タイトル'
description: '概要'
pubDate: '2026-07-15'
category: 'ai'
tags: ['画像生成AI']
heroImage: './hero.webp'
---
```

### 本文中の画像

- **Markdown（.md）**: 相対パスでOK  
  `![説明](./images/figure-01.webp)`
- **MDX（.mdx）**: `import` + `<Image />` も使える（最適化したいとき向き）

---

## 共通アセット

```text
src/assets/
├── brand/          # ロゴ・サイトOGP・リナのアバターなど
│   ├── logo.svg
│   ├── og-default.webp
│   └── rina-avatar.webp
└── common/         # 複数記事で使い回す挿絵・バナー雛形など
    └── placeholder.webp
```

コンポーネントから使う例:

```astro
---
import logo from '../assets/brand/logo.svg';
import { Image } from 'astro:assets';
---
<Image src={logo} alt="魔女速報" />
```

---

## public/ に置くもの

- `favicon.svg` / `favicon.ico`
- `robots.txt`、検証用ファイルなど「URLがそのまま必要」なもの

アフィリエイト用の固定URLバナーを置く場合もここ（例: `public/pr/banner-xxx.png` → `/pr/banner-xxx.png`）。

---

## コンポーネント（共通部品）

```text
src/components/
├── Header.astro
├── Footer.astro
├── Sidebar.astro
├── Headline.astro      # 売れ筋ランキング枠
├── XReply.astro        # コメント欄代わりのX誘導
└── ...
```

見た目の共通スタイルは `src/styles/global.css`、サイト定数は `src/consts.ts`。
