import { Link } from "@/platform/tanstack/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface GlobalCategoryNavProps {
	collections?: Array<{ id: string; name: string; slug: string }>;
}

export function GlobalCategoryNav({ collections }: GlobalCategoryNavProps) {
	const navItems =
		collections && collections.length > 0
			? collections.map((c) => ({
					title: c.name.toUpperCase(),
					href: `/collections/${c.slug}`,
			  }))
			: [
					{
						title: "ALL RUNWAY PIECES",
						href: "/shop",
					},
			  ];

	return (
		<div className="border-t border-border/40 bg-background/95 backdrop-blur-md relative hidden md:block">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<nav className="flex items-center justify-between h-11 text-xs">
					<div className="flex items-center gap-1 lg:gap-2">
						{navItems.map((cat) => (
							<div key={cat.title} className="relative">
								<Link
									href={cat.href}
									className={cn(
										"inline-flex items-center gap-1 px-3 py-2 text-[11px] font-sans uppercase tracking-wider font-semibold transition-colors rounded-xs text-foreground/80 hover:text-foreground"
									)}
								>
									<span>{cat.title}</span>
								</Link>
							</div>
						))}
					</div>

					<div className="flex items-center gap-4 text-[11px] font-sans text-muted-foreground">
						<Link
							href="/shop"
							className="hover:text-foreground transition-colors flex items-center gap-1 group"
						>
							<Sparkles className="size-3 text-amber-500" />
							<span>Exclusive Archive</span>
							<ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
						</Link>
					</div>
				</nav>
			</div>
		</div>
	);
}
