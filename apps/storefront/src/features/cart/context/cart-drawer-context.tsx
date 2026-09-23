import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface CartDrawerContextType {
	isOpen: boolean;
	openCartDrawer: () => void;
	closeCartDrawer: () => void;
	toggleCartDrawer: () => void;
}

const CartDrawerContext = createContext<CartDrawerContextType>({
	isOpen: false,
	openCartDrawer: () => {},
	closeCartDrawer: () => {},
	toggleCartDrawer: () => {},
});

export function CartDrawerProvider({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);

	const openCartDrawer = () => setIsOpen(true);
	const closeCartDrawer = () => setIsOpen(false);
	const toggleCartDrawer = () => setIsOpen((prev) => !prev);

	useEffect(() => {
		const handleOpen = () => setIsOpen(true);
		window.addEventListener("open-cart-drawer", handleOpen);
		return () => window.removeEventListener("open-cart-drawer", handleOpen);
	}, []);

	return (
		<CartDrawerContext.Provider
			value={{ isOpen, openCartDrawer, closeCartDrawer, toggleCartDrawer }}
		>
			{children}
		</CartDrawerContext.Provider>
	);
}

export function useCartDrawer() {
	return useContext(CartDrawerContext);
}

export function triggerCartDrawer() {
	if (typeof window !== "undefined") {
		window.dispatchEvent(new CustomEvent("open-cart-drawer"));
	}
}
