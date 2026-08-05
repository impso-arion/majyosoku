# FANZA アフィリエイト記事（トレンド逆引き）作成ルール

AI が新規 FANZA アフィリエイトページを作るときに読む手順書。  
現在は **FANZAブックス**（`https://book.dmm.co.jp/product/.../`）、**FANZA DL/ソフト系**（`https://dlsoft.dmm.co.jp/detail/.../`）、**DVDレンタル**（`https://www.dmm.co.jp/rental/-/detail/=/cid=.../`）に対応する。

関連: [`doc/dlsite-affiliate-page.md`](dlsite-affiliate-page.md)（DLsite版）、[`doc/rinas_Personality.md`](rinas_Personality.md)（**リナの口調・世界観の正本**）、[`doc/assets.md`](assets.md)（画像の置き場所）、[`README.md`](../README.md)（サイト全体・検索・Cloudflare デプロイ）

---

## 現在の実装状況

FANZA記事の基盤実装は完了済み。

| 機能 | 実装 |
|------|------|
| フロントマター | `src/content.config.ts` の `fanza_url` / `fanza_product_id` / `fanza_meta` |
| URL検証・変換 | `src/lib/fanza.ts` |
| DMM商品情報API | `src/lib/fanza.ts`（ビルド時取得） |
| 作品カード | `src/components/FanzaCard.astro` |
| 記事パネル連携 | `src/components/DanbooruTrend.astro` / `src/layouts/BlogPost.astro` |
| 参考記事 | `src/content/blog/fanza-shirt-lift-panty-pull/` |

DMM商品情報APIによる作品メタデータの自動取得に対応済み。取得できない場合は、`fanza_meta`、さらに商品コード付きリンクの順にフォールバックする。

記事ファイルだけに完成済みアフィリエイトURLを直書きして運用を始めない。  
記事には **プレーンな商品URL** を保存し、アフィリエイトURLは共通関数で生成する。

---

## この記事タイプで何が起きるか

1. ユーザーが FANZA 商品URL・プロンプト・モデル名・（あとで）画像を渡す
2. AI が `src/content/blog/fanza-<テーマ>/index.mdx` を用意する
3. 本文は **CharacterSpeech（リナのセリフ）だけ**
4. フロントマターの値から、記事末尾パネルにFANZA作品カードが自動表示される

### 記事に入れる要素

`src/content/blog/fanza-hitachi-magic-wand-comic/index.mdx` と同じ形を基準にする。

- `images`: ローカル錬成サンプル画像
- `prompt`: 実際に使った生呪文
- `danbooru_tags`: WD14で拾ったキータグ
- `models`: 使用モデル名と補足
- `fanza_url` / `fanza_product_id` / `fanza_meta`: 元ネタリンクと作品メタ

この4つの見出し相当の情報がそろうと、記事末尾のパネルで
`画像 → 生呪文 → キータグ → 使用モデル → 元ネタ / FANZA`
の順に表示される。

**画面上の表示順**

```text
CharacterSpeech（本文）
  → ローカル錬成サンプル（images）
  → 実際に使った生呪文（prompt）
  → キータグ（danbooru_tags）
  → 使用モデル（models）
  → 元ネタ / FANZA（fanza_*）
```

DLsite記事と同じ体験に揃え、アフィリエイト先だけをFANZAに切り替える。

---

## アフィリエイト設定

| 項目 | 値 |
|------|----|
| アフィリエイトID | `rinasgrimoir-001` |
| リンク生成先 | `https://al.fanza.co.jp/` |
| `ch` | `reward_ranking` |
| `ch_id` | `link` |

アフィリエイトIDは記事ごとに書かず、`src/consts.ts` に定数として1回だけ置く。

```ts
/** FANZA アフィリエイト ID（全作品リンクに自動付与） */
export const FANZA_AFFILIATE_ID = 'rinasgrimoir-001';
```

---

## 商品URLからアフィリエイトURLへの変換

### 入力例

```text
https://book.dmm.co.jp/product/6282690/k568agotp13109/
```

### 出力例

```text
https://al.fanza.co.jp/?lurl=https%3A%2F%2Fbook.dmm.co.jp%2Fproduct%2F6282690%2Fk568agotp13109%2F&af_id=rinasgrimoir-001&ch=reward_ranking&ch_id=link
```

### 変換規則

1. 商品ページのプレーンURL全体を `encodeURIComponent` 相当でURLエンコードする
2. エンコード結果を `lurl` に入れる
3. `af_id=rinasgrimoir-001` を付ける
4. `ch=reward_ranking&ch_id=link` を付ける

実装は [`src/lib/fanza.ts`](../src/lib/fanza.ts) を正本とする。記事やコンポーネントからは次のように呼ぶ。

