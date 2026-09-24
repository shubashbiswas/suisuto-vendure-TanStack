// Comprehensive royalty-free luxury fashion assets & datasets for all regional storefronts

export interface MarketCategoryItem {
	name: string;
	banglaName?: string;
	tagline: string;
	imageUrl: string;
	href: string;
	itemCount?: string;
}

export interface MarketBrandItem {
	name: string;
	tagline: string;
	desc: string;
	founded?: string;
	href: string;
	initials: string;
}

export interface MarketSlideItem {
	id: string;
	title: string;
	subtitle: string;
	tag: string;
	imageUrl: string;
	link: string;
	ctaText: string;
}

// ==========================================
// 🇧🇩 BANGLADESH STOREFRONT ASSETS
// ==========================================
export const BD_SLIDES: MarketSlideItem[] = [
	{
		id: "bd-slide-1",
		title: "Festive Grandeur: Royal Panjabi & Heritage Weaves",
		subtitle: "Meticulously woven with 300-count organic cotton and intricate jacquard motifs.",
		tag: "Eid Edition 2026",
		imageUrl: "https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/qaY9mGqiiyXMLzXv29tOCsPmcF3FWBAVfjByTF6n.png",
		link: "/shop?category=panjabi",
		ctaText: "Shop Festive Edit",
	},
	{
		id: "bd-slide-2",
		title: "Dhakai Muslin & Jamdani Sarees",
		subtitle: "Certified generational pit-loom craftsmanship direct from master artisan clusters.",
		tag: "Masterpiece Archive",
		imageUrl: "https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/nu1GJOaSFIuujkY7YqcVnHFVRpxdz4BEhLEKrEAd.jpg",
		link: "/shop?category=sarees",
		ctaText: "Explore Sarees",
	},
	{
		id: "bd-slide-3",
		title: "Modern Architectural Tailoring",
		subtitle: "Structured silhouettes, casual luxury shirts, and tailored trousers for the contemporary wardrobe.",
		tag: "Contemporary Atelier",
		imageUrl: "https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/tQ6PgmHxTEN4UPrO622pihs445CSrdHBCMERAta8.jpg",
		link: "/shop?category=shirts",
		ctaText: "Discover Tailoring",
	},
];

export const BD_CATEGORIES: MarketCategoryItem[] = [
	{
		name: "Men's Ethnic & Panjabi",
		banglaName: "পাঞ্জাবি ও এথনিক",
		tagline: "Royal Jacquard & Cotton",
		imageUrl: "https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/R4KUiGCjERrYo2b0TZaclu4BMxqqAEBr6rh0H99V.png",
		href: "/shop?category=panjabi",
		itemCount: "140+ Pieces",
	},
	{
		name: "Casual & Formal Shirts",
		banglaName: "শার্ট কালেকশন",
		tagline: "Solid, Printed & Checks",
		imageUrl: "https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/3oZi8w6S6IqWYMrVrFt5pTK9K8yYW9dX8okPo7Z6.jpg",
		href: "/shop?category=shirts",
		itemCount: "210+ Pieces",
	},
	{
		name: "Dhakai Jamdani & Sarees",
		banglaName: "জামদানি ও শাড়ি",
		tagline: "Generational Loom Weaves",
		imageUrl: "https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/Zz8bqMREyksoM6KdKTJuBF76AHrKEan329vW8gAr.jpg",
		href: "/shop?category=sarees",
		itemCount: "95+ Pieces",
	},
	{
		name: "Salwar Suits & Kameez",
		banglaName: "সালোয়ার কামিজ",
		tagline: "Embroidered Three-Piece",
		imageUrl: "https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/fEXys0NnBaBtlqkUkdYVmwZbKuY7dBas1WzEBzVw.png",
		href: "/shop?category=kameez",
		itemCount: "125+ Pieces",
	},
	{
		name: "Western Tops & Dresses",
		banglaName: "ওয়েস্টার্ন টপস",
		tagline: "Chic Minimalist Silhouettes",
		imageUrl: "https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/tbTcMmvYdEuw1swVk7xaK1lPhcojOKt2BdHp7PAy.webp",
		href: "/shop?category=western",
		itemCount: "80+ Pieces",
	},
	{
		name: "Junior & Newborn",
		banglaName: "জুনিয়র কালেকশন",
		tagline: "Boys, Girls & Baby Essentials",
		imageUrl: "https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/wAt3lYVaod6KaRkzZ4cyx4nw6FaE9OTF0hjO32uJ.jpg",
		href: "/shop?category=junior",
		itemCount: "160+ Pieces",
	},
	{
		name: "Accessories & Leather",
		banglaName: "এক্সেসরিজ ও জুতো",
		tagline: "Watches, Wallets & Belts",
		imageUrl: "https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/xbURkauHTx3Ots6NaHwn0GFaAWrl9apYj0eYaXzi.png",
		href: "/shop?category=accessories",
		itemCount: "110+ Pieces",
	},
	{
		name: "Beauty & Fragrances",
		banglaName: "বিউটি ও পারফিউম",
		tagline: "Artisan Attar & Skincare",
		imageUrl: "https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/S1WUIwQhPBSPnvfIolggIoQR3G4pDU4VuTN3f3Gx.jpg",
		href: "/shop?category=beauty",
		itemCount: "65+ Pieces",
	},
	{
		name: "Atelier Pro & Athleisure",
		banglaName: "অ্যাথলেইজার ও স্পোর্টস",
		tagline: "Performance Fabrics",
		imageUrl: "https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/FCJbFYZoazIOBQJZIe2PhsRE7f8SbQJhZS2hH8Ws.jpg",
		href: "/shop?category=activewear",
		itemCount: "75+ Pieces",
	},
];

