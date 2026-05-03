import type { APIRoute } from "astro";

export const prerender = false;

const GITHUB_URL_REGEX = /^https?:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/i;
const MAX_URL_LENGTH = 200;

type SubmitBody = { url?: unknown };

const jsonError = (error: string, status: number) =>
	new Response(JSON.stringify({ error }), {
		status,
		headers: { "content-type": "application/json" },
	});

export const POST: APIRoute = async ({ request }) => {
	let body: SubmitBody;
	try {
		body = (await request.json()) as SubmitBody;
	} catch {
		return jsonError("Invalid JSON body", 400);
	}

	const url = typeof body.url === "string" ? body.url.trim() : "";
	if (!url) return jsonError("URL is required", 400);
	if (url.length > MAX_URL_LENGTH) return jsonError("URL is too long", 400);
	if (!GITHUB_URL_REGEX.test(url)) {
		return jsonError("Must be a github.com/owner/repo URL", 400);
	}

	const webhook = process.env.DISCORD_WEBHOOK_URL;
	if (!webhook) {
		return jsonError("Submissions are not currently configured", 503);
	}

	const discordResp = await fetch(webhook, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			content: `📋 **New recruit reporting in.**\n${url}`,
			allowed_mentions: { parse: [] },
		}),
	});

	if (!discordResp.ok) {
		return jsonError("Failed to forward submission", 502);
	}

	return new Response(JSON.stringify({ ok: true }), {
		status: 200,
		headers: { "content-type": "application/json" },
	});
};
