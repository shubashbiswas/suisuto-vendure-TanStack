/**
 * Authentic artisan product image mappings using local high-resolution assets in /products.
 * Serves as an instant, resilient image provider whenever a product has no Vendure asset preview
 * or when assets are not yet uploaded in a freshly initialized environment.
 */

const EXACT_SLUG_TO_IMAGE: Record<string, string> = {
	"dhakai-geometric-muslin-jamdani-saree": "/products/dhaka_muslin_jamdani_1788370602515.jpg",
	"nocturne-indigo-jamdani-khadi-kurta": "/products/mens_raw_silk_kurta_1788370624085.jpg",
	"royal-chanderi-gold-tissue-zari-saree": "/products/garad_silk_drape_1788370662906.jpg",
	"kolkata-artisanal-kantha-stitch-raw-silk-stole": "/products/kantha_trench_coat_1788370689253.jpg",
	"bengal-handloom-raw-mulberry-silk-sherwani": "/products/Panjabi-with-white-pajama-and-black-loafer-shoes.png",
	"dual-origin-handspun-linen-overcoat": "/products/collection-look.jpg",
	"tangail-heritage-silk-jamdani-scarf": "/products/tangail_silk_shirt_1788370710648.jpg",
	"varanasi-pure-katan-silk-brocade-dupatta": "/products/tussar_silk_stole_1788370751484.jpg",
	"baluchari-silk-robe": "/products/baluchari_silk_robe_1788370639217.jpg",
	"indigo-shibori-tunic": "/products/indigo_shibori_tunic_1788370731346.jpg",
	"khadi-panjabi-set": "/products/khadi_panjabi_set.png",
	"indigo-denim-trouser": "/products/indigo_denim_trouser.png",
	"womens-indigo-shirt-denim": "/products/Womens-shirt-reference-no-1-also-use-this-wide-leg-indigo-denim-pant.png",
};

const KEYWORD_IMAGE_FALLBACKS: Array<{ keywords: string[]; image: string }> = [
	{
		keywords: ["jamdani", "muslin", "saree", "sari"],
		image: "/products/dhaka_muslin_jamdani_1788370602515.jpg",
	},
	{
		keywords: ["sherwani", "panjabi", "punjabi"],
		image: "/products/Panjabi-with-white-pajama-and-black-loafer-shoes.png",
	},
	{
		keywords: ["kurta", "mens"],
		image: "/products/mens_raw_silk_kurta_1788370624085.jpg",
	},
	{
		keywords: ["chanderi", "katan", "brocade", "gold", "tissue", "garad"],
		image: "/products/garad_silk_drape_1788370662906.jpg",
	},
	{
		keywords: ["kantha", "coat", "overcoat", "jacket", "trench"],
		image: "/products/kantha_trench_coat_1788370689253.jpg",
	},
	{
		keywords: ["tangail", "shirt", "tunic"],
		image: "/products/tangail_silk_shirt_1788370710648.jpg",
	},
	{
		keywords: ["stole", "scarf", "dupatta", "tussar", "shawl"],
		image: "/products/tussar_silk_stole_1788370751484.jpg",
	},
	{
		keywords: ["denim", "trouser", "pant"],
		image: "/products/indigo_denim_trouser.png",
	},
	{
		keywords: ["robe", "baluchari"],
		image: "/products/baluchari_silk_robe_1788370639217.jpg",
	},
	{
		keywords: ["shibori"],
		image: "/products/indigo_shibori_tunic_1788370731346.jpg",
	},
];

export function getProductFallbackImage(slug?: string, name?: string): string {
	if (slug) {
		const cleanSlug = slug.toLowerCase().trim();
		if (EXACT_SLUG_TO_IMAGE[cleanSlug]) {
			return EXACT_SLUG_TO_IMAGE[cleanSlug];
		}
		for (const rule of KEYWORD_IMAGE_FALLBACKS) {
			if (rule.keywords.some((kw) => cleanSlug.includes(kw))) {
				return rule.image;
			}
		}
	}

	if (name) {
		const cleanName = name.toLowerCase().trim();
		for (const rule of KEYWORD_IMAGE_FALLBACKS) {
			if (rule.keywords.some((kw) => cleanName.includes(kw))) {
				return rule.image;
			}
		}
	}

	return "/products/collection-look.jpg";
}

export function getProductFallbackGallery(
	slug?: string,
	name?: string
): Array<{ id: string; preview: string }> {
	const primary = getProductFallbackImage(slug, name);
	const pool = [
		"/products/dhaka_muslin_jamdani_1788370602515.jpg",
		"/products/collection-jamdani.jpg",
		"/products/collection-mens.jpg",
		"/products/collection-look.jpg",
		"/products/kantha_trench_coat_1788370689253.jpg",
		"/products/tussar_silk_stole_1788370751484.jpg",
	].filter((img) => img !== primary);

	return [
		{ id: "fallback-primary", preview: primary },
		{ id: "fallback-secondary", preview: pool[0] },
		{ id: "fallback-tertiary", preview: pool[1] },
	];
}
