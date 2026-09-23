import handler from "@tanstack/react-start/server-entry";
import { assertServerEnv } from "./platform/env.server.ts";
import "./config/shop-operations.ts";
import { paraglideMiddleware } from "./paraglide/server";

assertServerEnv();

export default {
	async fetch(request: Request): Promise<Response> {
		if (new URL(request.url).pathname.startsWith("/api/"))
			return handler.fetch(request);
		return paraglideMiddleware(request, () => handler.fetch(request));
	},
};
