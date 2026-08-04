import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// 記事は src/content/blog/<slug>/index.md|mdx（画像も同フォルダに同居）
	loader: glob({ base: './src/content/blog', pattern: '**/index.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			category: z
				.enum([
					'greeting',
					'reddit',
					'shirt-lift',
					'shorts-pull',
					'twin-drills',
					'goblin',
					'japanese-armor',
					'idol',
					'bikini-armor',
					'outdoors',
					'competition-swimsuit',
					'garter-belt',
					'lactation',
					'micro-bikini',
					'vibrator',
				])
				.optional(),
			tags: z.array(z.string()).optional(),
			// サイドバー「人気記事」。true の記事だけ新着順で掲載（PV計測なし）
			featured: z.boolean().optional(),

			// DLsite トレンド逆引き記事用
			dlsite_id: z.string().optional(),
			dlsite_url: z.string().url().optional(),
			// RegionHiddenFilter 等で海外ビルド時 API が空 [] になる作品向け
			dlsite_meta: z
				.object({
					title: z.string(),
					maker: z.string().optional(),
					price: z.number().optional(),
					intro: z.string().optional(),
					genres: z.array(z.string()).optional(),
					thumb_url: z.string().url().optional(),
				})
				.optional(),
			// FANZA トレンド逆引き記事用（商品URLはアフィリエイト化前のURL）
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
			danbooru_tags: z.array(z.string()).optional(),
			// フルプロンプト（本文コピペ用。品質／トリガーは含めない）
			prompt: z.string().optional(),
			// 記事フォルダ内の相対パス（例: './images/rj01612853_01.png'）
			images: z.array(image()).optional(),
			// 生成モデル（Civitaiリンクは持たない。トリガー／条件の置き場）
			models: z
				.object({
					name: z.string(),
					trigger: z.string().optional(),
					notes: z.string().optional(),
				})
				.optional(),
		}),
});

export const collections = { blog };
