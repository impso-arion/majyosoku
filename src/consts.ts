// サイト全体で使う定数。ここを編集すると各ページに反映されます。

export const SITE_TITLE = 'へっぽこ魔女のHなAIグリモワール';
export const SITE_READING = 'へっぽこまじょのえっちなエーアイグリモワール';
export const SITE_SUBTITLE = '賀田野リナのHなAIグリモワール';
export const SITE_CATCH = 'AI画像生成 × エロ魔女';
export const SITE_DESCRIPTION =
	'AI画像生成×エロ魔女。Redditまとめ、Danbooruタグ解剖、Stable Diffusionモデル紹介、DLsiteトレンド逆引きまで。転生魔女・賀田野リナが、デジタル錬成で「1000の絶頂」を追うグリモワール。';

// 管理人（魔女）プロフィール — 詳細は doc/rinas_Personality.md
export const AUTHOR_NAME = '賀田野リナ';
export const AUTHOR_TITLE = '現代のAI術師 / 転生魔女';
export const AUTHOR_BIO =
	'前世は中世の魔女カタリナ。人々の性欲を解放し「1000の絶頂」に到達したが火刑に処された転生魔女。現世ではGPUを祭壇にComfyUIで至高の錬成を追う。口調はドライだけどエロスへの執念だけはブレない。30年純潔の聖者（読者）を誰より肯定するわ。';

// SNS（コメント欄の代わりに Bluesky へ誘導＝プランC）
export const BSKY_HANDLE = '@rinasgrimoire.bsky.social';
export const BSKY_URL = 'https://bsky.app/profile/rinasgrimoire.bsky.social';
export const BSKY_HASHTAG = '#へっぽこ魔女のHなAIグリモワール';

/** DLsite アフィリエイト ID（全作品リンクに自動付与） */
export const DLSITE_AFFILIATE_ID = 'rinasgrimoire';

/** FANZA アフィリエイト ID（全作品リンクに自動付与） */
export const FANZA_AFFILIATE_ID = 'rinasgrimoir-001';

// カテゴリー（日本語シチュの棚。新規シチュはここに1行足してから記事で使う）
export const CATEGORIES = [
	{ slug: 'greeting', label: 'ごあいさつ', emoji: '🌙' },
	{ slug: 'reddit', label: 'Redditまとめ', emoji: '👽' },
	{ slug: 'shirt-lift', label: 'シャツ捲り', emoji: '👕' },
	{ slug: 'shorts-pull', label: 'ショートパンツ捲り', emoji: '🩳' },
	{ slug: 'twin-drills', label: 'ドリルツイン', emoji: '🎀' },
	{ slug: 'goblin', label: 'ゴブリン', emoji: '👺' },
	{ slug: 'japanese-armor', label: '和鎧', emoji: '⚔️' },
	{ slug: 'idol', label: 'アイドル', emoji: '🎤' },
	{ slug: 'bikini-armor', label: 'ビキニアーマー', emoji: '👙' },
	{ slug: 'outdoors', label: '屋外', emoji: '🌳' },
	{ slug: 'competition-swimsuit', label: '競泳水着', emoji: '🏊' },
	{ slug: 'garter-belt', label: 'ガーターベルト', emoji: '🎀' },
	{ slug: 'lactation', label: '搾乳', emoji: '🍼' },
	{ slug: 'micro-bikini', label: 'マイクロビキニ', emoji: '👙' },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]['slug'];

// 年齢認証（localStorage）。同意済みならモーダルを出さない。
export const AGE_GATE_STORAGE_KEY = 'majyosoku_age_verified';
export const AGE_GATE_STORAGE_VALUE = '1';

/** ヘッドラインに出す解剖済み作品数（DLsite / FANZA記事から新着順） */
export const HEADLINE_LIMIT = 5;

/** サイドバー「人気記事」に出す featured 記事の上限 */
export const FEATURED_LIMIT = 5;

/** トップページ・メインカラムの1ページあたり記事数 */
export const LATEST_MAIN_PER_PAGE = 10;

/** サイドバー「最新記事」の表示件数 */
export const LATEST_SIDEBAR_LIMIT = 7;
