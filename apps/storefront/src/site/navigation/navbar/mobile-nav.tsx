import { useState, useEffect } from "react";
import { Link, useRouter } from "@/platform/tanstack/navigation";
import {
	Menu,
	Search,
	User,
	Package,
	MapPin,
	ArrowRight,
	Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const rowClassName = 'flex items-center gap-2.5 px-2 py-2 min-h-11 text-xs text-foreground/80 hover:text-foreground';
import {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetClose,
} from "@/components/ui/sheet";
import { useTranslations } from "@/platform/i18n/paraglide";
import { LoginButton } from "@/site/navigation/navbar/login-button";
import { MobilePreferences } from "@/site/navigation/navbar/mobile-preferences";
import type { getPersonalizedShellData } from "@/site/shell.functions";
import type { MarketRegion, RegionConfig } from "@/platform/region/region.types";

interface Collection {
	id: string;
	name: string;
	slug: string;
}

interface MobileNavProps {
	collections: Collection[];
	availableCurrencyCodes: string[];
	activeCurrencyCode: string;
	activeRegion?: MarketRegion;
	availableRegions?: RegionConfig[];
	personalized?: Promise<Awaited<ReturnType<typeof getPersonalizedShellData>>>;
}

export function MobileNav({
	collections,
	availableCurrencyCodes,
	activeCurrencyCode,
	activeRegion,
	availableRegions,
	personalized,
}: MobileNavProps) {
	const t = useTranslations("Navigation");
	const [open, setOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (personalized) {
			personalized.then((data) => {
				if (data?.customerFirstName) {
					setIsLoggedIn(true);
				}
			}).catch(() => {});
		}
	}, [personalized]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (!searchValue.trim()) return;
		router.push(`/shop?q=${encodeURIComponent(searchValue.trim())}`);
		setOpen(false);
	};

	const handleLinkClick = () => {
		setOpen(false);
	};

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				render={
					<Button
						variant="ghost"
						size="icon"
						className="size-11 md:hidden rounded-none hover:bg-secondary/60 text-foreground"
					/>
				}
			>
				<Menu className="size-5 stroke-[1.5]" />
				<span className="sr-only">{t("openMenu")}</span>
			</SheetTrigger>
			<SheetContent
				side="left"
				className="w-[85vw] max-w-sm p-0 overflow-y-auto bg-background/98 backdrop-blur-2xl border-r border-border/50"
			>
				<SheetHeader className="p-5 border-b border-border/40 text-left">
					<SheetTitle className="sr-only">{t("menu")}</SheetTitle>
					<div className="flex items-center gap-3 select-none">
						<div className="relative size-9 shrink-0">
							<img
								src="/logos/logo-s-b.webp"
								alt="Suisuto"
								className="size-full object-contain dark:hidden"
							/>
							<img
								src="/logos/logo-s-w.webp"
								alt="Suisuto"
								className="size-full object-contain hidden dark:block"
							/>
						</div>
						<div className="flex flex-col">
							<span className="font-serif text-xl font-light tracking-[0.25em] text-foreground leading-tight">
								SUISUTO
							</span>
							<span className="text-[7.5px] font-mono tracking-[0.4em] text-muted-foreground uppercase mt-0.5">
								Atelier d'Artisan
							</span>
						</div>
					</div>
				</SheetHeader>

				<div className="flex flex-col gap-6 p-5">
					{/* Search */}
					<form onSubmit={handleSearch} className="relative">
						<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground stroke-[1.75]" />
						<Input
							type="search"
							placeholder="Search pieces, textiles..."
							className="pl-9 pr-4 h-10 w-full rounded-none bg-secondary/40 border-border/60 text-xs font-sans placeholder:text-muted-foreground/60 focus:bg-background transition-all"
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
						/>
					</form>

					{/* Primary High-Fashion Nav */}
					<div className="space-y-1">
						<p className="text-[9px] font-mono uppercase tracking-[0.3em] text-muted-foreground mb-2">
							Navigation
						</p>
						<nav className="flex flex-col divide-y divide-border/30">
							<SheetClose
								render={
									<Link
										href="/shop"
										className="flex items-center justify-between py-3 font-serif text-lg font-normal text-foreground hover:text-primary transition-colors group"
									/>
								}
								nativeButton={false}
								onClick={handleLinkClick}
							>
								<div className="flex items-center gap-3">
									<span className="text-[10px] font-mono text-muted-foreground">01</span>
									<span>Catalog & All Pieces</span>
								</div>
								<ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
							</SheetClose>

							<SheetClose
								render={
									<Link
										href="/collections/atelier"
										className="flex items-center justify-between py-3 font-serif text-lg font-normal text-foreground hover:text-primary transition-colors group"
									/>
								}
								nativeButton={false}
								onClick={handleLinkClick}
							>
								<div className="flex items-center gap-3">
									<span className="text-[10px] font-mono text-muted-foreground">02</span>
									<span>The Atelier Signature Edit</span>
								</div>
								<ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
							</SheetClose>

							<SheetClose
								render={
									<Link
										href="/#artisan-heritage"
										className="flex items-center justify-between py-3 font-serif text-lg font-normal text-foreground hover:text-primary transition-colors group"
									/>
								}
								nativeButton={false}
								onClick={handleLinkClick}
							>
								<div className="flex items-center gap-3">
									<span className="text-[10px] font-mono text-muted-foreground">03</span>
									<span>Master Weavers & Provenance</span>
								</div>
								<ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
							</SheetClose>

							<SheetClose
								render={
									<Link
										href="/wishlist"
										className="flex items-center justify-between py-3 font-serif text-lg font-normal text-foreground hover:text-primary transition-colors group"
									/>
								}
								nativeButton={false}
								onClick={handleLinkClick}
							>
								<div className="flex items-center gap-3">
									<span className="text-[10px] font-mono text-muted-foreground">04</span>
									<span>Private Atelier Wishlist</span>
								</div>
								<ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
							</SheetClose>
						</nav>
					</div>

					{/* Collections */}
					{collections.length > 0 && (
						<div className="space-y-2">
							<p className="text-[9px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
								Collections & Capsules
							</p>
							<div className="flex flex-col space-y-1">
								{collections.map((collection) => (
									<SheetClose
										key={collection.slug}
										render={
											<Link
												href={`/collections/${collection.slug}`}
												className="px-2 py-2 text-xs font-mono uppercase tracking-wider text-foreground/85 hover:text-primary hover:bg-secondary/40 transition-colors"
											/>
										}
										nativeButton={false}
										onClick={handleLinkClick}
									>
										{collection.name}
									</SheetClose>
								))}
							</div>
						</div>
					)}

					{/* Mini Visual Campaign Card in Drawer */}
					<div className="p-3 bg-secondary/30 border border-border/60 space-y-2">
						<span className="text-[9px] font-mono uppercase tracking-[0.25em] text-amber-500 flex items-center gap-1">
							<Sparkles className="size-3" />
							<span>Autumn / Winter 2026</span>
						</span>
						<p className="font-serif text-sm font-light text-foreground">
							Architectural handloom textiles commissioned directly from historic weaver clusters.
						</p>
						<SheetClose
							render={
								<Link
									href="/collections/atelier"
									className="text-[10px] font-mono uppercase tracking-widest text-foreground hover:underline inline-flex items-center gap-1 pt-1"
								/>
							}
							nativeButton={false}
							onClick={handleLinkClick}
						>
							<span>Explore The Runway</span>
							<ArrowRight className="size-3" />
						</SheetClose>
					</div>

					{/* Client Account Links */}
					<div className="space-y-2 border-t border-border/40 pt-4">
						<p className="text-[9px] font-mono uppercase tracking-[0.3em] text-muted-foreground">
							Client Concierge
						</p>
						<nav className="flex flex-col space-y-1">
							<SheetClose
								render={
									<Link
										href="/account/profile"
										className={rowClassName}
									/>
								}
								nativeButton={false}
								onClick={handleLinkClick}
							>
								<User className="size-3.5 text-muted-foreground" />
								<span>{t("profile")}</span>
							</SheetClose>
							<SheetClose
								render={
									<Link
										href="/account/orders"
										className={rowClassName}
									/>
								}
								nativeButton={false}
								onClick={handleLinkClick}
							>
								<Package className="size-3.5 text-muted-foreground" />
								<span>{t("orders")}</span>
							</SheetClose>
							<SheetClose
								render={
									<Link
										href="/account/addresses"
										className={rowClassName}
									/>
								}
								nativeButton={false}
								onClick={handleLinkClick}
							>
								<MapPin className="size-3.5 text-muted-foreground" />
								<span>{t("addresses")}</span>
							</SheetClose>

							<SheetClose
								render={
									<LoginButton
										isLoggedIn={isLoggedIn}
										className={rowClassName}
									/>
								}
								nativeButton={false}
								onClick={handleLinkClick}
							/>
						</nav>
					</div>

					{/* Market Preferences */}
					<div className="border-t border-border/40 pt-4">
						<MobilePreferences
							availableCurrencyCodes={availableCurrencyCodes}
							activeCurrencyCode={activeCurrencyCode}
							activeRegion={activeRegion}
							availableRegions={availableRegions}
						/>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
