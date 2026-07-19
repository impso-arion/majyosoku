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

// SNS（コメント欄の代わりにXへ誘導＝プランC）
export const X_HANDLE = '@majo_sokuho';
export const X_URL = 'https://x.com/majo_sokuho';
export const X_HASHTAG = '#へっぽこ魔女のHなAIグリモワール';

// カテゴリー（まとめ風のナビ・サイドバーで使用）
export const CATEGORIES = [
	{ slug: 'ai', label: 'AI画像生成', emoji: '🪄' },
	{ slug: 'tech', label: '魔女の技術メモ', emoji: '🔮' },
	{ slug: 'column', label: '今夜の黒ミサ', emoji: '🌙' },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]['slug'];

// 年齢認証（localStorage）。同意済みならモーダルを出さない。
export const AGE_GATE_STORAGE_KEY = 'majyosoku_age_verified';
export const AGE_GATE_STORAGE_VALUE = '1';

// 売れ筋ランキング（ヘッドライン用のアフィリエイト枠プレースホルダー）
// url をアフィリエイトリンクに、title/note を実商品に差し替えて使うわ。
export const BESTSELLERS = [
	{
		rank: 1,
		title: '【PR枠①】ここに売れ筋の供物を捧げなさい',
		note: 'FANZA / DLsite などのアフィリンクを差し込むわ',
		url: '#',
	},
	{
		rank: 2,
		title: '【PR枠②】今夜の黒ミサおすすめ作品',
		note: 'バナーorテキストリンクをここに',
		url: '#',
	},
	{
		rank: 3,
		title: '【PR枠③】限界突破の同人・電子書籍',
		note: '売上ランキング3位の供物',
		url: '#',
	},
	{
		rank: 4,
		title: '【PR枠④】魔女おすすめのAIツール',
		note: 'サブスク系アフィもここへ',
		url: '#',
	},
	{
		rank: 5,
		title: '【PR枠⑤】魔女おすすめの生成ツール',
		note: 'モデル配布・生成サービスなど',
		url: '#',
	},
] as const;