export const BD_BRANDS: MarketBrandItem[] = [
	{
		name: "Suisuto Atelier",
		tagline: "Haute Couture Handloom",
		desc: "Bespoke architectural cuts crafted by generational master weavers.",
		founded: "Est. 2024",
		href: "/collections/atelier",
		initials: "SA",
	},
	{
		name: "Richman",
		tagline: "Distinguished Menswear",
		desc: "Executive shirts, formal trousers, tailored suits, and modern casuals.",
		founded: "Est. 2003",
		href: "/shop?brand=richman",
		initials: "RM",
	},
	{
		name: "Lubnan",
		tagline: "Celebration Ethnic Wear",
		desc: "Royal panjabis, festive sherwanis, and handcrafted ceremonial ensembles.",
		founded: "Est. 2003",
		href: "/shop?brand=lubnan",
		initials: "LB",
	},
	{
		name: "iNFINITY Mega Mall",
		tagline: "Family Lifestyle Destination",
		desc: "Complete multi-tier fashion and lifestyle collections for all generations.",
		founded: "Est. 2004",
		href: "/shop?brand=infinity",
		initials: "IF",
	},
	{
		name: "Tangail Muslin Guild",
		tagline: "Heritage Loom Revival",
		desc: "World-renowned superfine muslin weaves and heirloom cotton fabrics.",
		founded: "Loom Heritage",
		href: "/shop?brand=tangail",
		initials: "TM",
	},
	{
		name: "Bengal Khadi",
		tagline: "Organic Handspun Wefts",
		desc: "Pure breathable hand-spun cotton created through ethical cottage clusters.",
		founded: "Artisan Co-Op",
		href: "/shop?brand=khadi",
		initials: "BK",
	},
	{
		name: "Rajshahi Silks",
		tagline: "Sartorial Mulberry Luster",
		desc: "Opulent mulberry and endi silks renowned for lightweight shimmer.",
		founded: "Silk Heritage",
		href: "/shop?brand=rajshahi",
		initials: "RS",
	},
	{
		name: "Heritage Jamdani",
		tagline: "UNESCO Intangible Art",
		desc: "Serialized authentic Dhakai Jamdanis with hand-threaded gold zari.",
		founded: "Certified Origin",
		href: "/shop?brand=jamdani",
		initials: "HJ",
	},
	{
		name: "Suisuto Pro Urban",
		tagline: "Technical Performance",
		desc: "Engineered breathable athleisure and high-comfort daily commute wear.",
		founded: "Active Line",
		href: "/shop?brand=pro",
		initials: "SP",
	},
];

