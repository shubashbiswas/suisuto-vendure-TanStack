import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MarketRegion, RegionConfig } from "@/platform/region/region.types";

interface LanguagePickerProps {
	activeRegion?: MarketRegion;
	availableRegions?: RegionConfig[];
}

export const LANGUAGES = [
	{ code: "en", short: "EN", native: "English", name: "English" },
	{ code: "bn", short: "BN", native: "বাংলা", name: "Bengali" },
	{ code: "hi", short: "HI", native: "हिन्दी", name: "Hindi" },
] as const;

export type SupportedLanguageCode = (typeof LANGUAGES)[number]["code"];

export function LanguagePicker({
	activeRegion = "global",
	availableRegions,
}: LanguagePickerProps) {
	// Initialize with active region's language or default to 'en'
	const activeMarket = availableRegions?.find(
		(r) => r.code === activeRegion || r.token === activeRegion,
	);
	const initialLang =
		activeMarket?.defaultLanguageCode?.toLowerCase().slice(0, 2) || "en";

	const [selectedCode, setSelectedCode] = useState<string>(
		LANGUAGES.some((l) => l.code === initialLang) ? initialLang : "en"
	);

	useEffect(() => {
		if (typeof window !== "undefined") {
			try {
				const saved = localStorage.getItem("suisuto_language");
				if (saved && LANGUAGES.some((l) => l.code === saved)) {
					setSelectedCode(saved);
				}
			} catch {}
		}
	}, []);

	const activeLang =
		LANGUAGES.find((l) => l.code === selectedCode) || LANGUAGES[0];

	const handleSelectLanguage = (code: string) => {
		setSelectedCode(code);
		if (typeof window !== "undefined") {
			try {
				localStorage.setItem("suisuto_language", code);
				document.cookie = `suisuto_language=${code};path=/;max-age=31536000`;
			} catch {}
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant="ghost"
						size="sm"
						className="gap-1.5 px-2 h-7 text-xs font-mono tracking-wider hover:bg-secondary/60 rounded-none border border-border/40 hover:border-border transition-colors"
						aria-label={`Select language (Current: ${activeLang.short})`}
					>
						<Globe className="size-3.5 text-muted-foreground stroke-[1.75]" />
						<span className="font-semibold text-[11px] text-foreground">
							{activeLang.short}
						</span>
					</Button>
				}
			/>
			<DropdownMenuContent
				align="end"
				className="w-52 p-1.5 shadow-xl border-border/60 rounded-none"
			>
				<DropdownMenuGroup>
					<DropdownMenuLabel className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-2 py-1.5">
						Select Language (ভাষা / भाषा)
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{LANGUAGES.map((lang) => {
						const isSelected = selectedCode === lang.code;
						return (
							<DropdownMenuItem
								key={lang.code}
								onClick={() => handleSelectLanguage(lang.code)}
								className={`flex items-center justify-between p-2 rounded-none cursor-pointer text-xs ${
									isSelected ? "bg-accent/60 font-medium" : ""
								}`}
							>
								<div className="flex items-center gap-2.5">
									<span className="font-mono text-xs font-bold text-foreground w-6">
										{lang.short}
									</span>
									<span className="text-foreground/90 font-serif">
										{lang.native}
									</span>
									<span className="text-[10px] text-muted-foreground">
										({lang.name})
									</span>
								</div>
								{isSelected && (
									<span className="text-primary font-bold text-xs ml-2">✓</span>
								)}
							</DropdownMenuItem>
						);
					})}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
