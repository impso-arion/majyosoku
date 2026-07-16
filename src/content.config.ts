import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// 記事は src/content/blog/<slug>/index.md（画像も同フォルダに同居）
	loader: glob({ base: './src/content/blog', pattern: '**/index.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			// まとめ風メタ情報
			category: z.enum(['ai', 'payment', 'tech', 'column']).optional(),
			tags: z.array(z.string()).optional(),
		}),
});

export const collections = { blog };
