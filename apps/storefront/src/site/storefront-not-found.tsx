import { Button } from "@/components/ui/button";
import { m } from "@/paraglide/messages.js";
import { Link } from "@/platform/tanstack/navigation";

export function StorefrontNotFound() {
	return (
		<div className="container mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
			<h1 className="text-4xl font-bold">{m.NotFound_title()}</h1>
			<p className="text-muted-foreground">{m.NotFound_message()}</p>
			<Button render={<Link href="/" />} nativeButton={false}>
				{m.NotFound_goHome()}
			</Button>
		</div>
	);
}
