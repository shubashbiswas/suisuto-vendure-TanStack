import { useState, useRef } from "react";
import { Link } from "@/platform/tanstack/navigation";
import { ChevronDown, ArrowRight, Feather } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavbarCollectionsProps {
	collections: Array<{ id: string; name: string; slug: string }>;
}

export function NavbarCollections({ collections }: NavbarCollectionsProps) {
	const [isMegaOpen, setIsMegaOpen] = useState(false);
	const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const handleMouseEnter = () => {
		if (closeTimeoutRef.current) {
			clearTimeout(closeTimeoutRef.current);
			closeTimeoutRef.current = null;
		}
		setIsMegaOpen(true);
	};

	const handleMouseLeave = () => {
		closeTimeoutRef.current = setTimeout(() => {
			setIsMegaOpen(false);
		}, 150);
	};

	return (
		<nav className="flex items-center gap-1 lg:gap-2">
			{/* 1. Shop All / Catalog */}
			<Link
				href="/shop"
				className="px-3 py-2 text-xs font-mono font-medium tracking-[0.2em] uppercase text-foreground/80 hover:text-foreground transition-colors relative group"
			>
				<span>Catalog</span>
				<span className="absolute bottom-1 left-3 right-3 h-px bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
			</Link>

			{/* 2. Collections with Luxury Mega-Menu Dropdown */}
			<div
				className="relative"
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				<button
					type="button"
					onClick={() => setIsMegaOpen((prev) => !prev)}
					className={cn(
						"inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-medium tracking-[0.2em] uppercase transition-colors relative group",
						isMegaOpen ? "text-foreground" : "text-foreground/80 hover:text-foreground"
					)}
					aria-expanded={isMegaOpen}
				>
					<span>Collections</span>
					<ChevronDown
						className={cn(
							"size-3 text-muted-foreground transition-transform duration-300",
							isMegaOpen && "rotate-180 text-foreground"
						)}
					/>
					<span
						className={cn(
							"absolute bottom-1 left-3 right-3 h-px bg-foreground transition-transform duration-300 origin-left",
							isMegaOpen ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
						)}
					/>
				</button>

				{/* Mega-Menu Flyout */}
				{isMegaOpen && (
					<div
						className="fixed left-0 right-0 top-full mt-0 w-screen bg-background/95 backdrop-blur-2xl border-b border-border/60 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-300"
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
					>
						<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
							<div className="grid grid-cols-12 gap-8 lg:gap-12">
								{/* Column 1: Ancestral Textiles */}
								<div className="col-span-3 space-y-4">
									<div className="flex items-center gap-2">
										<Feather className="size-3.5 text-amber-500" />
										<p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground font-semibold">
											Textile Disciplines
										</p>
									</div>
									<ul className="space-y-2.5 text-xs font-serif text-foreground/90">
										<li>
											<Link
												href="/collections/atelier"
												onClick={() => setIsMegaOpen(false)}
												className="block hover:text-primary hover:translate-x-1 transition-all"
											>
												Dhakai Muslin & Jamdani
											</Link>
										</li>
										<li>
											<Link
												href="/collections/atelier"
												onClick={() => setIsMegaOpen(false)}
												className="block hover:text-primary hover:translate-x-1 transition-all"
											>
												Sartorial Mulberry Silks
											</Link>
										</li>
										<li>
											<Link
												href="/collections/atelier"
												onClick={() => setIsMegaOpen(false)}
												className="block hover:text-primary hover:translate-x-1 transition-all"
											>
												Heritage Pit Loom Weaves
											</Link>
										</li>
										<li>
											<Link
												href="/collections/atelier"
												onClick={() => setIsMegaOpen(false)}
												className="block hover:text-primary hover:translate-x-1 transition-all"
											>
												Pure Gold Zari Supplementary Weft
											</Link>
										</li>
									</ul>
								</div>

								{/* Column 2: Active Collections from Backend */}
								<div className="col-span-4 space-y-4 border-l border-border/40 pl-8">
									<p className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground font-semibold">
										Curated Capsules
									</p>
									<ul className="space-y-2.5 text-xs font-serif text-foreground/90">
										<li>
											<Link
												href="/collections/atelier"
												onClick={() => setIsMegaOpen(false)}
												className="group flex items-center justify-between hover:text-primary transition-colors"
											>
												<span className="font-semibold">The Atelier Signature Edit</span>
												<span className="text-[9px] font-mono px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 uppercase tracking-widest">
													Core
												</span>
											</Link>
										</li>
										{collections.map((col) => (
											<li key={col.slug}>
												<Link
													href={`/collections/${col.slug}`}
													onClick={() => setIsMegaOpen(false)}
													className="block hover:text-primary hover:translate-x-1 transition-all"
												>
													{col.name}
												</Link>
											</li>
										))}
										<li className="pt-2">
											<Link
												href="/shop"
												onClick={() => setIsMegaOpen(false)}
												className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-primary hover:underline font-semibold"
											>
												<span>Explore All Pieces</span>
												<ArrowRight className="size-3" />
											</Link>
										</li>
									</ul>
								</div>

								{/* Column 3: High-Fashion Visual Editorial Campaign Showcase */}
								<div className="col-span-5 border-l border-border/40 pl-8">
									<Link
										href="/collections/atelier"
										onClick={() => setIsMegaOpen(false)}
										className="group block relative overflow-hidden bg-black aspect-16/9 border border-border/60"
									>
										<img
											src="/images/hero-campaign.jpg"
											alt="Suisuto Campaign"
											className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-95 transition-all duration-700"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
										<div className="absolute top-4 left-4">
											<span className="px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/20 text-[9px] font-mono font-medium uppercase tracking-[0.25em] text-white">
												Runway 2026
											</span>
										</div>
										<div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
											<div>
												<p className="font-serif text-lg text-white font-light tracking-tight">
													Autumn / Winter Runway
												</p>
												<p className="text-[11px] text-white/75 font-sans">
													Limited batch handloom architectural silhouettes
												</p>
											</div>
											<div className="size-8 rounded-full bg-white text-black flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
												<ArrowRight className="size-3.5" />
											</div>
										</div>
									</Link>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* 3. The Atelier Signature Edit */}
			<Link
				href="/collections/atelier"
				className="px-3 py-2 text-xs font-mono font-medium tracking-[0.2em] uppercase text-foreground/80 hover:text-foreground transition-colors relative group"
			>
				<span>Atelier Edit</span>
				<span className="absolute bottom-1 left-3 right-3 h-px bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
			</Link>

			{/* 4. Heritage & Master Weavers */}
			<Link
				href="/#artisan-heritage"
				className="px-3 py-2 text-xs font-mono font-medium tracking-[0.2em] uppercase text-foreground/80 hover:text-foreground transition-colors relative group hidden xl:inline-block"
			>
				<span>Heritage</span>
				<span className="absolute bottom-1 left-3 right-3 h-px bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
			</Link>
		</nav>
	);
}
