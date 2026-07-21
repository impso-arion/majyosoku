# DLsite アフィリエイト記事（トレンド逆引き）作成ルール

AI が新規 DLsite アフィリエイトページを作るときに読む手順書。  
参考実装: `src/content/blog/dlsite-idol-stage/` / `src/content/blog/dlsite-kurokami-shirt-lift/`

関連: [`doc/assets.md`](assets.md)（画像の置き場所）、[`README.md`](../README.md)（サイト全体・検索・**Cloudflare デプロイ**）

---

## この記事タイプで何が起きるか

1. ユーザーが DLsite URL・プロンプト・モデル名・（あとで）画像を渡す
2. AI が `src/content/blog/dlsite-<テーマ>/index.mdx` を用意する
3. 本文は **CharacterSpeech（リナのセリフ）だけ**
4. フロントマターの値から、記事末尾パネル（`DanbooruTrend.astro`）が自動表示される

**画面上の表示順**

```text
CharacterSpeech（本文）
  → ローカル錬成サンプル（images）
  → 実際に使った生呪文（prompt）
  → キータグ（danbooru_tags）
  → 使用モデル（models）
  → 元ネタ / DLsite（dlsite_id）
```

---

## カテゴリ・タグ・モデル検索の役割分担

似て見えるが **入口が違う**。混ぜない。

| 層 | フロントマター | ユーザー向けの意味 | どこで辿れる |
|----|----------------|-------------------|--------------|
| **カテゴリ** | `category`（1つ） | 日本語シチュの「棚」。眺めて楽しい入口 | `/categories`・`/categories/<slug>/`・サイドバー |
| **タグ** | `tags`（複数） | Danbooru英語タグ＋横断メタの検索 | `/tags`・サイドバー（モデルより下） |
| **モデル** | `models.name` | 使った生成モデル名での横断 | `/models`・サイドバー上段・ヘッダー |
| **パネル用キータグ** | `danbooru_tags` | 記事内の代表タグ一覧（検索索引ではない） | 記事末尾パネルのみ |

### カテゴリ（日本語シチュ）

- 定義: [`src/consts.ts`](../src/consts.ts) の `CATEGORIES`
- スキーマ: [`src/content.config.ts`](../src/content.config.ts) の `category` enum（**両方に追加が必要**）
- slug は英語 kebab（例: `shirt-lift`）、画面表示は日本語（例: シャツ捲り）
- 現在の例: `greeting`（ごあいさつ）/ `shirt-lift` / `twin-drills` / `goblin` / `japanese-armor` / `idol` / `bikini-armor`
- **新規シチュ記事を書く前に** consts + content.config へ1行追加してから `category` を指定する（動的生成しない＝選ばれた棚）

### タグ（検索用）

- 英語シチュキー（`shirt_lift`, `idol` など）＋メタ（`DLsite`, `Danbooru`, `プロンプト`, `WD14` など）
- カテゴリの日本語ラベルとは別に持つ（二重導線は許容）
- `danbooru_tags`（パネル用）と混同しない。フルプロンプトをここに全部入れない

### モデル検索

- `models.name` が `/models` と `/models/<name>/` に自動集計される
- Civitai 等の外部リンクは持たない
- 品質・トリガーは `models.trigger`、生成メモは `models.notes`

---

## 前提・制約

- サイトテーマは **AIトレンド × エロ魔女**。成人向けの描写は可。
- **未成年・児童を連想させるタグ／描写は禁止**（例: `loli`, `shota`, `child`, `underage`）。成人であることが明確なタグに置き換える（参考: `mature_female`）。
- 画像生成はユーザーがローカルで行い、完成画像を記事フォルダに置く。AI は **記事（MDX）とフォルダ構成** を用意する。
- コミットはユーザー指示があるまで行わない。

---

## DLsite 作品情報の取得（API）

作品ページの HTML は年齢ゲートで中身が取れないことが多い。  
**タイトル・サークル・価格・サムネ・ジャンルなどは API で取れる**ので、記事作成時はこちらを使う。

