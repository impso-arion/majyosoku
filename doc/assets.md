# 画像・部品の置き場所

## 方針

| 種類 | 置き場所 | 理由 |
|------|----------|------|
| **記事固有の画像** | `src/content/blog/<slug>/` | 記事と画像を同じフォルダにまとめる。削除・移動が楽 |
| **サイト共通の画像** | `src/assets/` | ロゴ・デフォルトOGP・アバターなど複数ページで再利用 |
| **UI部品（コンポーネント）** | `src/components/` | Header / Sidebar / BlueskyReply など |
| **そのまま配信したい静的ファイル** | `public/` | favicon、robots.txt など URL 固定が必要なもの |

Astro の画像最適化（`astro:assets` / `image()`）を効かせたいものは **`src/` 配下** に置く。  
`public/` は最適化されず、パスそのままで配信される。

---

## 記事ごと（推奨・これが基本）

```text
src/content/blog/
└── dlsite-kurokami-shirt-lift/   ← スラッグ＝URL
    ├── index.mdx                 ← 本文（MDXならコンポーネント import 可）
    ├── hero.webp                 ← アイキャッチ（任意）
    └── images/                   ← ★ その記事だけの画像はここ
        ├── rj01612853_01.png
        ├── rj01612853_02.png
        ├── rj01612853_03.png
        └── rj01612853_04.png
```

**生成サンプル4枚も `public/` ではなく、記事フォルダの `images/` に置いてください。**  
フロントマターでは同じフォルダからの相対パスで指定します（Astro が最適化します）。

```yaml
images:
  - './images/rj01612853_01.png'
  - './images/rj01612853_02.png'
  - './images/rj01612853_03.png'
  - './images/rj01612853_04.png'
```

`public/images/...` は使わなくてOK（URL直指定になり最適化されない）。迷ったら常に記事の `images/`。

### フロントマター（アイキャッチ）

```markdown
---
title: '記事タイトル'
description: '概要'
pubDate: '2026-07-15'
category: 'shirt-lift'
tags: ['shirt_lift', 'DLsite']
heroImage: './hero.webp'
---
```

### 本文中の画像

- **Markdown（.md）**: `![説明](./images/figure-01.webp)`
- **MDX（.mdx）**: `import CharacterSpeech from '../../../components/CharacterSpeech.astro'` など可

### トレンド逆引き記事（DLsite）

フロントマターに次を書くと、CharacterSpeech の直後にパネルが自動表示されます  
（表示順: 画像 → 生呪文 → キータグ → 使用モデル → DLsite）。

| フィールド | 内容 |
|-----------|------|
| `dlsite_id` | 例: `RJ01612853` |
| `dlsite_url` | アフィリエイト／作品URL |
| `danbooru_tags` | WD14抽出タグの配列（代表のみ） |
| `prompt` | フルプロンプト（品質／トリガーなし） |
| `images` | 上記 `./images/...` の配列（最大でも何枚でも可） |
| `models` | `{ name, trigger?, notes? }` 生成モデル情報（外部リンクなし。`/models` 検索対象） |

---

## 共通アセット

```text
src/assets/
├── brand/          # ロゴ・キャラ・ファビコン原版など
│   ├── icon.webp
│   ├── chara.webp
│   ├── footer.webp
│   └── favicon.ico   # 原版。配信用は public/favicon.ico にも置く
└── common/         # 複数記事で使い回す挿絵・バナー雛形など
```

コンポーネントから使う例:

```astro
---
import logo from '../assets/brand/logo.svg';
import { Image } from 'astro:assets';
---
<Image src={logo} alt="へっぽこ魔女のHなAIグリモワール" />
```

---

## public/ に置くもの

- `favicon.ico`（ブラウザが `/favicon.ico` を取りにくるのでここが本番配信）
- `robots.txt`、検証用ファイルなど「URLがそのまま必要」なもの

アフィリエイト用の固定URLバナーを置く場合もここ（例: `public/pr/banner-xxx.png` → `/pr/banner-xxx.png`）。

---

## コンポーネント（共通部品）

```text
src/components/
├── Header.astro
├── Footer.astro
├── Sidebar.astro
├── Headline.astro      # 解剖済みトレンド供物（dlsite_id → product.json）
├── BlueskyReply.astro  # コメント欄代わりのBluesky誘導
└── ...
```

見た目の共通スタイルは `src/styles/global.css`、サイト定数は `src/consts.ts`。
