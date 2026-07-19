# DLsite アフィリエイト記事（トレンド逆引き）作成ルール

AI が新規 DLsite アフィリエイトページを作るときに読む手順書。  
参考実装: `src/content/blog/dlsite-kurokami-shirt-lift/`

関連: `doc/assets.md`（画像の置き場所）、`README.md`（フロントマター一覧）

---

## 前提・制約

- サイトテーマは **AIトレンド × エロ魔女**。成人向けの描写は可。
- **未成年・児童を連想させるタグ／描写は禁止**（例: `loli`, `shota`, `child`, `underage`, 年齢明示が低い表現など）。成人であることが明確なタグに置き換える（参考記事は `mature_female` を使用）。
- 画像生成はユーザーがローカルで行い、完成画像を記事フォルダに置く。AI は **記事（MDX）とフォルダ構成** を用意する。
- コミットはユーザー指示があるまで行わない。

---

## 入力（ユーザーからもらうもの）

| 項目 | 例 | 必須 |
|------|-----|------|
| DLsite 作品 URL | `https://www.dlsite.com/aix/work/=/product_id/RJ01661833.html` | ✅ |
| product_id | URL から抽出（例: `RJ01661833`） | ✅（URL から可） |
| WD14 / Danbooru プロンプト全文 | カンマ区切りタグ列 | ✅ |
| 画像生成モデル名 | `NoobAI-XL (NAI-XL)` / `Illustrious-XL-v2.0` など | ✅ |
| モデル固有の品質・トリガーワード | 例: `masterpiece, best quality, newest, absurdres, highres, safe,` | モデルにより ✅ |
| 生成サンプル画像（通常 4 枚） | webp / png | 後からでも可 |
| スラッグ希望 | 未指定ならテーマから英語kebabで提案 | 任意 |

---

## フォルダ構成

```text
src/content/blog/<slug>/
├── index.mdx
└── images/
    ├── <slug>1.webp          # 生成サンプル（推奨命名）
    ├── <slug>2.webp
    ├── <slug>3.webp
    └── <slug>4.webp
```

- スラッグ＝URL パス。DLsite 系は `dlsite-<テーマ英語>` が慣例（例: `dlsite-kurokami-shirt-lift`）。
- **サンプル画像は `public/` に置かない。** 記事フォルダの `images/` に置き、フロントマターは相対パス `./images/...`。
- 画像がまだ無い場合: `images/` ディレクトリだけ作り、フロントマターの `images` は省略 or 後で追加。本文は「画像追加待ち」でも成立するように書く。

---

## フロントマター（必須パターン）

```yaml
---
title: '【DLsite上位】トレンド逆引き：<シチュ要約>を解剖する'
description: 'DLsiteでランキング上位の作品からプロンプトを逆算。<キータグ>を再現するDanbooruタグの構成を検証します。'
pubDate: YYYY-MM-DD          # 作成日（今日）
category: 'ai'
tags:
  - DLsite
  - 画像生成AI
  - Danbooru
  - <キータグ英語>           # 例: shirt_lift / twin_drills
  - プロンプト
  - WD14
dlsite_id: 'RJ0xxxxxxx'
dlsite_url: 'https://www.dlsite.com/aix/work/=/product_id/RJ0xxxxxxx.html'
danbooru_tags:                 # 記事末尾パネル用（代表タグのみ 6〜12 個程度）
  - 1girl
  - <key_tag_1>
  - <key_tag_2>
images:                        # 画像が揃ってから
  - './images/<slug>1.webp'
  - './images/<slug>2.webp'
  - './images/<slug>3.webp'
  - './images/<slug>4.webp'
---
```

| フィールド | 役割 |
|-----------|------|
| `dlsite_id` / `dlsite_url` | 記事末尾の DLsite カード（`DanbooruTrend.astro` が API 取得） |
| `danbooru_tags` | キータグ一覧＋コピペ用（**全文ではなく代表タグ**） |
| `images` | ローカル錬成サンプルのギャラリー |

本文のあとにタグ一覧・DLsiteリンク・画像グリッドが **自動表示**される。本文で同じ情報を重複させない。

---

## 本文テンプレ（MDX）

参考: `src/content/blog/dlsite-kurokami-shirt-lift/index.mdx`

