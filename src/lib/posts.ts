import { getCollection } from 'astro:content';

export type Post = Awaited<ReturnType<typeof getCollection<'blog'>>>[number];

/** 公開日の新しい順にソートした記事一覧 */
export async function getSortedPosts(): Promise<Post[]> {
	const posts = await getCollection('blog');
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
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
