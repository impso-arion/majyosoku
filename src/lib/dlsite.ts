/** DLsite 内部 product.json（非公式）から作品メタを取る。ビルド時専用。 */

export type DlsiteImage = {
	url?: string;
	width?: number;
	height?: number;
};

export type DlsiteGenre = {
	name?: string;
};

export type DlsiteProduct = {
	workno: string;
	work_name: string;
	maker_name?: string;
	site_id?: string;
	price?: number;
	price_without_tax?: number;
	intro_s?: string;
	image_main?: DlsiteImage;
	image_thum?: DlsiteImage;
	genres?: DlsiteGenre[];
};

export type DlsiteWorkCard = {
	workno: string;
	title: string;
	maker: string | null;
	price: number | null;
	intro: string | null;
	genres: string[];
	thumbUrl: string | null;
	workUrl: string;
};

const API =
	'https://www.dlsite.com/maniax/api/=/product.json?workno=';

const cache = new Map<string, DlsiteWorkCard | null>();

function absUrl(url?: string): string | null {
	if (!url) return null;
	if (url.startsWith('//')) return `https:${url}`;
	if (url.startsWith('http://') || url.startsWith('https://')) return url;
	return `https://img.dlsite.jp/${url.replace(/^\//, '')}`;
}

function workPageUrl(workno: string, siteId?: string, override?: string): string {
	if (override) return override;
	const site = siteId && /^[a-z]+$/i.test(siteId) ? siteId : 'maniax';
	return `https://www.dlsite.com/${site}/work/=/product_id/${workno}.html`;
}

function normalize(raw: unknown, workno: string, urlOverride?: string): DlsiteWorkCard | null {
	const item = Array.isArray(raw) ? raw[0] : raw;
	if (!item || typeof item !== 'object') return null;

	const p = item as DlsiteProduct;
	const id = (p.workno || workno).toUpperCase();
	if (!p.work_name) return null;

	const genres = (p.genres ?? [])
		.map((g) => g.name?.trim())
		.filter((n): n is string => Boolean(n));

	return {
		workno: id,
		title: p.work_name,
		maker: p.maker_name?.trim() || null,
		price: typeof p.price === 'number' ? p.price : null,
		intro: p.intro_s?.trim() || null,
		genres,
		thumbUrl: absUrl(p.image_main?.url) ?? absUrl(p.image_thum?.url),
		workUrl: workPageUrl(id, p.site_id, urlOverride),
	};
}

/**
 * 作品ID（例: RJ01612853）からカード用メタを取得。
 * 失敗時は null（ビルドは止めない）。
 */
export async function fetchDlsiteWork(
	workno: string,
	urlOverride?: string,
): Promise<DlsiteWorkCard | null> {
	const id = workno.trim().toUpperCase();
	if (!/^RJ\d+$/i.test(id)) return null;

	const cacheKey = `${id}|${urlOverride ?? ''}`;
	if (cache.has(cacheKey)) return cache.get(cacheKey) ?? null;

	try {
		const res = await fetch(`${API}${encodeURIComponent(id)}`, {
			headers: {
				Accept: 'application/json',
				'User-Agent':
					'majyosoku-build/1.0 (+https://rinasgrimoire.midnight-cruise.top)',
			},
			signal: AbortSignal.timeout(12_000),
		});
		if (!res.ok) {
			console.warn(`[dlsite] ${id}: HTTP ${res.status}`);
			cache.set(cacheKey, null);
			return null;
		}
		const card = normalize(await res.json(), id, urlOverride);
		if (!card) console.warn(`[dlsite] ${id}: empty / unexpected payload`);
		cache.set(cacheKey, card);
		return card;
	} catch (err) {
		console.warn(`[dlsite] ${id}: fetch failed`, err);
		cache.set(cacheKey, null);
		return null;
	}
}
