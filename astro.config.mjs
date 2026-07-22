// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // canonical / OGP / sitemap / robots.txt の基準 URL
  site: 'https://rinasgrimoire.midnight-cruise.top',
  // サイト内リンクと canonical を末尾スラッシュで揃える
  trailingSlash: 'always',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/rss.xml'),
      namespaces: {
        news: false,
        xhtml: false,
        video: false,
        // 記事ヒーロー等の画像メタを載せたい場合は true のまま
        image: true,
      },
    }),
  ],

  adapter: cloudflare({
    // static 出力では /_image ランタイムが動かないため、ビルド時に最適化する。
    // （passthrough / cloudflare-binding は Worker 上の /_image が必要）
    imageService: 'compile',
    platformProxy: {
      // workerd ランタイムでの deps 最適化不具合を避けるため、
      // ローカル開発では無効化（本番デプロイ・API追加時に再有効化）
      enabled: false,
    },
  }),
});