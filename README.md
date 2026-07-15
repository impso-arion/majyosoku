# 魔女速報（まじょそくほう） / 賀田野リナの魔女速報

**AIトレンド × エロ魔女**をテーマにしたまとめ風アフィリエイトブログです。  
かつて流行した「暇人速報」系まとめブログのレイアウトをオマージュした2カラム構成で、画像生成AIの規制動向やクレカ決済規制の抜け道などを、へっぽこ魔女「賀田野リナ」の口調でお届けします。

将来的には Cloudflare Pages / Functions 経由で外部 Web API（FANZA API など）と連携する予定です。

## サイトの特徴

- 暇人速報オマージュの2カラム（メイン＋サイドバー）レイアウト
- ダークマジカルな配色（魔女パープル × ホットピンク）
- カテゴリー：AI画像生成 / 決済・クレカ規制 / 魔女の技術メモ / 今夜の黒ミサ
- **コメント欄なし**（プランC）：感想は 𝕏 の `#魔女速報` タグでリプ誘導
- 記事末尾・サイドバーに X 誘導コンポーネントを配置

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
- SEO（canonical URL・OGP）
- サイトマップ（`@astrojs/sitemap`）
- RSS フィード（`/rss.xml`）
- Cloudflare 向けビルド設定済み

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
├── public/                  # ファビコンなどの静的ファイル
├── src/
│   ├── components/          # Header / Footer / Sidebar / XReply 等
│   ├── content/
│   │   └── blog/            # ★ ブログ記事（Markdown / MDX）
│   ├── layouts/             # ページレイアウト（BlogPost）
│   ├── pages/               # ルーティング（トップ・記事一覧・About 等）
│   ├── styles/              # グローバル CSS（まとめ風テーマ）
│   ├── consts.ts            # サイト名・管理人情報・X・カテゴリ定義
│   └── content.config.ts    # 記事のフロントマタースキーマ
├── astro.config.mjs         # Astro + Cloudflare 設定
├── wrangler.jsonc           # Cloudflare デプロイ設定
└── package.json
```

## 記事の追加方法

`src/content/blog/` に `.md` または `.mdx` ファイルを追加します。

```markdown
---
title: '記事タイトル'
description: '記事の概要（一覧・OGP用）'
pubDate: '2026-07-15'
category: 'ai'
tags: ['画像生成AI', '規制']
---

ここから本文を書きます。

<div class="rina-say">
リナちゃんのセリフはこのボックスで表示されるわ。
</div>
```

### フロントマター

| フィールド | 必須 | 説明 |
|-----------|------|------|
| `title` | ✅ | 記事タイトル |
| `description` | ✅ | 記事の概要 |
| `pubDate` | ✅ | 公開日 |
| `updatedDate` | 任意 | 更新日 |
| `category` | 任意 | `ai` / `payment` / `tech` / `column` のいずれか |
| `tags` | 任意 | タグの配列（例: `['画像生成AI', '規制']`） |
| `heroImage` | 任意 | アイキャッチ画像（`src/assets/` に画像を置いて指定） |

> メモ: 本文の `.md` 内では `import` は使えません。リナちゃんのセリフは `<div class="rina-say">…</div>` の生 HTML で書いてください。

保存すると開発サーバーが自動でリロードされ、記事が反映されます。

## サイト情報の編集

| ファイル | 編集内容 |
|---------|---------|
| `src/consts.ts` | サイト名・管理人プロフィール・X アカウント・カテゴリ |
| `astro.config.mjs` の `site` | 本番ドメイン（現在は `https://example.com`） |
| `src/pages/index.astro` | トップページ（新着記事一覧） |
| `src/pages/about.astro` | 運営者情報・プロフィール |
| `src/components/Header.astro` | ロゴ・カテゴリナビ |
| `src/components/Sidebar.astro` | プロフィール・ランキング・カテゴリ・X・アーカイブ・PR枠 |
| `src/components/XReply.astro` | コメント欄代替の X 誘導ブロック |

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

## 今後の予定

- [ ] プライバシーポリシー・運営者情報ページの整備
- [ ] 本番ドメインの設定（`astro.config.mjs` の `site`）
- [ ] Cloudflare Pages へのデプロイ
- [ ] Cloudflare Functions（Node.js）で外部 Web API 連携

## 参考リンク

- [Astro ドキュメント](https://docs.astro.build/ja/)
- [Astro Content Collections](https://docs.astro.build/ja/guides/content-collections/)
- [Cloudflare Pages × Astro](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)

## クレジット

このテーマは [Bear Blog](https://github.com/HermanMartinus/bearblog/) をベースにした Astro 公式 Blog テンプレートです。