```ts
import { toFanzaAffiliateUrl } from '../lib/fanza';

const href = toFanzaAffiliateUrl(productUrl);
```

`URLSearchParams` が `lurl` を安全にエンコードするため、**事前に `encodeURIComponent` した値を渡さない**。二重エンコードになる。

### 安全上のルール

- フロントマターには対応サービスのプレーンURLだけを保存する
- 許可するのは `book.dmm.co.jp/product/...`、`dlsoft.dmm.co.jp/detail/.../`、`www.dmm.co.jp/rental/-/detail/=/cid=.../`
- `http:`、ユーザー情報を含むURL、別ドメインは拒否する
- `al.fanza.co.jp` の完成済みURLを `fanza_url` に入れない
- リンクには `target="_blank"` と `rel="noopener nofollow sponsored"` を付ける
- 将来、動画・同人など対象サービスを増やす場合は、許可ホストをコード上で明示的に追加する

---

## FANZA作品情報の取得方針

FANZAの商品ページは、未ログイン状態・年齢確認・アクセス元によってログイン画面へ転送されることがある。  
したがって、**商品ページHTMLのスクレイピングを記事作成の必須条件にしない**。

この例でも、外部から商品ページへアクセスした結果はログイン画面になり、タイトルや価格を安定して取得できない。

### 当面の推奨

フロントマターの `fanza_meta` に、ユーザーが確認した情報を保存する。

```yaml
fanza_meta:
  title: '作品タイトル'
  maker: '作者・サークル・出版社'
  price: 1234
  intro: '短い紹介文'
  genres:
    - ジャンル1
    - ジャンル2
  thumb_url: 'https://...'
```

- `title` はカード表示のため必須
- 不明な項目は推測せず省略する
- 商品画像を保存・転載する場合は、FANZAアフィリエイト規約と画像利用条件を確認する
- 外部画像URLが安定しない場合は、サムネなしのテキストカードへフォールバックする
- ログインや年齢確認を自動回避する処理は作らない

### DMM商品情報API

ローカルでは `.env.local`、Cloudflare Pagesでは環境変数へ次を設定する。

```env
DMM_API_ID=
DMM_API_AFFILIATE_ID=
```

- `DMM_API_AFFILIATE_ID` は末尾が `-990`〜`-999` のAPI用ID
- 通常リンク用の `rinasgrimoir-001` をAPIへ渡すと `BAD REQUEST` になる
- シークレットをフロントマターやGit管理ファイルへ書かない
- API失敗時も `fanza_meta` またはリンクのみでビルドを継続する

---

## 入力（ユーザーからもらうもの）

| 項目 | 例 | 必須 |
|------|-----|------|
| FANZA 商品URL | `https://book.dmm.co.jp/product/6282690/k568agotp13109/` または `https://www.dmm.co.jp/rental/-/detail/=/cid=4mimk271/` | ✅ |
| 商品識別子 | URLから抽出（例: `6282690` / `k568agotp13109`） | ✅（URLから可） |
| 作品タイトル | 商品ページで確認した正式名 | 詳細カード表示時 |
| 作者・サークル・出版社 | 確認できる範囲 | 任意 |
| 価格・ジャンル・紹介文 | 確認できる範囲 | 任意 |
| WD14 / Danbooru プロンプト全文 | カンマ区切りタグ列 | ✅ |
| 画像生成モデル名 | `NoobAI-XL (NAI-XL)` など | ✅ |
| モデル固有の品質・トリガーワード | モデルに応じた文字列 | モデルにより ✅ |
| 生成サンプル画像（通常4枚） | webp / png | 後からでも可 |
| スラッグ希望 | 未指定ならテーマから英語kebabで提案 | 任意 |
| カテゴリ日本語名の希望 | 未指定ならシチュから提案 | 任意 |

商品情報を自動取得できなかった場合は、タイトルなどを推測で補完しない。確認できるまでは商品コード付きのリンクカードを使う。

---

## フォルダ構成

```text
src/content/blog/<slug>/
├── index.mdx
└── images/
    ├── <slug>1.webp
    ├── <slug>2.webp
    ├── <slug>3.webp
    └── <slug>4.webp
```

- FANZA系は `fanza-<テーマ英語>` をスラッグの慣例とする
- サンプル画像は `public/` に置かず、記事フォルダの `images/` に置く
- フロントマターでは `./images/...` の相対パスを使う
- 画像がまだ無い場合は `images` を省略し、プレースホルダー画像は作らない

---

## カテゴリ・タグ・モデル検索の役割分担

DLsite記事と同じルールを使う。

