import { dergoKerkesen, pranoKerkesen, statusiHttp } from "@/lib/kerkesat";

export const dynamic = "force-dynamic";
const pa_cache = { "Cache-Control": "private, no-store", Vary: "Cookie" };

// POST { veprimi: "dergo", udhetimiId }  → udhëtari dërgon kërkesën
// POST { veprimi: "prano", kerkesaId }   → shoferi pronar e pranon
// Identiteti merret gjithmonë nga sesioni.
export async function POST(request: Request) {
  let trupi: { veprimi?: unknown; udhetimiId?: unknown; kerkesaId?: unknown };
  try {
    trupi = await request.json();
  } catch {
    return Response.json({ error: "fushe" }, { status: 400, headers: pa_cache });
  }
  try {
    const r =
      trupi?.veprimi === "dergo" ? await dergoKerkesen(String(trupi.udhetimiId ?? ""))
      : trupi?.veprimi === "prano" ? await pranoKerkesen(String(trupi.kerkesaId ?? ""))
      : "fushe";
    if (typeof r === "string") return Response.json({ error: r }, { status: statusiHttp[r], headers: pa_cache });
    return Response.json(r, { headers: pa_cache });
  } catch {
    return Response.json({ error: "databaza" }, { status: 503, headers: pa_cache });
  }
}
