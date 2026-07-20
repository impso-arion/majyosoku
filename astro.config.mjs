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
    // ローカル /_image（cloudflare-binding）が古い変換結果を返しやすいので、
    // 元画像をそのまま出す。差し替えた brand 画像が即反映される。
    imageService: 'passthrough',
    platformProxy: {
      // workerd ランタイムでの deps 最適化不具合を避けるため、
      // ローカル開発では無効化（本番デプロイ・API追加時に再有効化）
      enabled: false,
    },
  }),
});