| 項目 | 内容 |
|------|------|
| 実装 | [`src/lib/dlsite.ts`](../src/lib/dlsite.ts) の `fetchDlsiteWork` |
| エンドポイント | `https://www.dlsite.com/maniax/api/=/product.json?workno=<RJ番号>` |
| 呼び出し元 | 記事末尾パネル（`DanbooruTrend.astro`）がビルド時に自動取得 |
| 記事側に書くもの | `dlsite_id`（必須）と任意で `dlsite_url`。タイトル等は MDX に手書きしない |

**記事作成時の使い方（AI）**

1. URL から `RJ0xxxxxxx` を抽出する
2. 上記 API（または `fetchDlsiteWork`）でメタを取得し、スラッグ／タイトル／シチュ判断の参考にする
3. HTML の WebFetch が空でも「取れない」と諦めない。API を試す
4. 取得結果はパネル表示用。本文やフロントマターに作品タイトルを重複して書かない

失敗時はカードがリンクのみになる（ビルドは止まらない）。非公式 API のため、将来壊れる可能性はある。

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
| カテゴリ日本語名の希望 | 未指定ならシチュから提案（consts 未登録なら追加） | 任意 |

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

- スラッグ＝URL パス。DLsite 系は `dlsite-<テーマ英語>` が慣例（例: `dlsite-idol-stage`）。
- **サンプル画像は `public/` に置かない。** 記事フォルダの `images/` に置き、フロントマターは相対パス `./images/...`。
- 画像がまだ無い場合: `images/` ディレクトリだけ作り、フロントマターの `images` は省略。**プレースホルダー画像は作らない。**

---

## フロントマター（必須パターン）

```yaml
---
title: '【DLsite上位】トレンド逆引き：<シチュ要約>を解剖する'
description: 'DLsiteでランキング上位の作品からプロンプトを逆算。<キータグ>を再現するDanbooruタグの構成を検証します。'
pubDate: YYYY-MM-DD
category: '<シチュslug>'       # 例: idol。未登録なら先に CATEGORIES + enum へ追加
featured: true                 # 任意。サイドバー「人気記事」に出すとき
tags:
  - DLsite
  - 画像生成AI
  - Danbooru
  - <キータグ英語>           # 例: idol / shirt_lift（/tags 検索用）
  - プロンプト
  - WD14
dlsite_id: 'RJ0xxxxxxx'
dlsite_url: 'https://www.dlsite.com/aix/work/=/product_id/RJ0xxxxxxx.html'
danbooru_tags:                 # 代表タグのみ 6〜12 個（パネル用）
  - 1girl
  - <key_tag_1>
  - <key_tag_2>
prompt: '<本文プロンプト全文>,'   # 品質／トリガーは含めない
images:                        # 画像が揃ってから
  - './images/<slug>1.webp'
  - './images/<slug>2.webp'
  - './images/<slug>3.webp'
  - './images/<slug>4.webp'
models:
  name: 'NoobAI-XL (NAI-XL)'   # /models 検索キー
  trigger: 'masterpiece, best quality, newest, absurdres, highres, safe,'
  notes: 'ローカル生成。品質タグはプロンプト先頭に付与。'
---
```

| フィールド | 役割 |
|-----------|------|
| `category` | 日本語シチュ棚。新規は consts + content.config に追加してから使用 |
| `tags` | `/tags` 用（Danbooru英語＋メタ） |
| `dlsite_id` / `dlsite_url` | DLsite カード（API 取得） |
| `danbooru_tags` | パネルのキータグ（全文ではない） |
| `prompt` | パネル「生呪文」コピペ用（トリガーなし） |
| `images` | ギャラリー |
| `models` | パネル「使用モデル」＋ `/models` 索引 |

---

## 本文テンプレ（MDX）

```mdx
---
# …フロントマター…
---

import CharacterSpeech from '../../../components/CharacterSpeech.astro';

<CharacterSpeech character="rina">
「ちょっとあんた！今回のトレンドは<シチュ日本語>（`<key_tag>`）よ！
WD14の使い魔にのぞき見させたら、<副タグ1>（`<tag1>`）や<副タグ2>（`<tag2>`）までしっかり数値化されてたわ。
この呪文をベースに、ローカルで **<モデル名>** を焚いて錬成した成果が下に並ぶわ。じっくり拝みなさい！」
</CharacterSpeech>
```

