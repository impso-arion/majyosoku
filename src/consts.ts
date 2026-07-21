// サイト全体で使う定数。ここを編集すると各ページに反映されます。

export const SITE_TITLE = 'へっぽこ魔女のHなAIグリモワール';
export const SITE_READING = 'へっぽこまじょのえっちなエーアイグリモワール';
export const SITE_SUBTITLE = '賀田野リナのHなAIグリモワール';
export const SITE_CATCH = 'AI画像生成 × エロ魔女';
export const SITE_DESCRIPTION =
	'AI画像生成×エロ魔女。Danbooruタグの解剖から、Stable Diffusionのモデル紹介、トレンド作品のプロンプト逆引きまで。へっぽこ魔女・賀田野リナが今夜の黒ミサ用に発信するまとめサイト。';

// 管理人（魔女）プロフィール
export const AUTHOR_NAME = '賀田野リナ';
export const AUTHOR_TITLE = 'へっぽこ見習い魔女 / 当サイト管理人';
export const AUTHOR_BIO =
	'AI画像生成とエロの結界を彷徨うへっぽこ魔女。Danbooruタグの組み合わせと、Stable Diffusionのモデル選びを研究中。今夜も黒ミサのために記事を焚べるわ。';

// SNS（コメント欄の代わりに Bluesky へ誘導＝プランC）
export const BSKY_HANDLE = '@rinasgrimoire.bsky.social';
export const BSKY_URL = 'https://bsky.app/profile/rinasgrimoire.bsky.social';
export const BSKY_HASHTAG = '#へっぽこ魔女のHなAIグリモワール';

// カテゴリー（日本語シチュの棚。新規シチュはここに1行足してから記事で使う）
export const CATEGORIES = [
	{ slug: 'greeting', label: 'ごあいさつ', emoji: '🌙' },
	{ slug: 'reddit', label: 'Redditまとめ', emoji: '👽' },
	{ slug: 'shirt-lift', label: 'シャツ捲り', emoji: '👕' },
	{ slug: 'twin-drills', label: 'ドリルツイン', emoji: '🎀' },
	{ slug: 'goblin', label: 'ゴブリン', emoji: '👺' },
	{ slug: 'japanese-armor', label: '和鎧', emoji: '⚔️' },
	{ slug: 'idol', label: 'アイドル', emoji: '🎤' },
	{ slug: 'bikini-armor', label: 'ビキニアーマー', emoji: '👙' },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]['slug'];

// 年齢認証（localStorage）。同意済みならモーダルを出さない。
export const AGE_GATE_STORAGE_KEY = 'majyosoku_age_verified';
export const AGE_GATE_STORAGE_VALUE = '1';

/** ヘッドラインに出す解剖済み DLsite 作品数（記事の dlsite_id から新着順） */
export const HEADLINE_LIMIT = 5;

/** サイドバー「人気記事」に出す featured 記事の上限 */
export const FEATURED_LIMIT = 5;
