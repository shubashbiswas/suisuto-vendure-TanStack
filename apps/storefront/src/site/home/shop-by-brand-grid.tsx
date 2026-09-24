import { Link } from "@/platform/tanstack/navigation";
import { Sparkles, ArrowRight } from "lucide-react";

interface BrandItem {
	name: string;
	tagline: string;
	desc: string;
	founded?: string;
	href: string;
	initials: string;
}

const BRANDS_3X3: BrandItem[] = [
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

export function ShopByBrandGrid({
	brands = BRANDS_3X3,
	badge = "The Fashion House Portfolio",
	title = "SHOP BY BRAND",
	subtitle = "Distinctive heritage and contemporary labels curated for quality, pedigree, and longevity.",
}: {
	brands?: BrandItem[];
	badge?: string;
	title?: string;
	subtitle?: string;
}) {
	return (
		<section className="py-20 md:py-28 bg-secondary/15 border-b border-border/40">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
					<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-mono uppercase tracking-[0.25em] text-primary">
						<Sparkles className="size-3" />
						<span>{badge}</span>
					</div>
					<h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-foreground">
						{title}
					</h2>
					<p className="text-xs md:text-sm text-muted-foreground font-sans">
						{subtitle}
					</p>
				</div>

				{/* 3x3 Full Width Brands Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{brands.map((brand, idx) => (
						<Link
							key={`brand-${idx}`}
							href={brand.href}
							className="group relative p-8 sm:p-10 rounded-2xl border border-border/60 bg-card hover:bg-card/90 hover:border-foreground/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
						>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="size-14 rounded-xl bg-secondary/80 border border-border/80 flex items-center justify-center font-serif text-xl font-bold tracking-widest text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
										{brand.initials}
									</div>
									{brand.founded && (
										<span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
											{brand.founded}
										</span>
									)}
								</div>

								<div>
									<h3 className="font-serif text-2xl font-normal text-foreground group-hover:text-primary transition-colors">
										{brand.name}
									</h3>
									<p className="text-[11px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 mt-1">
										{brand.tagline}
									</p>
								</div>

								<p className="text-xs text-muted-foreground font-sans leading-relaxed">
									{brand.desc}
								</p>
							</div>

							<div className="pt-6 border-t border-border/40 mt-6 flex items-center justify-between text-xs font-mono uppercase tracking-widest text-foreground/80 group-hover:text-primary transition-colors">
								<span>Discover Brand</span>
								<ArrowRight className="size-3.5 group-hover:translate-x-1.5 transition-transform" />
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
