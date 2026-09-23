import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
	type ReactNode,
} from "react";
import { toast } from "sonner";

export interface WishlistItem {
	id: string;
	name: string;
	slug: string;
	price?: number;
	minPrice?: number;
	maxPrice?: number;
	currencyCode?: string;
	previewImage?: string | null;
}

interface WishlistContextType {
	items: WishlistItem[];
	addItem: (item: WishlistItem) => void;
	removeItem: (id: string) => void;
	toggleItem: (item: WishlistItem) => boolean;
	isInWishlist: (id: string) => boolean;
	totalCount: number;
	clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

const STORAGE_KEY = "suisuto_atelier_wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
	const [items, setItems] = useState<WishlistItem[]>([]);
	const [isInitialized, setIsInitialized] = useState(false);

	// Load from localStorage on mount
	useEffect(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed)) {
					setItems(parsed);
				}
			}
		} catch (err) {
			console.error("Failed to read wishlist from localStorage:", err);
		} finally {
			setIsInitialized(true);
		}
	}, []);

	// Sync to localStorage
	const saveItems = useCallback((newItems: WishlistItem[]) => {
		setItems(newItems);
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
			window.dispatchEvent(new Event("wishlist-change"));
		} catch (err) {
			console.error("Failed to save wishlist to localStorage:", err);
		}
	}, []);

	// Listen for changes from other tabs or components
	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === STORAGE_KEY && e.newValue) {
				try {
					setItems(JSON.parse(e.newValue));
				} catch {}
			}
		};
		const handleCustomChange = () => {
			try {
				const saved = localStorage.getItem(STORAGE_KEY);
				if (saved) setItems(JSON.parse(saved));
			} catch {}
		};

		window.addEventListener("storage", handleStorageChange);
		window.addEventListener("wishlist-change", handleCustomChange);
		return () => {
			window.removeEventListener("storage", handleStorageChange);
			window.removeEventListener("wishlist-change", handleCustomChange);
		};
	}, []);

	const isInWishlist = useCallback(
		(id: string) => items.some((item) => String(item.id) === String(id)),
		[items],
	);

	const addItem = useCallback(
		(item: WishlistItem) => {
			if (!isInWishlist(item.id)) {
				const next = [item, ...items];
				saveItems(next);
				toast.success("Added to Private Atelier Wishlist", {
					description: `${item.name} has been curated to your collection.`,
				});
			}
		},
		[items, isInWishlist, saveItems],
	);

	const removeItem = useCallback(
		(id: string) => {
			const target = items.find((item) => String(item.id) === String(id));
			const next = items.filter((item) => String(item.id) !== String(id));
			saveItems(next);
			if (target) {
				toast.info("Removed from Wishlist", {
					description: `${target.name} was removed from your wishlist.`,
				});
			}
		},
		[items, saveItems],
	);

	const toggleItem = useCallback(
		(item: WishlistItem) => {
			const exists = isInWishlist(item.id);
			if (exists) {
				removeItem(item.id);
				return false;
			} else {
				addItem(item);
				return true;
			}
		},
		[isInWishlist, removeItem, addItem],
	);

	const clearWishlist = useCallback(() => {
		saveItems([]);
		toast.info("Wishlist cleared");
	}, [saveItems]);

	return (
		<WishlistContext.Provider
			value={{
				items: isInitialized ? items : [],
				addItem,
				removeItem,
				toggleItem,
				isInWishlist,
				totalCount: isInitialized ? items.length : 0,
				clearWishlist,
			}}
		>
			{children}
		</WishlistContext.Provider>
	);
}

export function useWishlist() {
	const context = useContext(WishlistContext);
	if (!context) {
		throw new Error("useWishlist must be used within a WishlistProvider");
	}
	return context;
}
