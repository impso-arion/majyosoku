import { FANZA_AFFILIATE_ID } from '../consts';

const FANZA_AFFILIATE_URL = 'https://al.fanza.co.jp/';
const DMM_ITEM_LIST_URL = 'https://api.dmm.com/affiliate/v3/ItemList';

export interface FanzaMetaFallback {
	title: string;
	maker?: string;
	price?: number;
	intro?: string;
	genres?: string[];
	thumb_url?: string;
}

interface DmmNamedItem {
	name?: string;
}

interface DmmItem {
	title?: string;
	prices?: {
		price?: string;
	};
	imageURL?: {
		large?: string;
		list?: string;
	};
	iteminfo?: {
		maker?: DmmNamedItem[] | DmmNamedItem;
		genre?: DmmNamedItem[] | DmmNamedItem;
	};
}

interface DmmItemListResponse {
	result?: {
		status?: number | string;
		message?: string;
		items?: DmmItem[] | DmmItem;
	};
}

interface DmmQuery {
	service: string;
	floor: string;
	cid: string;
}

const metaCache = new Map<string, Promise<FanzaMetaFallback | null>>();
let warnedMissingApiId = false;

function isSupportedProductUrl(url: URL): boolean {
	if (
		url.protocol !== 'https:' ||
		url.username !== '' ||
		url.password !== '' ||
		url.port !== ''
	) {
		return false;
	}

	if (url.hostname === 'book.dmm.co.jp') {
		return /^\/product\/[^/]+\/[^/]+\/?$/.test(url.pathname);
	}

	if (url.hostname === 'dlsoft.dmm.co.jp') {
		return /^\/detail\/[^/]+\/?$/.test(url.pathname);
	}

	if (url.hostname === 'www.dmm.co.jp') {
		return /^\/rental\/-\/detail\/=\/cid=[^/]+\/?$/.test(url.pathname);
	}

	return false;
}

/** 対応するFANZA商品URLを検証し、正規化したプレーンURLを返す。 */
export function normalizeFanzaProductUrl(productUrl: string): string {
	let url: URL;
	try {
		url = new URL(productUrl);
	} catch {
		throw new Error(`Invalid FANZA product URL: ${productUrl}`);
	}

	if (!isSupportedProductUrl(url)) {
		throw new Error(`Unsupported FANZA product URL: ${productUrl}`);
	}

	url.hash = '';
	return url.toString();
}

/** FANZAブックスまたはDVDレンタルの商品URLから商品識別子を抽出する。 */
export function extractFanzaProductId(productUrl: string): string {
	const url = new URL(normalizeFanzaProductUrl(productUrl));

	if (url.hostname === 'book.dmm.co.jp') {
		const segments = url.pathname.split('/').filter(Boolean);
		return segments.at(-1)!;
	}

	if (url.hostname === 'dlsoft.dmm.co.jp') {
		const segments = url.pathname.split('/').filter(Boolean);
		return segments.at(-1)!;
	}

	const match = url.pathname.match(/\/cid=([^/]+)\/?$/);
	if (!match) {
		throw new Error(`FANZA product ID not found: ${productUrl}`);
	}
	return decodeURIComponent(match[1]);
}

/** プレーン商品URLをFANZAアフィリエイトリンクへ変換する。 */
export function toFanzaAffiliateUrl(productUrl: string): string {
	const normalizedUrl = normalizeFanzaProductUrl(productUrl);
	const affiliateUrl = new URL(FANZA_AFFILIATE_URL);
	affiliateUrl.searchParams.set('lurl', normalizedUrl);
	affiliateUrl.searchParams.set('af_id', FANZA_AFFILIATE_ID);
	affiliateUrl.searchParams.set('ch', 'reward_ranking');
	affiliateUrl.searchParams.set('ch_id', 'link');
	return affiliateUrl.toString();
}

function asArray<T>(value?: T[] | T): T[] {
	if (!value) return [];
	return Array.isArray(value) ? value : [value];
}

function parsePrice(value?: string): number | undefined {
	if (!value) return undefined;
	const match = value.replaceAll(',', '').match(/\d+/);
	return match ? Number(match[0]) : undefined;
}

function normalizeDmmItem(item?: DmmItem): FanzaMetaFallback | null {
	if (!item?.title?.trim()) return null;

	const maker = asArray(item.iteminfo?.maker)
		.map((entry) => entry.name?.trim())
		.find(Boolean);
	const genres = asArray(item.iteminfo?.genre)
		.map((entry) => entry.name?.trim())
		.filter((name): name is string => Boolean(name));

	return {
		title: item.title.trim(),
		maker,
		price: parsePrice(item.prices?.price),
		genres,
		thumb_url: item.imageURL?.large ?? item.imageURL?.list,
	};
}

