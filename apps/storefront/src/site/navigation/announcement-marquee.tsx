import { Sparkles } from "lucide-react";

export function AnnouncementMarquee({
	campaignAnnouncement,
}: {
	campaignAnnouncement?: string;
} = {}) {
	const defaultItems = [
		"Complimentary Worldwide Express Delivery on Orders Over $250",
		"Master Artisan Handloom: Certified Dhakai Jamdani & Royal Mulberry Silks",
		"Autumn / Winter 2026 Haute Couture Collection Now Available",
		"Bespoke Tailoring & Discreet Luxury Dispatch Directly From Master Weavers",
		"Lifetime Certificate of Authenticity & Heritage Provenance",
	];

	const tickerItems = campaignAnnouncement
		? [campaignAnnouncement, ...defaultItems]
		: defaultItems;

	return (
		<aside
			aria-label="Store Announcements"
			className="relative overflow-hidden bg-primary text-primary-foreground py-2 border-b border-primary-foreground/10 select-none"
		>
			<div className="flex animate-marquee whitespace-nowrap">
				{/* Set 1 */}
				<div className="flex items-center gap-8 px-4">
					{tickerItems.map((item, idx) => (
						<span
							key={`a-${idx}`}
							className="inline-flex items-center gap-3 text-[11px] font-medium tracking-widest uppercase opacity-95 hover:opacity-100 transition-opacity"
						>
							<span>{item}</span>
							<Sparkles className="size-3 text-amber-400 shrink-0" />
						</span>
					))}
				</div>

				{/* Set 2 (for seamless infinite loop) */}
				<div className="flex items-center gap-8 px-4" aria-hidden="true">
					{tickerItems.map((item, idx) => (
						<span
							key={`b-${idx}`}
							className="inline-flex items-center gap-3 text-[11px] font-medium tracking-widest uppercase opacity-95 hover:opacity-100 transition-opacity"
						>
							<span>{item}</span>
							<Sparkles className="size-3 text-amber-400 shrink-0" />
						</span>
					))}
				</div>
			</div>
		</aside>
	);
}
