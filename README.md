# へっぽこ魔女のHなAIグリモワール

**AIトレンド × エロ魔女**をテーマにしたまとめ風アフィリエイトブログです。  
かつて流行した「暇人速報」系まとめブログのレイアウトをオマージュした2カラム構成で、AI画像生成・Danbooruタグ・Stable Diffusionのモデル紹介などを、へっぽこ魔女「賀田野リナ」の口調でお届けします。

将来的には Cloudflare Pages / Functions 経由で外部 Web API（FANZA API など）と連携する予定です。

## サイトの特徴

- 暇人速報オマージュの2カラム（メイン＋サイドバー）レイアウト
- ダークマジカルな配色（魔女パープル × ホットピンク）
- **カテゴリ**＝日本語シチュの棚／**タグ**＝Danbooru英語＋メタ検索／**モデル検索**＝生成モデル横断
- DLsite トレンド逆引き記事（プロンプト解剖＋アフィカード＋錬成サンプル）
- **コメント欄なし**（プランC）：感想は 𝕏 の `#へっぽこ魔女のHなAIグリモワール` タグでリプ誘導

## 技術スタック

| 項目 | 内容 |
|------|------|
| フレームワーク | [Astro](https://astro.build/) 7 |
| テンプレート | Astro 公式 Blog template |
| 言語 | TypeScript |
| スタイル | プレーン CSS（テンプレート標準） |
| デプロイ先 | [Cloudflare Pages](https://pages.cloudflare.com/) |
| アダプター | `@astrojs/cloudflare` + Wrangler |

## 主な機能

- Markdown / MDX による記事投稿
- カテゴリ・タグ・モデル名での横断検索
- DLsite トレンド逆引きパネル（画像 → 生呪文 → キータグ → モデル → アフィ）
- SEO（canonical URL・OGP）／サイトマップ／RSS（`/rss.xml`）
- Cloudflare 向けビルド設定済み

## 探し方（カテゴリ・タグ・モデル）

入口が3つある。役割を混ぜない。

| 入口 | URL | 何で絞るか | データ元 |
|------|-----|------------|----------|
| カテゴリ検索 | `/categories`・`/categories/<slug>/`・サイドバー | 日本語シチュ（シャツ捲り・ゴブリン…）＋ごあいさつ | 記事の `category`（定義は `src/consts.ts`） |
| モデル検索 | `/models`・`/models/<name>/` | 使った生成モデル名 | 記事の `models.name` |
| タグ検索 | `/tags`・`/tags/<tag>/` | Danbooru英語タグ＋メタ（`DLsite`, `WD14` など） | 記事の `tags` |

ナビ上の順は **カテゴリ検索 → モデル検索 → タグ検索**（サイドバーも同様）。  
記事パネル内の `danbooru_tags` は「その記事の代表タグ表示」用で、サイト横断のタグ索引とは別。

新規シチュカテゴリを足すときは:

1. `src/consts.ts` の `CATEGORIES` に `{ slug, label, emoji }` を追加
2. `src/content.config.ts` の `category` enum にも同じ slug を追加
3. 記事フロントマターで `category: '<slug>'` を指定
## 必要環境

- **Node.js** 22.12.0 以上（`package.json` の `engines` に準拠）
- **npm** 11 以上

```powershell
node --version
npm --version
```

## セットアップ

リポジトリをクローンしたあと、依存関係をインストールします。

```powershell
cd C:\Users\user\Documents\GitHub\majyosoku
npm install
```

## ローカル起動

```powershell
npm run dev
```

ブラウザで **http://localhost:4321/** を開いて確認します。

停止するときは、開発サーバーを起動したターミナルで `Ctrl + C` を押します。  
別ターミナルから停止する場合:

```powershell
npx astro dev stop
```

### PowerShell で `npm` が動かない場合

実行ポリシーの制限でエラーになることがあります。次のいずれかを試してください。

```powershell
# 方法1: .cmd 経由で実行
npm.cmd run dev

# 方法2: 実行ポリシーを緩和（現在のユーザーにのみ適用）
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

## コマンド一覧

| コマンド | 説明 |
|---------|------|
| `npm install` | 依存関係のインストール |
| `npm run dev` | 開発サーバー起動（`localhost:4321`） |
| `npm run build` | 本番ビルド（`./dist/` に出力） |
| `npm run preview` | ビルド結果のローカル確認 |
| `npm run generate-types` | Wrangler の型定義を生成 |
| `npx astro check` | TypeScript / Astro の型チェック |

## プロジェクト構成

```text
├── public/                     # favicon など URL 固定の静的ファイル
├── doc/
│   ├── assets.md               # 画像・部品の置き場所
│   └── dlsite-affiliate-page.md # ★ DLsite トレンド逆引き記事の手順書
├── src/
│   ├── assets/
│   │   ├── brand/              # icon.webp / chara.webp / footer.webp
│   │   └── common/
│   ├── components/             # Header / Sidebar / DanbooruTrend 等
│   ├── content/blog/<slug>/    # 記事（index.md|mdx + images/）
│   ├── pages/
│   │   ├── blog/               # 一覧・個別
│   │   ├── tags/               # タグ検索
│   │   └── models/             # モデル検索
│   ├── consts.ts               # サイト定数・CATEGORIES
│   └── content.config.ts       # フロントマター schema
├── astro.config.mjs
└── package.json
```

- 画像の置き分け: [`doc/assets.md`](doc/assets.md)
- DLsite 逆引き記事の作り方（詳細）: [`doc/dlsite-affiliate-page.md`](doc/dlsite-affiliate-page.md)

## 記事の追加方法

### 普通の記事（コラムなど）

1. `src/content/blog/<スラッグ>/` を作る
2. `index.md` または `index.mdx` を置く
3. 画像は同フォルダまたは `images/` へ

```markdown
---
title: '記事タイトル'
description: '記事の概要（一覧・OGP用）'
pubDate: '2026-07-15'
category: 'greeting'
tags: ['ごあいさつ', 'へっぽこ魔女']
---

本文…
```

`.md` では `import` 不可。リナのセリフは `<div class="rina-say">…</div>`。  
MDX なら `CharacterSpeech` コンポーネントも使える。

### DLsite トレンド逆引き記事（メインの量産型）

手順・テンプレ・禁止事項の正本は **[`doc/dlsite-affiliate-page.md`](doc/dlsite-affiliate-page.md)**。要約だけ書くと:

1. スラッグ `dlsite-<テーマ英語>`、必要ならカテゴリを consts + enum に追加
2. `index.mdx` の本文は **CharacterSpeech のみ**
3. フロントマターに `prompt` / `danbooru_tags` / `models` / `dlsite_*` /（あれば）`images` を入れる
4. パネル表示順は **画像 → 生呪文 → キータグ → モデル → DLsite**
5. 画像未着時は `images` 省略。プレースホルダー画像は作らず、報告に追加用 YAML を出す

### フロントマター一覧

| フィールド | 必須 | 説明 |
|-----------|------|------|
| `title` | ✅ | 記事タイトル |
| `description` | ✅ | 記事の概要 |
| `pubDate` | ✅ | 公開日 |
| `updatedDate` | 任意 | 更新日 |
| `category` | 任意 | 日本語シチュ slug（`CATEGORIES`）。例: `idol` / `greeting` |
| `featured` | 任意 | `true` でサイドバー「人気記事」に掲載（新着順・上限あり） |
| `tags` | 任意 | `/tags` 用。Danbooru英語＋メタ |
| `heroImage` | 任意 | アイキャッチ（相対パス） |
| `dlsite_id` / `dlsite_url` | 任意 | DLsite 元ネタ → アフィカード |
| `danbooru_tags` | 任意 | パネル用キータグ（代表のみ） |
| `prompt` | 任意 | フルプロンプト → パネル「生呪文」 |
| `images` | 任意 | 錬成サンプル → ギャラリー |
| `models` | 任意 | `{ name, trigger?, notes? }` → パネル＋`/models` |

### 画像の置き場所（要約）

| 種類 | 場所 |
|------|------|
| その記事だけの画像 | `src/content/blog/<slug>/images/` |
| サイト共通ブランド | `src/assets/brand/`（`icon.webp` / `chara.webp` / `footer.webp`） |
| favicon 等 | `public/` |

保存すると開発サーバーが自動リロードする。ブランド画像を差し替えたあとに古い絵のままなら、dev 再起動とハードリロードを試す（詳細はトラブルシューティング）。
## サイト情報の編集

| ファイル | 編集内容 |
|---------|---------|
| `src/consts.ts` | サイト名・管理人・X・**CATEGORIES**・ヘッドライン／人気記事の件数上限 |
| `src/components/Headline.astro` | 解剖済み `dlsite_id` を product.json で埋めたトレンド枠 |
| `src/content.config.ts` | フロントマター schema（`category` enum など） |
| `astro.config.mjs` の `site` | 本番ドメイン（現在は `https://example.com`） |
| `src/pages/index.astro` | トップ（新着一覧） |
| `src/pages/about.astro` | 運営者情報 |
| `src/pages/categories/` / `tags/` / `models/` | カテゴリ・タグ・モデル検索ページ |
| `src/components/Header.astro` / `Sidebar.astro` | ナビ・サイドバー |
| `src/components/DanbooruTrend.astro` | トレンド逆引きパネル |
| `src/components/XReply.astro` | コメント欄代替の X 誘導 |

## Cloudflare へのデプロイ（予定）

本番デプロイ時の目安:

- **ビルドコマンド**: `npm run build`
- **出力ディレクトリ**: `dist`
- Git 連携で Cloudflare Pages にデプロイするか、`npx wrangler deploy` を使用

詳細は [Astro × Cloudflare 公式ガイド](https://docs.astro.build/ja/guides/deploy/cloudflare/) を参照してください。

## トラブルシューティング

### `deps_ssr/astro_compiler-runtime.js` が見つからない

Astro 7 + Cloudflare アダプターで `platformProxy` を有効にすると、ローカル開発時に発生することがあります。  
現在は `astro.config.mjs` で `platformProxy.enabled: false` に設定しています。

再発した場合はキャッシュを削除して再起動してください。

```powershell
npx astro dev stop
Remove-Item -Recurse -Force node_modules\.vite
npm run dev
```

### 開発サーバーが既に起動している

```powershell
npx astro dev stop
npm run dev
```

### ブランド画像（icon / chara / footer）を差し替えても画面が変わらない

コードが読むのは次の3ファイルだけ（`.png` や別名は反映されない）:

- `src/assets/brand/icon.webp`（ヘッダー）
- `src/assets/brand/chara.webp`（リナ）
- `src/assets/brand/footer.webp`（フッター）

差し替え後は **ファイルを閉じてから保存** → **dev 再起動** → **Ctrl+Shift+R**。  
ローカルでは `imageService: 'passthrough'` で元画像をそのまま出す設定にしてある。
## 今後の予定

- [ ] プライバシーポリシー・運営者情報ページの整備
- [ ] 本番ドメインの設定（`astro.config.mjs` の `site`）
- [ ] Cloudflare Pages へのデプロイ
- [ ] Cloudflare Functions（Node.js）で外部 Web API 連携

## 参考リンク

- サイト内ドキュメント: [`doc/dlsite-affiliate-page.md`](doc/dlsite-affiliate-page.md) / [`doc/assets.md`](doc/assets.md)
- [Astro ドキュメント](https://docs.astro.build/ja/)
- [Astro Content Collections](https://docs.astro.build/ja/guides/content-collections/)
- [Cloudflare Pages × Astro](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)

## クレジット

このテーマは [Bear Blog](https://github.com/HermanMartinus/bearblog/) をベースにした Astro 公式 Blog テンプレートです。