// ==========================================
// 🇮🇳 INDIA STOREFRONT ASSETS
// ==========================================
export const IN_SLIDES: MarketSlideItem[] = [
	{
		id: "in-slide-1",
		title: "Varanasi Pure Katan Silk Sarees · Real Zari Weaves",
		subtitle: "Hand-spun mulberry silk woven on multi-beam pit looms by Padmashri awardee master weavers.",
		tag: "Imperial Silk Archive",
		imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=85",
		link: "/in/shop?category=banarasi-sarees",
		ctaText: "Shop Banarasi Sarees",
	},
	{
		id: "in-slide-2",
		title: "Imperial Sherwanis & Royal Bandhgala Suiting",
		subtitle: "Bespoke ceremonial groom wear tailored with intricate zardozi, semi-precious stones, and hand-embroidered collars.",
		tag: "Ceremonial Royal Edit",
		imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1600&q=85",
		link: "/in/shop?category=sherwanis",
		ctaText: "Explore Sherwanis",
	},
	{
		id: "in-slide-3",
		title: "Bridal Lehenga Choli · Resham & Mukaish Heritage",
		subtitle: "Voluminous silhouettes handcrafted with pure silk dupion, vintage gotta patti, and hand-twisted metallic threads.",
		tag: "Bridal Couture 2026",
		imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1600&q=85",
		link: "/in/shop?category=lehengas",
		ctaText: "Discover Bridal Edit",
	},
];

export const IN_CATEGORIES: MarketCategoryItem[] = [
	{
		name: "Banarasi & Kanjivaram Sarees",
		banglaName: "वाराणसी एवं कांजीवरम साड़ियां",
		tagline: "Pure Katan Silk & Real Zari",
		imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
		href: "/in/shop?category=sarees",
		itemCount: "120+ Heirlooms",
	},
	{
		name: "Royal Groom Sherwanis",
		banglaName: "शाही शेरवानी एवं बंदगला",
		tagline: "Hand-Embroidered Zardozi",
		imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
		href: "/in/shop?category=sherwani",
		itemCount: "85+ Ensembles",
	},
	{
		name: "Bridal & Festive Lehengas",
		banglaName: "हैंडक्राफ्टेड ब्राइडल लहंगा",
		tagline: "Gotta Patti & Resham Work",
		imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
		href: "/in/shop?category=lehengas",
		itemCount: "75+ Creations",
	},
	{
		name: "Kurta Bundi & Nehru Sets",
		banglaName: "कुर्ता और नेहरु जैकेट",
		tagline: "Mulberry Silk & Breathable Linen",
		imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
		href: "/in/shop?category=kurta",
		itemCount: "110+ Sets",
	},
	{
		name: "Anarkali & Chanderi Suits",
		banglaName: "अनारकली एवं चंदेरी सूट",
		tagline: "Featherlight Tissue & Muslin",
		imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
		href: "/in/shop?category=anarkali",
		itemCount: "90+ Pieces",
	},
	{
		name: "Handloom Dupattas & Stoles",
		banglaName: "हैंडलूम दुपट्टा एवं शॉल",
		tagline: "Varanasi Brocades & Pashmina",
		imageUrl: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80",
		href: "/in/shop?category=dupattas",
		itemCount: "95+ Handweaves",
	},
	{
		name: "Sartorial Shirts & Suiting",
		banglaName: "फॉर्मल शर्ट्स एवं ट्राउजर्स",
		tagline: "Long-Staple Indian Cottons",
		imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
		href: "/in/shop?category=shirts",
		itemCount: "130+ Pieces",
	},
	{
		name: "Kundan, Polki & Temple Jewels",
		banglaName: "कुंदन एवं पोल्की ज्वेलरी",
		tagline: "Handcrafted Heritage Pieces",
		imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
		href: "/in/shop?category=jewellery",
		itemCount: "60+ Ornaments",
	},
	{
		name: "Artisan Mojaris & Leather",
		banglaName: "मोजरी एवं लेदर फुटवियर",
		tagline: "Hand-Stitched Embroidered Juttis",
		imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
		href: "/in/shop?category=footwear",
		itemCount: "50+ Pairs",
	},
];