### 本文の書き方ルール

1. **必ず MDX**（`CharacterSpeech` を import するため）。
2. リナちゃんの口調: 強気・解説役。タグは `` `code` `` で示す。
3. **生呪文・キータグ・モデル・DLsite は本文に書かない**（パネル自動）。
4. **品質／トリガーは `models.trigger` のみ。** `prompt` 先頭には入れない。
5. プロンプトはユーザー提供を基本そのまま（未成年示唆タグは削除・置換してから `prompt` へ）。
6. タイトルは `【DLsite上位】トレンド逆引き：…` 形式。

---

## フィールド詳細

### `danbooru_tags`

- シチュを象徴する **少数のキータグ** だけ。
- 例: `1girl`, `idol`, `stage`, `group_sex`, `twintails`

### `prompt`

- WD14 抽出の **フルプロンプト**（本文タグのみ）。
- 品質／トリガーは含めない。
- 末尾カンマの有無はユーザー原文に合わせる。

### `models`

| キー | 必須 | 内容 |
|------|------|------|
| `name` | ✅ | モデル表示名。`/models` のキー |
| `trigger` | 任意 | 品質・トリガーワード |
| `notes` | 任意 | 生成条件メモ |

| モデル | よく使うトリガー（ユーザー指定優先） |
|--------|--------------------------------------|
| NoobAI-XL (NAI-XL) | `masterpiece, best quality, newest, absurdres, highres, safe,` |
| Illustrious 系 | ユーザー指定に従う |

---

## 作業チェックリスト

1. [ ] URL から `dlsite_id` を抽出
2. [ ] **product.json API（または `fetchDlsiteWork`）で作品メタを取得**（HTML の年齢ゲートに頼らない）
3. [ ] スラッグ決定（`dlsite-...`）
4. [ ] `category` slug 決定。未登録なら `CATEGORIES` + `content.config.ts` enum に追加
5. [ ] 未成年示唆タグが無いか確認（あれば置換して報告）
6. [ ] `index.mdx` 作成（本文は CharacterSpeech のみ）
7. [ ] `prompt` / `models` / `danbooru_tags` / `category` / `tags` を埋める
8. [ ] `images/` 用意。画像があれば配置し `images` を埋める（無ければ省略。プレースホルダ禁止）
9. [ ] 表示確認: **画像 → 生呪文 → キータグ → モデル → DLsite**
10. [ ] `/categories` に日本語カテゴリ、`/models` にモデル名、`/tags` に英語タグが出ること

---

## 画像が後から来る場合

1. MDX だけ先に作る（`images` キー省略可）。
2. 画像が来たら `images/` に置き、フロントマターへ追加。
3. ファイル名は `<slug>N.webp`（N=1..4）推奨。
4. 完了報告では、追加用の `images:` YAML と配置パスをサマリーに出す。
5. **本番確認**: push 後、記事ページのギャラリー URL が `/_astro/...webp` になっていること（`/_image?...` のままなら [`README.md`](../README.md) のデプロイ設定を見直す）。

---

## やってはいけないこと

- `public/images/` にサンプルを置く
- `danbooru_tags` にフルプロンプトを全部入れる
- 品質／トリガーを `prompt` に重複掲載する
- 本文に生呪文・DLsite・キータグを手書きで重複させる
- **作品ページ HTML が年齢ゲートで空でも「情報が取れない」と決めつける**（API を使う）
- 未登録の `category` を consts / enum なしで使う
- 画像未着時に差し替え用プレースホルダー画像を作る
- `.wrangler/` を Git にコミットする（Cloudflare Pages ビルドが Linux で失敗する）
- `.md` で `CharacterSpeech` を import する（MDX 必須）
- 未成年・児童を連想させる性的コンテンツを記事化する

---

## 完了時の報告（AI → ユーザー）

- 作成パス（`src/content/blog/<slug>/`）と想定 URL
- 追加した `category`（新規なら consts / enum 追加の有無）
- `models.name` / `trigger` の有無
- 画像の有無（未配置なら `images:` YAML と配置パス）
- タグを置換した場合はその一覧
