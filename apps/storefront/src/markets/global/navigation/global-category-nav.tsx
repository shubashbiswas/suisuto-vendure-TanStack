import { useState, useRef } from "react";
import { Link } from "@/platform/tanstack/navigation";
import { ChevronDown, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubCategoryItem {
	name: string;
	href: string;
}

interface CategoryNavGroup {
	title: string;
	href: string;
	isSpecial?: "sale" | "summer" | "featured";
	bannerImage?: string;
	columns?: Array<{
		heading: string;
		items: SubCategoryItem[];
	}>;
}

const GLOBAL_CATEGORIES_NAV: CategoryNavGroup[] = [
	{
		title: "RUNWAY 2026",
		href: "/shop?tag=runway",
		isSpecial: "summer",
	},
	{
		title: "PRIVATE SALE",
		href: "/shop?tag=sale",
		isSpecial: "sale",
	},
	{
		title: "ARCHITECTURAL TAILORING",
		href: "/shop?category=tailoring",
		bannerImage: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80",
		columns: [
			{
				heading: "Outerwear & Capes",
				items: [
					{ name: "Heavy Twill Khadi Trenches", href: "/shop?category=outerwear" },
					{ name: "Raw Silk Cocoon Overcoats", href: "/shop?category=coats" },
					{ name: "Double-Breasted Wool Blazers", href: "/shop?category=blazers" },
					{ name: "Structured Draped Capes", href: "/shop?category=capes" },
					{ name: "Unpadded Tailored Jackets", href: "/shop?category=jackets" },
				],
			},
			{
				heading: "Sartorial Separates",
				items: [
					{ name: "Hand-Spun Long-Staple Shirts", href: "/shop?category=shirts" },
					{ name: "Pleated Wide-Leg Trousers", href: "/shop?category=trousers" },
					{ name: "Ceremonial Silk Waistcoats", href: "/shop?category=waistcoats" },
					{ name: "Mother-of-Pearl Button Collars", href: "/shop?category=shirts" },
				],
			},
		],
	},
	{
		title: "FLUID SILKS & EVENING",
		href: "/shop?category=eveningwear",
		bannerImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
		columns: [
			{
				heading: "Evening Atelier",
				items: [
					{ name: "Wild Tussar Silk Gowns", href: "/shop?category=gowns" },
					{ name: "Bias-Cut Slip Dresses", href: "/shop?category=dresses" },
					{ name: "Mineral-Dyed Kimono Tunics", href: "/shop?category=kimonos" },
					{ name: "Layered Chiffon Evening Sets", href: "/shop?category=eveningwear" },
				],
			},
			{
				heading: "Fine Weaves",
				items: [
					{ name: "Hand-Rolled Mulberry Scarves", href: "/shop?category=scarves" },
					{ name: "Gossamer Muslin Blouses", href: "/shop?category=blouses" },
					{ name: "Silk Habotai Fluid Pants", href: "/shop?category=pants" },
					{ name: "Draped Ceremonial Stoles", href: "/shop?category=stoles" },
				],
			},
		],
	},
	{
		title: "MENSWEAR",
		href: "/shop?category=mens",
		bannerImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
		columns: [
			{
				heading: "Wardrobe Foundation",
				items: [
					{ name: "Relaxed Band Collar Shirts", href: "/shop?category=shirts" },
					{ name: "Organic Cotton Heavy Twills", href: "/shop?category=chinos" },
					{ name: "Hand-Spun Khadi Trousers", href: "/shop?category=trousers" },
					{ name: "Fine Gauge Cashmere Knits", href: "/shop?category=knitwear" },
				],
			},
			{
				heading: "Modern Layering",
				items: [
					{ name: "Unstructured Linen Blazers", href: "/shop?category=blazers" },
					{ name: "Minimalist Field Jackets", href: "/shop?category=jackets" },
					{ name: "Kimono Leisure Cardigans", href: "/shop?category=kimonos" },
					{ name: "Japanese Selvedge Denim", href: "/shop?category=denim" },
				],
			},
		],
	},
	{
		title: "OBJECTS & LEATHER",
		href: "/shop?category=accessories",
		bannerImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
		columns: [
			{
				heading: "Sculptural Leather",
				items: [
					{ name: "Vegetable-Tanned Tote Bags", href: "/shop?category=bags" },
					{ name: "Minimalist Slip-On Loafers", href: "/shop?category=footwear" },
					{ name: "Full-Grain Leather Mules", href: "/shop?category=shoes" },
					{ name: "Sculptural Brass Buckle Belts", href: "/shop?category=belts" },
				],
			},
			{
				heading: "Botanical Perfumery",
				items: [
					{ name: "Pure Oud Extrait de Parfum", href: "/shop?category=fragrance" },
					{ name: "Mysore Sandalwood Attar", href: "/shop?category=attar" },
					{ name: "Hand-Pressed Amber Incense", href: "/shop?category=incense" },
					{ name: "Silk Travel Pouches", href: "/shop?category=pouches" },
				],
			},
		],
	},
	{
		title: "NUMBERED ARCHIVE",
		href: "/collections/atelier",
	},
];

export function GlobalCategoryNav() {
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const handleMouseEnter = (title: string) => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		setActiveDropdown(title);
	};

	const handleMouseLeave = () => {
		timeoutRef.current = setTimeout(() => {
			setActiveDropdown(null);
		}, 150);
	};

	return (
		<div className="border-t border-border/40 bg-background/95 backdrop-blur-md relative hidden md:block">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<nav className="flex items-center justify-between h-11 text-xs">
					<div className="flex items-center gap-1 lg:gap-2">
						{GLOBAL_CATEGORIES_NAV.map((cat) => {
							const hasColumns = cat.columns && cat.columns.length > 0;
							const isOpen = activeDropdown === cat.title;

							return (
								<div
									key={cat.title}
									className="relative"
									onMouseEnter={() => hasColumns && handleMouseEnter(cat.title)}
									onMouseLeave={handleMouseLeave}
								>
									<Link
										href={cat.href}
										className={cn(
											"inline-flex items-center gap-1 px-3 py-2 text-[11px] font-sans uppercase tracking-wider font-semibold transition-colors rounded-xs",
											cat.isSpecial === "sale"
												? "text-rose-600 hover:text-rose-700 dark:text-rose-400"
												: cat.isSpecial === "summer"
													? "text-amber-600 hover:text-amber-700 dark:text-amber-400"
													: isOpen
														? "text-primary bg-secondary/40"
														: "text-foreground/85 hover:text-foreground hover:bg-secondary/20"
										)}
									>
										<span>{cat.title}</span>
										{hasColumns && (
											<ChevronDown
												className={cn(
													"size-3 text-muted-foreground transition-transform duration-200",
													isOpen && "rotate-180 text-foreground"
												)}
											/>
										)}
									</Link>

									{/* Megamenu Dropdown Flyout */}
									{hasColumns && isOpen && (
										<div
											className="fixed left-0 right-0 top-full w-screen bg-background/95 backdrop-blur-2xl border-b border-border/60 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-200"
											onMouseEnter={() => handleMouseEnter(cat.title)}
											onMouseLeave={handleMouseLeave}
										>
											<div className="container mx-auto px-6 lg:px-12 py-8">
												<div className="grid grid-cols-12 gap-8 items-start">
													{/* Columns */}
													<div className="col-span-8 grid grid-cols-2 gap-8">
														{cat.columns?.map((col, idx) => (
															<div key={`col-${idx}`} className="space-y-3">
																<p className="text-[11px] font-mono font-bold uppercase tracking-wider text-foreground border-b border-border/40 pb-2">
																	{col.heading}
																</p>
																<ul className="space-y-2 text-xs">
																	{col.items.map((item, i) => (
																		<li key={`item-${i}`}>
																			<Link
																				href={item.href}
																				onClick={() => setActiveDropdown(null)}
																				className="text-muted-foreground hover:text-foreground hover:translate-x-1 inline-block transition-all"
																			>
																				{item.name}
																			</Link>
																		</li>
																	))}
																</ul>
															</div>
														))}
													</div>

													{/* Visual Banner on Right */}
													{cat.bannerImage && (
														<div className="col-span-4 border-l border-border/40 pl-8">
															<Link
																href={cat.href}
																onClick={() => setActiveDropdown(null)}
																className="group relative rounded-xl overflow-hidden aspect-16/10 block border border-border/60"
															>
																<img
																	src={cat.bannerImage}
																	alt={cat.title}
																	className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
																/>
																<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
																<div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
																	<div>
																		<p className="text-[10px] font-mono uppercase tracking-widest text-amber-300">
																			Runway Edit
																		</p>
																		<p className="font-serif text-lg font-light">
																			{cat.title}
																		</p>
																	</div>
																	<div className="size-8 rounded-full bg-white text-black flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
																		<ArrowRight className="size-3.5" />
																	</div>
																</div>
															</Link>
														</div>
													)}
												</div>
											</div>
										</div>
									)}
								</div>
							);
						})}
					</div>

					{/* Right Tagline */}
					<div className="hidden xl:flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
						<Sparkles className="size-3 text-amber-500" />
						<span>Worldwide Priority Air Transit · DHL Express</span>
					</div>
				</nav>
			</div>
		</div>
	);
}
