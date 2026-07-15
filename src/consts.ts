// サイト全体で使う定数。ここを編集すると各ページに反映されます。

export const SITE_TITLE = '魔女速報';
export const SITE_READING = 'まじょそくほう';
export const SITE_SUBTITLE = '賀田野リナの魔女速報';
export const SITE_CATCH = 'AIトレンド × エロ魔女';
export const SITE_DESCRIPTION =
	'AIトレンド×エロ魔女。画像生成AIの規制パトロールから、クレカ決済包囲網（VISA/Mastercard規制）の突破法まで。へっぽこ魔女・賀田野リナが今夜の黒ミサ用に発信するまとめサイト。';

// 管理人（魔女）プロフィール
export const AUTHOR_NAME = '賀田野リナ';
export const AUTHOR_TITLE = 'へっぽこ見習い魔女 / 当サイト管理人';
export const AUTHOR_BIO =
	'AIトレンドとエロの結界を彷徨うへっぽこ魔女。画像生成AIの検閲網（グレートファイアウォール）をすり抜ける裏プロンプトと、クレカ大魔王の封印を破る決済の抜け道を研究中。今夜も黒ミサのために記事を焚べるわ。';

// SNS（コメント欄の代わりにXへ誘導＝プランC）
export const X_HANDLE = '@majo_sokuho';
export const X_URL = 'https://x.com/majo_sokuho';
export const X_HASHTAG = '#魔女速報';

// カテゴリー（まとめ風のナビ・サイドバーで使用）
export const CATEGORIES = [
	{ slug: 'ai', label: 'AI画像生成', emoji: '🪄' },
	{ slug: 'payment', label: '決済・クレカ規制', emoji: '💳' },
	{ slug: 'tech', label: '魔女の技術メモ', emoji: '🔮' },
	{ slug: 'column', label: '今夜の黒ミサ', emoji: '🌙' },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]['slug'];

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
		title: '【PR枠⑤】決済の抜け道グッズ',
		note: 'プリペイド・ギフト系など',
		url: '#',
	},
] as const;
