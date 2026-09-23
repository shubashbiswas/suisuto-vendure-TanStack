import { useState, useEffect, useTransition } from "react";
import { useSearchParams, useRouter } from "@/platform/tanstack/navigation";
import { Search, X } from "lucide-react";

export function SearchInput() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();
	const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");

	useEffect(() => {
		setSearchValue(searchParams.get("q") || "");
	}, [searchParams]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!searchValue.trim()) return;
		startTransition(() => {
			router.push(`/shop?q=${encodeURIComponent(searchValue.trim())}`);
		});
	};

	const handleClear = () => {
		setSearchValue("");
	};

	return (
		<form onSubmit={handleSubmit} className="relative flex items-center">
			<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground stroke-[1.75] pointer-events-none" />
			<input
				type="search"
				placeholder="Search atelier pieces..."
				className="pl-9 pr-8 h-9 w-48 md:w-56 lg:w-64 focus:w-72 bg-secondary/35 hover:bg-secondary/55 focus:bg-background border border-border/50 focus:border-foreground/40 rounded-none text-xs font-sans tracking-wide placeholder:text-muted-foreground/60 focus:outline-none transition-all duration-300"
				value={searchValue}
				onChange={(e) => setSearchValue(e.target.value)}
				disabled={isPending}
			/>
			{searchValue && (
				<button
					type="button"
					onClick={handleClear}
					className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
				>
					<X className="size-3" />
				</button>
			)}
		</form>
	);
}