/**
 * レンタルCID（例: 4mimk271）から配信版content_id（mimk00271）を推定する。
 * DMM APIのレンタルフロアが現行FloorListに無いため、配信版を照会する。
 */
function rentalCidToDigitalCid(rentalCid: string): string | null {
	const match = rentalCid.match(/^4([a-z]+)(\d+)$/i);
	if (!match) return null;
	return `${match[1].toLowerCase()}${match[2].padStart(5, '0')}`;
}

function apiQueries(productUrl: string, productId: string): DmmQuery[] {
	const url = new URL(normalizeFanzaProductUrl(productUrl));

	if (url.hostname === 'www.dmm.co.jp') {
		const digitalCid = rentalCidToDigitalCid(productId);
		return digitalCid
			? [{ service: 'digital', floor: 'videoa', cid: digitalCid }]
			: [];
	}

	if (url.hostname === 'dlsoft.dmm.co.jp') {
		return [];
	}

	return ['comic', 'novel', 'photo'].map((floor) => ({
		service: 'ebook',
		floor,
		cid: productId,
	}));
}

async function requestDmmItem(
	apiId: string,
	apiAffiliateId: string,
	query: DmmQuery,
): Promise<FanzaMetaFallback | null> {
	const url = new URL(DMM_ITEM_LIST_URL);
	url.searchParams.set('api_id', apiId);
	url.searchParams.set('affiliate_id', apiAffiliateId);
	url.searchParams.set('site', 'FANZA');
	url.searchParams.set('service', query.service);
	url.searchParams.set('floor', query.floor);
	url.searchParams.set('cid', query.cid);
	url.searchParams.set('output', 'json');

	const response = await fetch(url, {
		headers: {
			Accept: 'application/json',
			'User-Agent':
				'majyosoku-build/1.0 (+https://rinasgrimoire.midnight-cruise.top)',
		},
		signal: AbortSignal.timeout(12_000),
	});
	const payload = (await response.json().catch(() => null)) as DmmItemListResponse | null;
	if (!response.ok) {
		throw new Error(
			payload?.result?.message || `HTTP ${response.status}`,
		);
	}

	const status = Number(payload?.result?.status ?? 0);
	if (status !== 200) {
		throw new Error(payload?.result?.message || `API status ${status}`);
	}

	return normalizeDmmItem(asArray(payload?.result?.items)[0]);
}

/**
 * DMM商品情報APIからカード用メタを取得する。失敗時はnullを返し、ビルドを止めない。
 * API IDはサーバー／ビルド時だけ参照し、ログへ出力しない。
 */
export async function fetchFanzaMeta(
	productUrl: string,
	productId?: string,
): Promise<FanzaMetaFallback | null> {
	const normalizedUrl = normalizeFanzaProductUrl(productUrl);
	const id = productId || extractFanzaProductId(normalizedUrl);
	const cacheKey = `${normalizedUrl}|${id}`;
	const cached = metaCache.get(cacheKey);
	if (cached) return cached;

	const request = (async () => {
		const apiId = import.meta.env.DMM_API_ID?.trim();
		const apiAffiliateId = import.meta.env.DMM_API_AFFILIATE_ID?.trim();
		if (!apiId || !apiAffiliateId) {
			if (!warnedMissingApiId) {
				console.warn(
					'[fanza] DMM_API_ID or DMM_API_AFFILIATE_ID is not configured; using fallback metadata',
				);
				warnedMissingApiId = true;
			}
			return null;
		}
		if (!/^.+-99\d$/.test(apiAffiliateId)) {
			console.warn(
				'[fanza] DMM_API_AFFILIATE_ID must end with -990 through -999; using fallback metadata',
			);
			return null;
		}

		const queries = apiQueries(normalizedUrl, id);
		for (const query of queries) {
			try {
				const meta = await requestDmmItem(apiId, apiAffiliateId, query);
				if (meta) return meta;
			} catch (error) {
				const message = error instanceof Error ? error.message : 'unknown error';
				console.warn(
					`[fanza] ${id}: ${query.service}/${query.floor} lookup failed (${message})`,
				);
			}
		}

		console.warn(`[fanza] ${id}: item not found`);
		return null;
	})();

	metaCache.set(cacheKey, request);
	return request;
}

/** APIを優先し、取得できない場合はフロントマターのfanza_metaを使う。 */
export async function resolveFanzaMeta(
	productUrl: string,
	productId?: string,
	fallback?: FanzaMetaFallback,
): Promise<FanzaMetaFallback | null> {
	const fetched = await fetchFanzaMeta(productUrl, productId);
	if (fetched) return fetched;
	if (fallback?.title?.trim()) return fallback;
	return null;
}
