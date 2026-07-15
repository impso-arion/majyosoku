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
    platformProxy: {
      // workerd ランタイムでの deps 最適化不具合を避けるため、
      // ローカル開発では無効化（本番デプロイ・API追加時に再有効化）
      enabled: false,
    },
  }),
});