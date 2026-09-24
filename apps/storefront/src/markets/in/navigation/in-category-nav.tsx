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

const IN_CATEGORIES_NAV: CategoryNavGroup[] = [
	{
		title: "FESTIVE SALE",
		href: "/in/shop?tag=sale",
		isSpecial: "sale",
	},
	{
		title: "WEDDING EDIT 2026",
		href: "/in/shop?tag=wedding",
		isSpecial: "summer",
	},
	{
		title: "SAREES & LEHENGAS",
		href: "/in/shop?category=sarees",
		bannerImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
		columns: [
			{
				heading: "Banarasi & Heritage Silks",
				items: [
					{ name: "Pure Katan Silk Sarees", href: "/in/shop?category=katan-silk" },
					{ name: "Organza Real Zari Sarees", href: "/in/shop?category=organza-saree" },
					{ name: "Vintage Brocade Drapes", href: "/in/shop?category=brocade-saree" },
					{ name: "Chanderi Tissue Sarees", href: "/in/shop?category=chanderi" },
					{ name: "Kanjivaram Silk Classics", href: "/in/shop?category=kanjivaram" },
				],
			},
			{
				heading: "Bridal & Festivities",
				items: [
					{ name: "Handcrafted Bridal Lehengas", href: "/in/shop?category=lehengas" },
					{ name: "Resham & Mukaish Sets", href: "/in/shop?category=lehengas" },
					{ name: "Royal Anarkali Gowns", href: "/in/shop?category=anarkali" },
					{ name: "Tissue Silk Salwar Ensembles", href: "/in/shop?category=salwar-suits" },
					{ name: "Pure Pashmina Shawls", href: "/in/shop?category=pashmina" },
				],
			},
		],
	},
	{
		title: "MEN'S ROYAL ETHNIC",
		href: "/in/shop?category=sherwani",
		bannerImage: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80",
		columns: [
			{
				heading: "Ceremonial Suiting",
				items: [
					{ name: "Imperial Groom Sherwanis", href: "/in/shop?category=sherwani" },
					{ name: "Bespoke Royal Bandhgala", href: "/in/shop?category=bandhgala" },
					{ name: "Velvet Embroidered Achkans", href: "/in/shop?category=achkan" },
					{ name: "Handcrafted Ceremonial Safas", href: "/in/shop?category=turban" },
				],
			},
			{
				heading: "Kurtas & Bundi Jackets",
				items: [
					{ name: "Mulberry Silk Kurta Sets", href: "/in/shop?category=kurta" },
					{ name: "Embroidered Bundi Jackets", href: "/in/shop?category=bundi" },
					{ name: "Sartorial Linen Kurtas", href: "/in/shop?category=linen-kurta" },
					{ name: "Churidar & Silk Aligadhi", href: "/in/shop?category=pajama" },
				],
			},
		],
	},
	{
		title: "WOMENSWEAR",
		href: "/in/shop?category=womens",
		bannerImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
		columns: [
			{
				heading: "Ethnic Ensembles",
				items: [
					{ name: "Chikankari Kurta Sets", href: "/in/shop?category=chikankari" },
					{ name: "Festive Embroidered Tunics", href: "/in/shop?category=tunics" },
					{ name: "Handloom Banarasi Dupattas", href: "/in/shop?category=dupattas" },
					{ name: "Pure Silk Flared Palazzos", href: "/in/shop?category=palazzos" },
				],
			},
			{
				heading: "Contemporary Indienne",
				items: [
					{ name: "Linen Day Kurtis", href: "/in/shop?category=kurtis" },
					{ name: "Architectural Drape Tops", href: "/in/shop?category=tops" },
					{ name: "Tailored Trousers & Pants", href: "/in/shop?category=pants" },
					{ name: "Brocade Fusion Jackets", href: "/in/shop?category=jackets" },
				],
			},
		],
	},
	{
		title: "JEWELLERY & EXTRAS",
		href: "/in/shop?category=jewellery",
		bannerImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
		columns: [
			{
				heading: "Heritage Jewels",
				items: [
					{ name: "Kundan Choker Sets", href: "/in/shop?category=kundan" },
					{ name: "Polki & Pearl Earrings", href: "/in/shop?category=polki" },
					{ name: "Temple Gold Bangles", href: "/in/shop?category=bangles" },
					{ name: "Maang Tikka & Matha Patti", href: "/in/shop?category=headwear" },
				],
			},
			{
				heading: "Footwear & Accents",
				items: [
					{ name: "Embroidered Silk Mojaris", href: "/in/shop?category=mojaris" },
					{ name: "Handmade Leather Juttis", href: "/in/shop?category=juttis" },
					{ name: "Zari Embroidered Clutches", href: "/in/shop?category=clutches" },
					{ name: "Bespoke Silk Pocket Squares", href: "/in/shop?category=accessories" },
				],
			},
		],
	},
	{
		title: "ATELIER ARCHIVE",
		href: "/in/collections/atelier",
	},
];

export function InCategoryNav() {
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
						{IN_CATEGORIES_NAV.map((cat) => {
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
																			Royal Edit
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
						<span>New Delhi · Varanasi · Mumbai Studio Direct</span>
					</div>
				</nav>
			</div>
		</div>
	);
}
