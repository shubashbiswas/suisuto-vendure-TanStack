import { User, Shield, Package, LogOut } from "lucide-react";
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
import { Link } from "@/platform/tanstack/navigation";
import { LoginButton } from "@/site/navigation/navbar/login-button";
import { useTranslations } from "@/platform/i18n/paraglide";

export function NavbarUser({ firstName }: { firstName: string | null }) {
	const t = useTranslations("Navigation");

	if (!firstName) {
		return (
			<Button
				variant="ghost"
				size="icon"
				className="size-9 text-foreground hover:bg-secondary/50 rounded-none border border-transparent hover:border-border/60 transition-all group"
				render={<LoginButton isLoggedIn={false} />}
				aria-label="Client Sign In"
				title="Client Sign In"
			>
				<User className="size-4.5 stroke-[1.5] group-hover:scale-105 transition-transform" />
			</Button>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant="ghost"
						size="sm"
						className="h-9 px-2 gap-1.5 text-xs font-mono uppercase tracking-widest text-foreground hover:bg-secondary/50 rounded-none border border-border/40 hover:border-border transition-all"
						aria-label={`Account (${firstName})`}
						title={`Account (${firstName})`}
					>
						<div className="size-5.5 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-bold uppercase">
							{firstName.charAt(0)}
						</div>
						<span className="hidden xl:inline text-[11px] font-medium tracking-wider truncate max-w-[80px]">
							{firstName}
						</span>
					</Button>
				}
			/>
			<DropdownMenuContent align="end" className="w-52 p-1.5 shadow-xl border-border/60 rounded-none">
				<DropdownMenuGroup>
					<DropdownMenuLabel className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground px-2 py-1.5">
						Client Atelier Account
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						render={<Link href="/account/profile" />}
						className="flex items-center gap-2 p-2 text-xs font-sans cursor-pointer hover:bg-accent/60 rounded-none"
					>
						<Shield className="size-3.5 text-muted-foreground" />
						<span>{t("profile")}</span>
					</DropdownMenuItem>
					<DropdownMenuItem
						render={<Link href="/account/orders" />}
						className="flex items-center gap-2 p-2 text-xs font-sans cursor-pointer hover:bg-accent/60 rounded-none"
					>
						<Package className="size-3.5 text-muted-foreground" />
						<span>{t("orders")}</span>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						render={<LoginButton isLoggedIn={true} />}
						nativeButton
						className="flex items-center gap-2 p-2 text-xs font-sans text-destructive cursor-pointer hover:bg-destructive/10 rounded-none"
					>
						<LogOut className="size-3.5 text-destructive" />
						<span>{t("signOut")}</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
