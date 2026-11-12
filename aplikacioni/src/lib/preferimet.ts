import "server-only";
import { getSql } from "./db";
import { profiliIm } from "./lejet";

export type Rezultati =
  | { ok: true; ids: string[] }
  | { ok: false; arsyeja: "hyr" | "fushe" | "nuk-ekziston" | "refuzuar" };

// ID-të e udhëtimeve që përdoruesi i kyçur i ka te të preferuarat.
export async function lexoPreferimet(githubId: string): Promise<string[]> {
  const sql = getSql();
  const rows = await sql`SELECT udhetimi_id FROM preferimet
    WHERE github_id = ${githubId} ORDER BY krijuar`;
  return rows.map((r) => String(r.udhetimi_id));
}

export async function shtoPreferimin(udhetimiId: string): Promise<Rezultati> {
  const p = await profiliIm();
  if (!p) return { ok: false, arsyeja: "hyr" };
  if (!/^\d{1,9}$/.test(udhetimiId)) return { ok: false, arsyeja: "fushe" };

  // Refuzim prove para shkrimit (Rasti 2). Vetëm jashtë production.
  if (process.env.NODE_ENV !== "production" && process.env.PREFERIMI_REFUZO === "1") {
    return { ok: false, arsyeja: "refuzuar" };
  }

  const sql = getSql();
  const ekziston = await sql`SELECT 1 FROM udhetimet WHERE id = ${udhetimiId}`;
  if (ekziston.length === 0) return { ok: false, arsyeja: "nuk-ekziston" };

  // Pronari vjen nga sesioni, jo nga trupi i kërkesës.
  // ON CONFLICT e bën kërkesën idempotente: përsëritja nuk krijon kopje.
  await sql`INSERT INTO preferimet (github_id, udhetimi_id)
    VALUES (${p.id}, ${udhetimiId})
    ON CONFLICT (github_id, udhetimi_id) DO NOTHING`;
  return { ok: true, ids: await lexoPreferimet(p.id) };
}
