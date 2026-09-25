import { ArrowUpRight } from "lucide-react";
import { Link } from "@/platform/tanstack/navigation";
import { useScrollReveal, useStaggeredReveal } from "@/hooks/use-scroll-reveal";

interface CategoryItem {
	name: string;
	banglaName?: string;
	tagline: string;
	imageUrl: string;
	href: string;
	itemCount?: string;
}

const CATEGORIES_3X3: CategoryItem[] = [
	{
		name: "Men's Ethnic & Panjabi",
		banglaName: "পাঞ্জাবি ও এথনিক",
		tagline: "Royal Jacquard & Cotton",
		imageUrl:
			"https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/R4KUiGCjERrYo2b0TZaclu4BMxqqAEBr6rh0H99V.png",
		href: "/shop?category=panjabi",
		itemCount: "140+ Pieces",
	},
	{
		name: "Casual & Formal Shirts",
		banglaName: "শার্ট কালেকশন",
		tagline: "Solid, Printed & Checks",
		imageUrl:
			"https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/3oZi8w6S6IqWYMrVrFt5pTK9K8yYW9dX8okPo7Z6.jpg",
		href: "/shop?category=shirts",
		itemCount: "210+ Pieces",
	},
	{
		name: "Dhakai Jamdani & Sarees",
		banglaName: "জামদানি ও শাড়ি",
		tagline: "Generational Loom Weaves",
		imageUrl:
			"https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/Zz8bqMREyksoM6KdKTJuBF76AHrKEan329vW8gAr.jpg",
		href: "/shop?category=sarees",
		itemCount: "95+ Pieces",
	},
	{
		name: "Salwar Suits & Kameez",
		banglaName: "সালোয়ার কামিজ",
		tagline: "Embroidered Three-Piece",
		imageUrl:
			"https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/fEXys0NnBaBtlqkUkdYVmwZbKuY7dBas1WzEBzVw.png",
		href: "/shop?category=kameez",
		itemCount: "125+ Pieces",
	},
	{
		name: "Western Tops & Dresses",
		banglaName: "ওয়েস্টার্ন টপস",
		tagline: "Chic Minimalist Silhouettes",
		imageUrl:
			"https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/tbTcMmvYdEuw1swVk7xaK1lPhcojOKt2BdHp7PAy.webp",
		href: "/shop?category=western",
		itemCount: "80+ Pieces",
	},
	{
		name: "Junior & Newborn",
		banglaName: "জুনিয়র কালেকশন",
		tagline: "Boys, Girls & Baby Essentials",
		imageUrl:
			"https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/wAt3lYVaod6KaRkzZ4cyx4nw6FaE9OTF0hjO32uJ.jpg",
		href: "/shop?category=junior",
		itemCount: "160+ Pieces",
	},
	{
		name: "Accessories & Leather",
		banglaName: "এক্সেসরিজ ও জুতো",
		tagline: "Watches, Wallets & Belts",
		imageUrl:
			"https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/xbURkauHTx3Ots6NaHwn0GFaAWrl9apYj0eYaXzi.png",
		href: "/shop?category=accessories",
		itemCount: "110+ Pieces",
	},
	{
		name: "Beauty & Fragrances",
		banglaName: "বিউটি ও পারফিউম",
		tagline: "Artisan Attar & Skincare",
		imageUrl:
			"https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/S1WUIwQhPBSPnvfIolggIoQR3G4pDU4VuTN3f3Gx.jpg",
		href: "/shop?category=beauty",
		itemCount: "65+ Pieces",
	},
	{
		name: "Atelier Pro & Athleisure",
		banglaName: "অ্যাথলেইজার ও স্পোর্টস",
		tagline: "Performance Fabrics",
		imageUrl:
			"https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/FCJbFYZoazIOBQJZIe2PhsRE7f8SbQJhZS2hH8Ws.jpg",
		href: "/shop?category=activewear",
		itemCount: "75+ Pieces",
	},
];

export function ShopByCategoryGrid({
	categories = CATEGORIES_3X3,
	badge = "Curated Catalog Matrix",
	title = "SHOP BY CATEGORY",
	subtitle = "Explore distinct wardrobe departments handcrafted for contemporary sophistication.",
}: {
	categories?: CategoryItem[];
	badge?: string;
	title?: string;
	subtitle?: string;
}) {
	const validCategories = Array.isArray(categories) && categories.length > 0 ? categories : CATEGORIES_3X3;
	const titleRef = useScrollReveal<HTMLDivElement>();
	const gridRef = useStaggeredReveal<HTMLDivElement>();

	return (
		<section className="py-20 md:py-28 bg-background border-b border-border/40">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div ref={titleRef} className="scroll-reveal text-center max-w-2xl mx-auto mb-14 space-y-2">
					<span className="text-[10px] font-mono font-semibold uppercase tracking-[0.3em] text-primary/80">
						{badge}
					</span>
					<h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-foreground section-title-accent">
						{title}
					</h2>
					<p className="text-xs md:text-sm text-muted-foreground font-sans">
						{subtitle}
					</p>
				</div>

				{/* 3x3 Full-Width Responsive Grid with staggered reveal */}
				<div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
					{validCategories.map((cat, idx) => (
						<Link
							key={`cat-${idx}`}
							href={cat.href}
							className="scroll-reveal-scale group relative h-72 sm:h-80 md:h-96 rounded-xl overflow-hidden border border-border/60 bg-neutral-900 block"
						>
							<img
								src={cat.imageUrl}
								alt={cat.name}
								className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] opacity-85 group-hover:opacity-95"
								loading="lazy"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 group-hover:from-black/95 transition-colors" />

							{/* Top badge */}
							{cat.itemCount && (
								<div className="absolute top-4 left-4 z-10">
									<span className="px-2.5 py-1 rounded-sm bg-black/60 backdrop-blur-md text-[9.5px] font-mono uppercase tracking-widest text-neutral-300 border border-white/10">
										{cat.itemCount}
									</span>
								</div>
							)}

							{/* Bottom Info */}
							<div className="absolute inset-x-0 bottom-0 p-6 z-10 flex items-end justify-between">
								<div className="space-y-1">
									<p className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400">
										{cat.tagline}
									</p>
									<h3 className="font-serif text-xl sm:text-2xl text-white font-normal tracking-tight group-hover:text-amber-200 transition-colors">
										{cat.name}
									</h3>
									{cat.banglaName && (
										<p className="text-xs text-neutral-400 font-sans">
											{cat.banglaName}
										</p>
									)}
								</div>

								<div className="size-10 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black group-hover:scale-110 transition-all duration-300">
									<ArrowUpRight className="size-4" />
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
