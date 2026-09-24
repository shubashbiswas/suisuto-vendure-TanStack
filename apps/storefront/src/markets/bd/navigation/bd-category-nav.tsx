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

const BD_CATEGORIES_NAV: CategoryNavGroup[] = [
	{
		title: "SALE",
		href: "/shop?tag=sale",
		isSpecial: "sale",
	},
	{
		title: "SUMMER & EID",
		href: "/shop?tag=seasonal",
		isSpecial: "summer",
	},
	{
		title: "MEN",
		href: "/shop?category=men",
		bannerImage: "https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/3oZi8w6S6IqWYMrVrFt5pTK9K8yYW9dX8okPo7Z6.jpg",
		columns: [
			{
				heading: "Casual & Formal Shirts",
				items: [
					{ name: "Full Sleeve Shirts", href: "/shop?category=full-sleeve" },
					{ name: "Half Sleeve Shirts", href: "/shop?category=half-sleeve" },
					{ name: "Check & Stripe Shirts", href: "/shop?category=check-shirt" },
					{ name: "Printed Shirts", href: "/shop?category=printed-shirt" },
					{ name: "Solid Formal Shirts", href: "/shop?category=solid-shirt" },
				],
			},
			{
				heading: "Pants & Bottoms",
				items: [
					{ name: "Formal Trousers", href: "/shop?category=formal-pant" },
					{ name: "Denim Jeans", href: "/shop?category=denim-pant" },
					{ name: "Chino Pants", href: "/shop?category=chino-pant" },
					{ name: "Joggers & Trackpants", href: "/shop?category=joggers" },
					{ name: "Lounge & Relax Wear", href: "/shop?category=relax-wear" },
				],
			},
			{
				heading: "Polos & Outerwear",
				items: [
					{ name: "Classic Polo Shirts", href: "/shop?category=polo-shirt" },
					{ name: "Crewneck T-Shirts", href: "/shop?category=t-shirt" },
					{ name: "Tailored Blazers", href: "/shop?category=blazers" },
					{ name: "Jackets & Waistcoats", href: "/shop?category=waistcoat" },
				],
			},
		],
	},
	{
		title: "MEN'S ETHNIC",
		href: "/shop?category=panjabi",
		bannerImage: "https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/R4KUiGCjERrYo2b0TZaclu4BMxqqAEBr6rh0H99V.png",
		columns: [
			{
				heading: "Royal Panjabis",
				items: [
					{ name: "Premium Jacquard Panjabi", href: "/shop?category=panjabi" },
					{ name: "Embroidery Festive Panjabi", href: "/shop?category=panjabi" },
					{ name: "Semi-Formal Cotton Panjabi", href: "/shop?category=panjabi" },
					{ name: "Artisan Handloom Panjabi", href: "/shop?category=panjabi" },
				],
			},
			{
				heading: "Ceremonial Wear",
				items: [
					{ name: "Groom Sherwanis", href: "/shop?category=sherwani" },
					{ name: "Festive Waistcoats", href: "/shop?category=waistcoat" },
					{ name: "Fitted Pajamas & Aligadhi", href: "/shop?category=pajama" },
					{ name: "Hand-Knitted Prayer Caps", href: "/shop?category=prayer-cap" },
				],
			},
		],
	},
	{
		title: "WOMENS",
		href: "/shop?category=womens",
		bannerImage: "https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/Zz8bqMREyksoM6KdKTJuBF76AHrKEan329vW8gAr.jpg",
		columns: [
			{
				heading: "Ethnic Elegance",
				items: [
					{ name: "Dhakai Jamdani Sarees", href: "/shop?category=sarees" },
					{ name: "Salwar Kameez Sets", href: "/shop?category=kameez" },
					{ name: "Single Kameez & Kurtis", href: "/shop?category=kurtis" },
					{ name: "Maxi Dresses & Gowns", href: "/shop?category=maxi-dresses" },
					{ name: "Modest Abayas & Burqas", href: "/shop?category=burqa-abaya" },
				],
			},
			{
				heading: "Contemporary & Chic",
				items: [
					{ name: "Western Tops & Tunics", href: "/shop?category=western-tops" },
					{ name: "Women's Trousers & Pants", href: "/shop?category=womens-pants" },
					{ name: "Artisan Footwear & Heels", href: "/shop?category=womens-shoes" },
					{ name: "Leather Handbags & Totes", href: "/shop?category=womens-bags" },
				],
			},
		],
	},
	{
		title: "JUNIOR",
		href: "/shop?category=junior",
		bannerImage: "https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/wAt3lYVaod6KaRkzZ4cyx4nw6FaE9OTF0hjO32uJ.jpg",
		columns: [
			{
				heading: "Kids & Teens",
				items: [
					{ name: "Boys Panjabis & Polos", href: "/shop?category=junior-boys" },
					{ name: "Girls Frocks & Salwar Sets", href: "/shop?category=junior-girls" },
					{ name: "Infant & Newborn Essentials", href: "/shop?category=newborn" },
				],
			},
		],
	},
	{
		title: "ACCESSORIES",
		href: "/shop?category=accessories",
		bannerImage: "https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/xbURkauHTx3Ots6NaHwn0GFaAWrl9apYj0eYaXzi.png",
		columns: [
			{
				heading: "Men & Women Extras",
				items: [
					{ name: "Watches & Timepieces", href: "/shop?category=watch" },
					{ name: "Leather Wallets & Belts", href: "/shop?category=wallet" },
					{ name: "Sunglasses & Caps", href: "/shop?category=sunglass" },
					{ name: "Artisan Perfumes & Attar", href: "/shop?category=perfumes" },
				],
			},
		],
	},
	{
		title: "BEAUTY & CARE",
		href: "/shop?category=beauty",
		bannerImage: "https://objectstorage.ap-singapore-1.oraclecloud.com/n/aximxvolvk6d/b/infinityBucket/o/uploads/all/S1WUIwQhPBSPnvfIolggIoQR3G4pDU4VuTN3f3Gx.jpg",
	},
	{
		title: "BRANDS",
		href: "/shop?view=brands",
	},
];

export function BdCategoryNav() {
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
						{BD_CATEGORIES_NAV.map((cat) => {
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
													? "text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
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
													<div className="col-span-8 grid grid-cols-3 gap-6">
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
																<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
																<div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
																	<div>
																		<p className="text-[10px] font-mono uppercase tracking-widest text-amber-300">
																			Featured Edit
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
						<span>Dhaka · Chittagong · Sylhet Express Dispatch</span>
					</div>
				</nav>
			</div>
		</div>
	);
}