export const IN_BRANDS: MarketBrandItem[] = [
	{
		name: "Suisuto Haute Couture",
		tagline: "Imperial Handloom Bespoke",
		desc: "Archival Indian textiles woven into contemporary high-fashion silhouettes.",
		founded: "New Delhi Atelier",
		href: "/in/collections/atelier",
		initials: "SH",
	},
	{
		name: "Varanasi Zari Guild",
		tagline: "Pure Katan Silk Brocades",
		desc: "Preserving authentic gold and silver electroplated zari pit-loom weaves.",
		founded: "Est. 1892",
		href: "/in/shop?brand=varanasi",
		initials: "VZ",
	},
	{
		name: "Chanderi Gossamer",
		tagline: "Featherlight Tissue Wefts",
		desc: "Heritage sheer silks crafted by royal weavers of Madhya Pradesh.",
		founded: "Loom Certified",
		href: "/in/shop?brand=chanderi",
		initials: "CG",
	},
	{
		name: "Lucknowi Chikankari",
		tagline: "Intricate Mukaish & Shadow",
		desc: "Delicate needlework embroideries on fine mulmul and organza.",
		founded: "Awadh Heritage",
		href: "/in/shop?brand=chikankari",
		initials: "LC",
	},
	{
		name: "Royal Rajghana",
		tagline: "Aristocratic Menswear",
		desc: "Tailored achkans, bandhgalas, and ceremonial turbans for weddings.",
		founded: "Est. 2010",
		href: "/in/shop?brand=rajghana",
		initials: "RR",
	},
	{
		name: "Kashmir Pashmina Weft",
		tagline: "GI-Tagged Pure Cashmere",
		desc: "Hand-spun Changthangi goat wool with Sozni artisan needlepoint.",
		founded: "Valley Guild",
		href: "/in/shop?brand=pashmina",
		initials: "KP",
	},
	{
		name: "Jaipur Bandhani",
		tagline: "Artisan Tie-Dye Luster",
		desc: "Intricate thousand-knot resist-dyed georgettes and pure silks.",
		founded: "Rajasthan Guild",
		href: "/in/shop?brand=bandhani",
		initials: "JB",
	},
	{
		name: "Bengal Jamdani Guild",
		tagline: "UNESCO Intangible Art",
		desc: "Authentic featherweight extra-weft muslins direct from loom clusters.",
		founded: "Master Cluster",
		href: "/in/shop?brand=jamdani",
		initials: "BJ",
	},
	{
		name: "Suisuto Wedding Concierge",
		tagline: "Private Trousseau Atelier",
		desc: "Full bespoke bridal styling and made-to-measure groom appointments.",
		founded: "Vasant Kunj Studio",
		href: "/in/shop?brand=bridal",
		initials: "SW",
	},
];

// ==========================================
// 🌍 GLOBAL / INTERNATIONAL STOREFRONT ASSETS
// ==========================================
export const GLOBAL_SLIDES: MarketSlideItem[] = [
	{
		id: "global-slide-1",
		title: "Architectural Raw Silks · Autumn / Winter Runway",
		subtitle: "Sculptural tailoring, unpadded shoulders, and fluid natural drape crafted for discerning collectors.",
		tag: "Haute Couture Archive",
		imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=85",
		link: "/shop?category=tailoring",
		ctaText: "Shop Runway Edit",
	},
	{
		id: "global-slide-2",
		title: "The Bespoke Overcoat & Trench · Handloom Heavy Cotton",
		subtitle: "Heavyweight 600gsm hand-spun khadi twill with horn buttons and architectural storm-flap construction.",
		tag: "Outerwear Edition",
		imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1600&q=85",
		link: "/shop?category=outerwear",
		ctaText: "Explore Outerwear",
	},
	{
		id: "global-slide-3",
		title: "Fluid Eveningwear · Double-Mulberry Silk Gowns",
		subtitle: "Naturally weighted wild tussar silk bias-cut silhouettes hand-dyed with plant-based indigo and madder root.",
		tag: "Evening Atelier",
		imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=85",
		link: "/shop?category=eveningwear",
		ctaText: "Discover Eveningwear",
	},
];

