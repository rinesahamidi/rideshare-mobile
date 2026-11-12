import { profiliIm } from "@/lib/lejet";
import { lexoPreferimet, shtoPreferimin } from "@/lib/preferimet";

export const dynamic = "force-dynamic";
const pa_cache = { "Cache-Control": "no-store" };

// Preferimet e përdoruesit të kyçur. Askush s'sheh preferimet e të tjerëve.
export async function GET() {
  try {
    const p = await profiliIm();
    if (!p) return Response.json({ error: "hyr" }, { status: 401, headers: pa_cache });
    return Response.json({ ids: await lexoPreferimet(p.id) }, { headers: pa_cache });
  } catch {
    return Response.json({ error: "databaza" }, { status: 503, headers: pa_cache });
  }
}

const statusi = { hyr: 401, fushe: 400, "nuk-ekziston": 404, refuzuar: 503 } as const;

export async function POST(request: Request) {
  let udhetimiId = "";
  try {
    const trupi = await request.json();
    udhetimiId = String(trupi?.udhetimiId ?? "");
  } catch {
    return Response.json({ error: "fushe" }, { status: 400, headers: pa_cache });
  }
  try {
    const r = await shtoPreferimin(udhetimiId);
    if (!r.ok) return Response.json({ error: r.arsyeja }, { status: statusi[r.arsyeja], headers: pa_cache });
    return Response.json({ ids: r.ids }, { headers: pa_cache });
  } catch {
    return Response.json({ error: "databaza" }, { status: 503, headers: pa_cache });
  }
}
