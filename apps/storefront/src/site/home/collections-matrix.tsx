import { ArrowUpRight } from "lucide-react";
import { Link } from "@/platform/tanstack/navigation";

export interface DynamicCollectionItem {
	id: string;
	name: string;
	slug: string;
	description?: string | null;
	featuredAsset?: { preview: string } | null;
}

interface CollectionsMatrixProps {
	collections?: DynamicCollectionItem[];
}

export function CollectionsMatrix({ collections }: CollectionsMatrixProps) {
	const items = (collections && collections.length > 0)
		? collections.slice(0, 4).map((col) => ({
				title: col.name,
				subtitle: col.description || "Curated Capsule Collection",
				href: `/collections/${col.slug}`,
				image: col.featuredAsset?.preview || "",
				tag: "Curated Edition",
		  }))
		: [];

	if (items.length === 0) {
		return null;
	}

	return (
		<section className="py-20 md:py-32 bg-background border-b border-border/40">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Header */}
				<div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
					<div className="space-y-2 max-w-xl">
						<span className="text-[10px] font-mono font-medium uppercase tracking-[0.3em] text-muted-foreground">
							Curated Disciplines
						</span>
						<h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground">
							The Capsule Editions
						</h2>
						<p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-sans pt-1">
							Discover curated fashion capsules defined by ancestral craftsmanship, ethical provenance, and modern architectural versatility.
						</p>
					</div>

					<Link
						href="/collections/atelier"
						className="group inline-flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-[0.25em] text-foreground hover:text-primary transition-colors pb-1 border-b border-foreground/30 hover:border-foreground"
					>
						<span>View Full Lookbook</span>
						<ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
					</Link>
				</div>

				{/* Asymmetric Luxury Matrix Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
					{items.map((tile, idx) => {
						const isLarge = idx === 0 || idx === 3;
						const colSpan = isLarge ? "lg:col-span-7" : "lg:col-span-5";

						return (
							<Link
								key={tile.title}
								href={tile.href}
								className={`group relative overflow-hidden rounded-none border border-border/70 bg-black min-h-[420px] md:min-h-[500px] flex flex-col justify-end p-7 md:p-10 transition-all duration-700 ${colSpan}`}
							>
								{/* High-Resolution Fashion Imagery */}
								{tile.image ? (
									<img
										src={tile.image}
										alt={tile.title}
										className="absolute inset-0 w-full h-full object-cover object-center opacity-85 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-95"
									/>
								) : (
									<div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900" />
								)}

								{/* Darkening Editorial Scrim */}
								<div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent pointer-events-none" />

								{/* Top Badge */}
								<div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
									<span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/20 text-[9px] font-mono font-medium uppercase tracking-[0.25em] text-white">
										{tile.tag}
									</span>
									<div className="size-9 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
										<ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
									</div>
								</div>

								{/* Editorial Content */}
								<div className="relative z-10 space-y-2 max-w-md">
									<h3 className="font-serif text-2xl md:text-3xl lg:text-4xl font-light text-white tracking-tight leading-tight">
										{tile.title}
									</h3>
									<p className="text-xs md:text-sm text-white/80 font-sans leading-relaxed line-clamp-2">
										{tile.subtitle}
									</p>
								</div>
							</Link>
						);
					})}
				</div>
			</div>
		</section>
	);
}