| 層 | フロントマター | ユーザー向けの意味 |
|----|----------------|-------------------|
| カテゴリ | `category`（1つ） | 日本語シチュの棚 |
| タグ | `tags`（複数） | Danbooru英語タグ＋横断メタ検索 |
| モデル | `models.name` | 画像生成モデル名での横断 |
| パネル用キータグ | `danbooru_tags` | 記事内の代表タグ一覧 |

- `tags` にはメタタグとして `FANZA` を入れる
- `category` の新規slugは `src/consts.ts` の `CATEGORIES` と `src/content.config.ts` のenumへ追加する
- `danbooru_tags` にフルプロンプトを入れない

---

## フロントマター（必須パターン）

以下の形式を使用する。

```yaml
---
title: '【FANZA上位】トレンド逆引き：<シチュ要約>を解剖する'
description: 'FANZAの作品からプロンプトを逆算。<キータグ>を再現するDanbooruタグの構成を検証します。'
pubDate: YYYY-MM-DD
category: '<シチュslug>'
featured: true
tags:
  - FANZA
  - 画像生成AI
  - Danbooru
  - <キータグ英語>
  - プロンプト
  - WD14
fanza_product_id: 'k568agotp13109'
fanza_url: 'https://book.dmm.co.jp/product/6282690/k568agotp13109/'
fanza_meta:
  title: '作品タイトル'
  maker: '作者・サークル・出版社'
  price: 1234
  intro: '短い紹介文'
  genres:
    - ジャンル1
  thumb_url: 'https://...'
danbooru_tags:
  - 1girl
  - <key_tag_1>
  - <key_tag_2>
prompt: '<本文プロンプト全文>,'
images:
  - './images/<slug>1.webp'
  - './images/<slug>2.webp'
  - './images/<slug>3.webp'
  - './images/<slug>4.webp'
models:
  name: 'NoobAI-XL (NAI-XL)'
  trigger: 'masterpiece, best quality, newest, absurdres, highres, safe,'
  notes: 'ローカル生成。品質タグはプロンプト先頭に付与。'
---
```

| フィールド | 役割 |
|-----------|------|
| `fanza_product_id` | カード表示や将来のAPI検索に使う商品識別子 |
| `fanza_url` | アフィリエイト化する前のプレーン商品URL |
| `fanza_meta` | APIやHTMLに依存しないカード表示用メタデータ |
| `category` | 日本語シチュ棚 |
| `tags` | `/tags` 用。`FANZA` を含める |
| `danbooru_tags` | パネルの代表キータグ |
| `prompt` | 生呪文コピペ用。品質・トリガーは含めない |
| `images` | ローカル錬成サンプル |
| `models` | 使用モデルと `/models` 索引 |

---

## 本文テンプレ（MDX）

```mdx
---
# …フロントマター…
---

import CharacterSpeech from '../../../components/CharacterSpeech.astro';

<CharacterSpeech character="rina">
「ちょっとあんた！今回FANZAで見つけたのは<シチュ日本語>（`<key_tag>`）よ！
WD14の使い魔にのぞき見させたら、<副タグ1>（`<tag1>`）や<副タグ2>（`<tag2>`）までしっかり数値化されてたわ。
この呪文をベースに、ローカルで **<モデル名>** を焚いて錬成した成果が下に並ぶわ。じっくり拝みなさい！」
</CharacterSpeech>
```

### 本文の書き方ルール

1. 必ずMDXを使う
2. 執筆前に [`doc/rinas_Personality.md`](rinas_Personality.md) を読む
3. 本文はCharacterSpeechを1つだけ置く
4. 生呪文・キータグ・モデル・FANZAリンクは本文へ重複して書かない
5. 品質・トリガーは `models.trigger` のみに置く
6. タイトルは `【FANZA上位】トレンド逆引き：…` 形式を基本とする
7. 実際のランキングを確認できていない場合は「上位」と断定せず、`【FANZA作品】` など事実に合う表現へ変える

---

## 前提・制約

- サイトテーマは **AIトレンド × エロ魔女**。成人向けの描写は可
- **未成年・児童を連想させるタグや描写は禁止**
- 登場人物が成人であることを確認できない作品は扱わない
- FANZAおよびDMMのアフィリエイト規約、素材利用条件、禁止事項を優先する
- 商品名・価格・ランキング・キャンペーン情報を推測しない
- 価格など変動する情報には、必要に応じて確認日を添える
- 画像生成はユーザーがローカルで行う
- コミットはユーザー指示があるまで行わない

---

## 基盤実装（完了済み）

以下は実装済み。仕様変更時の確認箇所として残す。

### 1. 定数

`src/consts.ts` に次を追加する。

