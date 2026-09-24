import Page from "@/features/authentication/routes/verify/page";
import { tokenSearchSchema } from "@/platform/tanstack/search";
import { createFileRoute } from "@tanstack/react-router";
import { useRouter } from "@/platform/tanstack/navigation";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { verifyAccountAction } from "@/features/authentication/routes/verify/actions";
import { storefrontHead } from "@/platform/tanstack/head";
import { m } from "@/paraglide/messages.js";
import { Spinner } from "@/components/ui/spinner";

type VerifyResult = Awaited<ReturnType<typeof verifyAccountAction>>;

export const Route = createFileRoute("/$region/verify")({
	head: ({ params }) =>
		storefrontHead({
			title: m.Verify_pageTitle(),
			path: `/${params.region}/verify`,
			noIndex: true,
		}),
	validateSearch: tokenSearchSchema,
	component: RegionalVerifyRoute,
});

function RegionalVerifyRoute() {
	const token = Route.useSearch().token;
	const router = useRouter();
	const verifyAccount = useServerFn(verifyAccountAction);
	const [result, setResult] = useState<VerifyResult | null>(null);
	const startedRef = useRef(false);

	useEffect(() => {
		if (!token || startedRef.current) return;
		startedRef.current = true;
		verifyAccount({ data: { token } })
			.then(async (res) => {
				if (!("error" in res)) await router.invalidate();
				setResult(res);
			})
			.catch(() => setResult({ error: m.Errors_unexpectedError() }));
	}, [token, verifyAccount, router]);

	if (token && !result) {
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<Spinner className="size-6" />
			</div>
		);
	}
	return <Page token={token} result={result} />;
}
