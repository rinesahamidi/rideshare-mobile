import { lexoGjendjen, statusiHttp } from "@/lib/kerkesat";

export const dynamic = "force-dynamic";
// Përgjigje personale: asnjë cache, as në shfletues, as në CDN, as për sesion tjetër.
const pa_cache = { "Cache-Control": "private, no-store", Vary: "Cookie" };

// Leximi periodik i gjendjes së udhëtimit. Vetëm lexim: nuk pranon e nuk krijon kërkesa.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const r = await lexoGjendjen(id);
    if (typeof r === "string") return Response.json({ error: r }, { status: statusiHttp[r], headers: pa_cache });
    return Response.json(r, { headers: pa_cache });
  } catch {
    return Response.json({ error: "databaza" }, { status: 503, headers: pa_cache });
  }
}