- `FANZA_AFFILIATE_ID = 'rinasgrimoir-001'`
- 必要ならFANZAリンク生成用の固定値

### 2. URL変換ライブラリ

`src/lib/fanza.ts` を作成する。

- `toFanzaAffiliateUrl(productUrl)`
- FANZAブックスの許可ホスト検証
- プレーンURLから商品識別子を抽出する関数
- 無効URLに対するテスト
- この文書の入力例が指定の出力例と一致するテスト

### 3. コンテンツスキーマ

`src/content.config.ts` に次を追加する。

```ts
fanza_product_id: z.string().optional(),
fanza_url: z.string().url().optional(),
fanza_meta: z
	.object({
		title: z.string(),
		maker: z.string().optional(),
		price: z.number().optional(),
		intro: z.string().optional(),
		genres: z.array(z.string()).optional(),
		thumb_url: z.string().url().optional(),
	})
	.optional(),
```

`fanza_url` があるのに `fanza_meta.title` がない状態を許可する場合は、カードをリンクのみの表示へフォールバックさせる。

### 4. FANZA作品カード

既存の `DanbooruTrend.astro` を拡張するか、作品カードを別コンポーネントへ分割する。

- `fanza_meta` があればタイトル・作者等を表示
- クリック先は必ず `toFanzaAffiliateUrl(fanza_url)`
- `rel="noopener nofollow sponsored"`
- サムネ取得失敗時もレイアウトを壊さない
- FANZAとDLsiteを同時指定した記事は原則エラーまたは警告にする

### 5. 記事レイアウトからpropsを渡す

記事のフロントマターからトレンドパネルへ次を渡す。

- `fanzaProductId`
- `fanzaUrl`
- `fanzaMeta`

### 6. README更新

- サイトの特徴・主な機能にFANZAを追加
- プロジェクト構成と記事追加方法から本手順書へリンク
- フロントマター一覧へ `fanza_*` を追加
- `src/consts.ts` の説明へFANZAアフィリエイトIDを追加

---

## 作業チェックリスト

1. [ ] FANZA基盤実装が利用できる
2. [ ] 商品URLが対応サービスのプレーンURLである
3. [ ] 商品URLから商品識別子を抽出した
4. [ ] 正式タイトルなど、取得できないメタ情報をユーザーへ確認した
5. [ ] スラッグを `fanza-...` で決定した
6. [ ] `category` を決定し、未登録なら `CATEGORIES` とenumへ追加した
7. [ ] 未成年を示唆する作品・タグ・描写がないことを確認した
8. [ ] `index.mdx` を作成し、本文をCharacterSpeechだけにした
9. [ ] `prompt` / `models` / `danbooru_tags` / `tags` / `fanza_*` を埋めた
10. [ ] 画像があれば `images/` に配置した。未着なら `images` を省略した
11. [ ] アフィリエイトURLが期待値どおり生成されることを確認した
12. [ ] 外部リンクに `noopener nofollow sponsored` が付いている
13. [ ] 表示順が **画像 → 生呪文 → キータグ → モデル → FANZA** である
14. [ ] `npm run build` または `npx astro check` が成功する
15. [ ] `/categories`・`/models`・`/tags` の各索引に反映される

---

## 画像が後から来る場合

1. MDXだけ先に作り、`images` キーを省略する
2. 画像が来たら記事フォルダの `images/` に置く
3. `<slug>N.webp`（N=1..4）を推奨名とする
4. フロントマターへ `images` を追加する
5. 本番で画像URLが `/_astro/...` になっていることを確認する

---

## やってはいけないこと

- 記事ごとにアフィリエイトIDを直書きする
- `fanza_url` に完成済みの `al.fanza.co.jp` URLを保存する
- `lurl` を二重にURLエンコードする
- 許可していない外部ドメインを `lurl` に通す
- FANZA商品ページのログイン・年齢確認を自動回避する
- 取得できない作品名・価格・ランキングを推測する
- 規約確認なしに商品画像を転載する
- 本文へ生呪文・FANZAカード情報を重複して書く
- `danbooru_tags` にフルプロンプトを入れる
- 未登録のカテゴリを使う
- 画像未着時にプレースホルダー画像を作る
- 未成年・児童を連想させる性的コンテンツを記事化する
- `.wrangler/` やシークレットをGitへコミットする

---

## 完了時の報告（AI → ユーザー）

- 作成パスと想定URL
- FANZAのプレーン商品URLと生成されたアフィリエイトURL
- 使用した `fanza_product_id`
- `fanza_meta` の取得元と、省略した項目
- 追加したカテゴリ
- `models.name` / `trigger` の有無
- 画像の有無
- タグを置換した場合はその一覧
- ビルド・型チェック・リンク変換テストの結果
