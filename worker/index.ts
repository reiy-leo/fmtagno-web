// 文档站是 Astro 静态产物，构建时内联进 Worker（见 scripts/build-inline-assets.mjs）。
import { INLINE_ASSETS } from "./assets.generated";

function decode(a: { b: boolean; d: string }): BodyInit {
  if (!a.b) return a.d;
  return Uint8Array.from(atob(a.d), (c) => c.charCodeAt(0));
}

export default {
  async fetch(request: Request): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (request.method !== "GET" && request.method !== "HEAD") return new Response("405 方法不允许", { status: 405 });
    // /guide/tables/ → /guide/tables/index.html；不带斜杠的目录跳到带斜杠的
    let key = pathname.endsWith("/") ? pathname + "index.html" : pathname;
    let asset = INLINE_ASSETS[key];
    if (!asset && !/\.[a-z0-9_]+$/i.test(pathname) && INLINE_ASSETS[pathname + "/index.html"]) {
      return Response.redirect(new URL(pathname + "/", request.url).toString(), 301);
    }
    let status = 200;
    if (!asset) {
      asset = INLINE_ASSETS["/404.html"]!;
      status = 404;
    }
    const headers = new Headers({
      "content-type": asset.t,
      "cache-control": pathname.startsWith("/_astro/") ? "public, max-age=31536000, immutable" : "public, max-age=0, must-revalidate",
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
    });
    return new Response(request.method === "HEAD" ? null : decode(asset), { status, headers });
  },
};
