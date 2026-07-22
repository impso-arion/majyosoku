/** DLsite 内部 product.json（非公式）から作品メタを取る。ビルド時専用。 */

import { DLSITE_AFFILIATE_ID } from '../consts';

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

/** 作品 URL からフロア（aix / maniax 等）を拾う */
export function extractDlsiteSite(url?: string): string | undefined {
	if (!url) return undefined;
	const m = url.match(/dlsite\.com\/([a-z0-9_-]+)\//i);
	const site = m?.[1]?.toLowerCase();
	if (!site || site === 'www' || site === 'img') return undefined;
	return site;
}

/** 作品 URL / パスから product_id（RJ…）を拾う */
export function extractDlsiteWorkno(url?: string): string | undefined {
	if (!url) return undefined;
	const m =
		url.match(/product_id\/([A-Z]{2}\d+)/i) ??
		url.match(/\/id\/([A-Z]{2}\d+)/i) ??
		url.match(/\b([A-Z]{2}\d{6,})\b/i);
	return m?.[1]?.toUpperCase();
}

/**
 * アフィリエイト付き作品 URL。
 * 形式: https://www.dlsite.com/{site}/dlaf/=/t/s/link/work/aid/{aid}/id/{RJ}.html
 */
export function affiliateWorkUrl(workno: string, siteId?: string): string {
	const id = workno.trim().toUpperCase();
	const site = siteId && /^[a-z0-9_-]+$/i.test(siteId) ? siteId.toLowerCase() : 'maniax';
	return `https://www.dlsite.com/${site}/dlaf/=/t/s/link/work/aid/${DLSITE_AFFILIATE_ID}/id/${id}.html`;
}

/**
 * プレーンな作品 URL や RJ 番号をアフィリンクへ正規化。
 * 解析できない場合は元の文字列を返す。
 */
export function toDlsiteAffiliateUrl(
	worknoOrUrl: string,
	siteHint?: string,
): string {
	const workno =
		extractDlsiteWorkno(worknoOrUrl) ??
		(/^[A-Z]{2}\d+$/i.test(worknoOrUrl.trim())
			? worknoOrUrl.trim().toUpperCase()
			: undefined);
	if (!workno) return worknoOrUrl;

	const site =
		siteHint ??
		extractDlsiteSite(worknoOrUrl) ??
		undefined;
	return affiliateWorkUrl(workno, site);
}

function workPageUrl(workno: string, siteId?: string, urlOverride?: string): string {
	const site =
		extractDlsiteSite(urlOverride) ??
		(siteId && /^[a-z0-9_-]+$/i.test(siteId) ? siteId : undefined);
	return affiliateWorkUrl(workno, site);
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
 * 失敗時は null（ビルドは止めない）。workUrl は常にアフィ付き。
 */
export async function fetchDlsiteWork(
	workno: string,
	urlOverride?: string,
): Promise<DlsiteWorkCard | null> {
	const id = workno.trim().toUpperCase();
	if (!/^RJ\d+$/i.test(id)) return null;

	const cacheKey = `${id}|${urlOverride ?? ''}|${DLSITE_AFFILIATE_ID}`;
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
