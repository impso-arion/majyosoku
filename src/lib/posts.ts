import { getCollection } from 'astro:content';
import { CATEGORIES, FEATURED_LIMIT, type CategorySlug } from '../consts';

export type Post = Awaited<ReturnType<typeof getCollection<'blog'>>>[number];

/** 公開日の新しい順にソートした記事一覧 */
export async function getSortedPosts(): Promise<Post[]> {
	const posts = await getCollection('blog');
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** サイドバー「人気記事」用。featured: true のみ・新着順 */
export async function getFeaturedPosts(limit = FEATURED_LIMIT): Promise<Post[]> {
	const posts = await getSortedPosts();
	return posts.filter((post) => post.data.featured).slice(0, limit);
}

export type CategoryCount = {
	slug: CategorySlug;
	label: string;
	emoji: string;
	count: number;
};

/** 定義済みカテゴリ一覧＋記事件数（定義順） */
export async function getCategoryCounts(): Promise<CategoryCount[]> {
	const posts = await getCollection('blog');
	const map = new Map<string, number>();
	for (const post of posts) {
		const c = post.data.category;
		if (!c) continue;
		map.set(c, (map.get(c) ?? 0) + 1);
	}
	return CATEGORIES.map((c) => ({
		slug: c.slug,
		label: c.label,
		emoji: c.emoji,
		count: map.get(c.slug) ?? 0,
	}));
}

/** 指定カテゴリの記事一覧（新しい順） */
export async function getPostsByCategory(slug: CategorySlug): Promise<Post[]> {
	const posts = await getSortedPosts();
	return posts.filter((post) => post.data.category === slug);
}

export type TagCount = { tag: string; count: number };

/** 全タグを件数つき・件数降順（同数は名前昇順）で取得 */
export async function getTagCounts(): Promise<TagCount[]> {
	const posts = await getCollection('blog');
	const map = new Map<string, number>();
	for (const post of posts) {
		for (const tag of post.data.tags ?? []) {
			map.set(tag, (map.get(tag) ?? 0) + 1);
		}
	}
	return [...map.entries()]
		.map(([tag, count]) => ({ tag, count }))
		.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'ja'));
}

/** 指定タグを含む記事一覧（新しい順） */
export async function getPostsByTag(tag: string): Promise<Post[]> {
	const posts = await getSortedPosts();
	return posts.filter((post) => (post.data.tags ?? []).includes(tag));
}

export type ModelCount = { name: string; count: number };

/** 全モデル名を件数つき・件数降順（同数は名前昇順）で取得 */
export async function getModelCounts(): Promise<ModelCount[]> {
	const posts = await getCollection('blog');
	const map = new Map<string, number>();
	for (const post of posts) {
		const name = post.data.models?.name;
		if (!name) continue;
		map.set(name, (map.get(name) ?? 0) + 1);
	}
	return [...map.entries()]
		.map(([name, count]) => ({ name, count }))
		.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'ja'));
}

/** 指定モデル名の記事一覧（新しい順） */
export async function getPostsByModel(name: string): Promise<Post[]> {
	const posts = await getSortedPosts();
	return posts.filter((post) => post.data.models?.name === name);
}