export const GLOBAL_CATEGORIES: MarketCategoryItem[] = [
	{
		name: "Architectural Overcoats & Blazers",
		tagline: "Structured Minimalist Silhouettes",
		imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
		href: "/shop?category=outerwear",
		itemCount: "45 Runway Pieces",
	},
	{
		name: "Sartorial Hand-Spun Shirts",
		tagline: "Long-Staple Organic Cotton",
		imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
		href: "/shop?category=shirts",
		itemCount: "70 Tailored Pieces",
	},
	{
		name: "Fluid Silk Tunics & Gowns",
		tagline: "Mulberry & Wild Tussar Silks",
		imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
		href: "/shop?category=dresses",
		itemCount: "55 Couture Gowns",
	},
	{
		name: "Tailored Trousers & Pants",
		tagline: "Relaxed Pleated Cuts",
		imageUrl: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=80",
		href: "/shop?category=trousers",
		itemCount: "40 Bespoke Cuts",
	},
	{
		name: "Artisan Knitwear & Cashmere",
		tagline: "Zero-Waste Hand-Knitted Yarns",
		imageUrl: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80",
		href: "/shop?category=knitwear",
		itemCount: "35 Knits",
	},
	{
		name: "Minimalist Kimonos & Robes",
		tagline: "Ceremonial Layering",
		imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80",
		href: "/shop?category=kimonos",
		itemCount: "28 Archival Pieces",
	},
	{
		name: "Curated Loom Archives",
		tagline: "Museum-Grade Master Textiles",
		imageUrl: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80",
		href: "/shop?category=archives",
		itemCount: "20 Serialized Items",
	},
	{
		name: "Sculptural Leather Footwear",
		tagline: "Vegetable-Tanned Craft",
		imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
		href: "/shop?category=footwear",
		itemCount: "30 Handcrafted Pairs",
	},
	{
		name: "Botanical Attar & Fragrance",
		tagline: "Extrait de Parfum & Oud",
		imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
		href: "/shop?category=fragrance",
		itemCount: "15 Elixirs",
	},
];

export const GLOBAL_BRANDS: MarketBrandItem[] = [
	{
		name: "Suisuto Haute Couture",
		tagline: "Architectural Tailoring",
		desc: "Ancient South Asian handloom heritage reimagined through sculptural minimalist cuts.",
		founded: "Atelier Paris · Dhaka",
		href: "/collections/atelier",
		initials: "SH",
	},
	{
		name: "Atelier Archival",
		tagline: "Historical Weave Restoration",
		desc: "Single-artisan limited runs restoring lost textile techniques from royal courts.",
		founded: "Limited Editions",
		href: "/shop?brand=archival",
		initials: "AA",
	},
	{
		name: "Monolith Raw",
		tagline: "Zero-Waste Organic Khadi",
		desc: "Unbleached, chemical-free hand-spun garments celebrating natural fiber texture.",
		founded: "Ethical Certified",
		href: "/shop?brand=monolith",
		initials: "MR",
	},
	{
		name: "The Silk Route Guild",
		tagline: "Mulberry & Wild Tussar",
		desc: "Lustrous natural silks extracted from certified ethical non-violent cocoons.",
		founded: "Silk Provenance",
		href: "/shop?brand=silk-route",
		initials: "SR",
	},
	{
		name: "Nocturne Studio",
		tagline: "Midnight Mineral Dyes",
		desc: "Subtle dark formal eveningwear dyed using fermented indigo baths and minerals.",
		founded: "Capsule Studio",
		href: "/shop?brand=nocturne",
		initials: "NS",
	},
	{
		name: "Tangail Heritage",
		tagline: "Sub-Microscopic Muslin",
		desc: "World-renowned sheer gossamer weaves woven at only 2 inches per day.",
		founded: "Intangible Heritage",
		href: "/shop?brand=tangail",
		initials: "TH",
	},
	{
		name: "Varanasi Imperial",
		tagline: "Jacquard Silk Archives",
		desc: "Pure zari metallic filaments woven into heavy luxury outerwear and capes.",
		founded: "Loom Archive",
		href: "/shop?brand=varanasi",
		initials: "VI",
	},
	{
		name: "Suisuto Bespoke",
		tagline: "Private Made-to-Measure",
		desc: "Individual client commissions with private video fitting sessions.",
		founded: "Private Salon",
		href: "/shop?brand=bespoke",
		initials: "SB",
	},
	{
		name: "Artisan Collectibles",
		tagline: "Museum-Grade Textiles",
		desc: "Numbered wearable collector works accompanied by archival provenance documents.",
		founded: "Numbered Deeds",
		href: "/shop?brand=collectibles",
		initials: "AC",
	},
];
