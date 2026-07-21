// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [mdx(), sitemap()],

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