```mdx
---
# …フロントマター…
---

import CharacterSpeech from '../../../components/CharacterSpeech.astro';

<CharacterSpeech character="rina">
「ちょっとあんた！今回のトレンドは<シチュ日本語>（`<key_tag>`）よ！
WD14の使い魔にのぞき見させたら、<副タグ1>（`<tag1>`）や<副タグ2>（`<tag2>`）までしっかり数値化されてたわ。
この呪文をベースに、ローカルで **<モデル名>** を焚いて錬成した成果が下の○枚よ。じっくり拝みなさい！」
</CharacterSpeech>

### 🔮 実際に使った生呪文（Danbooruプロンプト）

生成モデル：**<モデル名>**

> コピペ用：
>
> `<品質・トリガーワード>, <本文プロンプト全文>,`

記事末尾に、キータグ一覧・DLsiteリンク・サンプル画像が自動で並びます。
```

### 本文の書き方ルール

1. **必ず MDX**（`CharacterSpeech` を import するため）。
2. リナちゃんの口調: 強気・解説役。タグは `` `code` `` で示す。
3. **コピペ用ブロックには、モデルの品質／トリガーワードを先頭に忘れず入れる。**
   - NoobAI-XL 例: `masterpiece, best quality, newest, absurdres, highres, safe,` + 本文タグ
4. プロンプト全文はユーザー提供のものを基本そのまま（ただし未成年示唆タグは削除・置換してから掲載）。
5. 締めの1行は「記事末尾に自動で並ぶ」旨を残す（レイアウトと矛盾させない）。
6. タイトルは `【DLsite上位】トレンド逆引き：…` 形式を踏襲。

---

## タグの扱い

### `danbooru_tags`（フロントマター）

- シチュを象徴する **少数のキータグ** だけ。
- 例（シャツ捲り記事）: `1girl`, `short_hair`, `black_hair`, `large_breasts`, `shirt_lift`, `clothes_pull`, `bare_shoulders`, `sweat`

### コピペ用（本文）

- WD14 抽出の **フルプロンプト**。
- 先頭にモデル指定の品質タグ／トリガーを連結。
- 末尾カンマの有無はユーザー原文に合わせる（参考記事は末尾カンマあり）。

### モデル別トリガー（忘れやすいので要確認）

| モデル | よく使う先頭ワード（ユーザー指定を優先） |
|--------|------------------------------------------|
| NoobAI-XL (NAI-XL) | `masterpiece, best quality, newest, absurdres, highres, safe,` |
| Illustrious 系 | ユーザー指定に従う（参考記事は本文タグのみ＋モデル名表記） |

ユーザーがトリガーを明示したら **必ずコピペ用に含める**。

---

## 作業チェックリスト

1. [ ] URL から `dlsite_id` を抽出
2. [ ] スラッグ決定（`dlsite-...`）
3. [ ] 未成年示唆タグが無いか確認。あれば成人向けに置換してユーザーに報告
4. [ ] `src/content/blog/<slug>/index.mdx` 作成
5. [ ] `images/` 用意。画像があれば配置し `images` フロントマターを埋める
6. [ ] タイトル・description・tags・キータグ・モデル名・トリガーを整合
7. [ ] `astro dev --background` で表示確認（未起動なら起動）。`astro dev status` / `astro dev logs` で確認可
8. [ ] 記事末尾に DLsite カード・タグ・ギャラリーが出ることを確認

---

## 画像が後から来る場合

1. 先に MDX だけ公開可能な状態で作る（`images` キーは省略可）。
2. ユーザーが画像を渡したら `images/` に置き、フロントマターの `images` を追加。
3. ファイル名は `<slug>N.webp`（N=1..4）を推奨。

---

## やってはいけないこと

- `public/images/` にサンプルを置く
- フロントマターの `danbooru_tags` にフルプロンプトを全部放り込む（パネルが冗長になる）
- 品質／トリガーワードをコピペ用から落とす
- `.md` で書いて `CharacterSpeech` を import しようとする（MDX 必須）
- 未成年・児童を連想させる性的コンテンツを記事化する

---

## 完了時の報告（AI → ユーザー）

- 作成したパス（`src/content/blog/<slug>/`）
- スラッグと想定 URL
- 使ったモデル名とトリガーを入れたこと
- 画像の有無（未配置なら「画像を `images/` に追加してね」）
- タグを置換した場合はその一覧
