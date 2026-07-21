# Redditまとめ記事（暇人速報風）作成ルール

AI が新規 Redditまとめページを作るときに読む手順書。  
参考実装: [`src/content/blog/reddit-character-consistency/`](../src/content/blog/reddit-character-consistency/)

関連: [`doc/assets.md`](assets.md)、[`doc/dlsite-affiliate-page.md`](dlsite-affiliate-page.md)、[`README.md`](../README.md)

レイアウトの参考サイト: [暇人＼(^o^)／速報](http://himasoku.com/)

---

## この記事タイプで何が起きるか

1. ユーザーが Reddit スレ（URL・本文・コメント要約など）を渡す
2. AI が `src/content/blog/reddit-<テーマ>/index.mdx` を用意する
3. 本文は **暇速風のフラットなレス流し（`MatomeRes`）＋末尾の CharacterSpeech（リナの締め）**
4. 原文の丸写しはしない。**構造・論点レベルで会話調に焼き直す**

**画面上の表示順**

```text
matome-lead（導入・1〜2文）
  → matome-thread（MatomeRes × N）
  → hr
  → CharacterSpeech（リナの締め）
```

---

## レイアウト方針（暇速寄せ）

- **レスごとにカード（枠・背景・角丸）を付けない。** スレ本文が続くフラット流し。
- メタ行は `番号: 名前  日時 ID:xxxx` の1行。
- 名前は緑、`>>n` は青寄り、OP の ID は下線（`op` prop）。
- 実装コンポーネント: [`src/components/MatomeRes.astro`](../src/components/MatomeRes.astro)
- 導入文クラス: `.matome-lead`（枠なし）。スレ入れ物: `.matome-thread`

---

## カテゴリ・タグ

| 層 | フロントマター | この記事タイプでの使い方 |
|----|----------------|-------------------------|
| **カテゴリ** | `category: 'reddit'` | 棚は基本 **Redditまとめ**。定義済み（`consts.ts` / `content.config.ts`） |
| **タグ** | `tags` | `Reddit` ＋話題キーワード（`ComfyUI`, `Flux2`, `Krea` など） |
| **モデル** | `models` | 通常は使わない（DLsite逆引き専用フィールド） |

新規の Reddit 以外の棚が必要なら、DLsite 手順書と同様に `CATEGORIES` + enum へ追加してから使う。

---

## 前提・制約

- サイトテーマは **AIトレンド × エロ魔女**。成人向けの話題は可。
- **未成年・児童を連想させる性的コンテンツは禁止。**
- **著作権**: Reddit 原文を長文コピーしない。論点・構造・実務ヒントに絞り、会話調に再構成する。
- 日時・ID は **演出用のフィクションでよい**（元スレの実 ID を転記する義務はない）。
- 元スレ URL を出す場合は導入かリナ締めに短く。必須ではない。
- コミットはユーザー指示があるまで行わない。

---

## 入力（ユーザーからもらうもの）

| 項目 | 例 | 必須 |
|------|-----|------|
| 元ネタ | Reddit URL、または本文＋コメントの要約／要点メモ | ✅ |
| テーマ要約 | 「キャラ一貫性ワークフロー」など | ✅（無ければ AI が提案） |
| スラッグ希望 | `reddit-character-consistency` | 任意 |
| 元スレ URL の掲載可否 | 出す／出さない | 任意（デフォルト出さない） |
| 強調したい論点 | 「三段構え」「sampler 調整」など | 任意 |

---

## フォルダ構成

```text
src/content/blog/<slug>/
└── index.mdx
```

- スラッグ＝URL パス。慣例は `reddit-<テーマ英語kebab>`（例: `reddit-character-consistency`）。
- 画像が無い記事が基本。入れる場合だけ `images/` を足し、相対パスで参照。

---

## フロントマター（必須パターン）

```yaml
---
title: '【Redditまとめ】<煽りor要約タイトル>'
description: '<1〜2文。一覧・OGP用。何のスレをどうまとめたか>'
pubDate: YYYY-MM-DD
featured: true                 # 任意。サイドバー「人気記事」
category: 'reddit'
tags:
  - Reddit
  - <話題キー1>                # 例: ComfyUI / Flux2 / Krea
  - <話題キー2>
  - 画像生成AI
---
```

| フィールド | 役割 |
|-----------|------|
| `title` | `【Redditまとめ】…` で始める |
| `category` | 原則 `reddit` |
| `tags` | `/tags` 用。必ず `Reddit` を含める |
| `dlsite_*` / `prompt` / `danbooru_tags` / `models` | **使わない**（逆引き記事専用） |

---

## 本文テンプレ（MDX）

```mdx
---
# …フロントマター…
---

import CharacterSpeech from '../../../components/CharacterSpeech.astro';
import MatomeRes from '../../../components/MatomeRes.astro';

<p class="matome-lead">
	海外板っぽいスレを拾ってきたわ。<strong>「<一文でテーマ>」</strong>問題。
	<補足を1文>。会話調に焼き直したから、ざっくり読みなさい。
</p>

<div class="matome-thread">

<MatomeRes n={1} name="名無しさん" id="OpId01" date="YYYY/MM/DD(曜) HH:MM:SS.xx" op>
	<p>スレ主の主張・手順の要約…</p>
</MatomeRes>

<MatomeRes n={2} name="名無しさん" id="ReplyA" date="YYYY/MM/DD(曜) HH:MM:SS.xx">
	<p>
		<span class="aa">&gt;&gt;1</span><br />
		返信…
	</p>
</MatomeRes>

<!-- 以降、論点ごとにレスを続ける。だいたい 8〜15 レスが読みやすい -->

</div>

<hr />

<CharacterSpeech character="rina">
	<p>まとめるとこうよ。</p>
	<p><strong>要点1。</strong> 解説…</p>
	<p>要点2。解説…</p>
	<p>締めの一言。</p>
</CharacterSpeech>
```

### `MatomeRes` の props

| prop | 必須 | 内容 |
|------|------|------|
| `n` | ✅ | レス番号 |
| `name` | 任意 | 省略時 `名無しさん` |
| `id` | 任意 | `ID:xxxx` 表示用（短めの英数） |
| `date` | 任意 | `2026/07/18(金) 21:04:12.33` 形式推奨 |
| `op` | 任意 | `true` で OP。ID に下線 |

アンカー参照は `<span class="aa">&gt;&gt;1</span>`（偽リンクにしない）。

---

## 本文の書き方ルール

1. **必ず MDX**（`MatomeRes` / `CharacterSpeech` を import するため）。
2. レスは **カードにしない**。`MatomeRes` を使い、`.matome-thread` で包む。
3. 会話の流れを作る: OP の主張 → 賛否・比較 → 実務Tips → まとめレス。
4. リナの締めは **実務エッセンスを 2〜4 段落**。スレの要約の焼き直し＋魔女口調。
5. タイトルは `【Redditまとめ】…`。必要なら `【悲報】` `【朗報】` 等の暇速語彙も可（やりすぎ注意）。
6. 技術名はそのまま残してよい（`Krea 2`, `Qwen image edit`, `Flux2 Klein` など）。長文の英語原文は載せない。

---

## レス構成の目安

| ブロック | レス数目安 | 役割 |
|----------|-----------|------|
| OP | 1 | 手順・主張の骨格 |
| 反応・比較 | 3〜6 | モデル比較、賛否、経験談 |
| 実務Tips | 2〜4 | パラメータ、併用、注意点 |
| ロードマップ／余談 | 0〜2 | 開発状況の噂など（あれば） |
| TL;DR レス | 1 | 読者が拾える一行まとめ |
| リナ締め | （別ブロック） | サイトの顔としての解説 |

全体で **だいたい 8〜15 レス**。冗長な相槌だけのレスは削る。

---

## 作業チェックリスト

1. [ ] 元ネタから論点を抽出し、原文コピーになっていないか確認
2. [ ] スラッグ決定（`reddit-...`）
3. [ ] `category: 'reddit'`、`tags` に `Reddit` ＋話題キー
4. [ ] `index.mdx` 作成（lead → thread → CharacterSpeech）
5. [ ] 各 `MatomeRes` に `n` / `date` / `id`。OP に `op`
6. [ ] `>>n` は `<span class="aa">`。カードスタイルを自前 CSS で足していない
7. [ ] リナ締めで実務エッセンスを述べている
8. [ ] 未成年示唆コンテンツが無いか確認
9. [ ] `/blog/<slug>/` と `/categories/reddit/` に出ること

---

## やってはいけないこと

- レスを枠付きカード／背景色付きボックスで並べる（暇速から離れる）
- Reddit 原文の長文コピペ
- `dlsite_*` / `prompt` / `danbooru_tags` / `models` をこの記事タイプに無理に入れる
- `.md` で `MatomeRes` を import する（MDX 必須）
- `>>n` を `href="#"` の偽リンクにする
- 未成年・児童を連想させる性的コンテンツを記事化する
- コミットをユーザー指示なしで行う

---

## 完了時の報告（AI → ユーザー）

- 作成パス（`src/content/blog/<slug>/`）と想定 URL（`/blog/<slug>/`）
- レス数と、拾った主な論点（3点程度）
- 元スレ URL を載せたかどうか
- 著作権上、焼き直しにした旨の一言
