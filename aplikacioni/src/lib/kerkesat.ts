import "server-only";
import { getSql } from "./db";
import { profiliIm } from "./lejet";

export type StatusiKerkeses = "ne_pritje" | "pranuar";

export type KerkesaPamje = {
  id: string;
  udhetari: string;
  statusi: StatusiKerkeses;
};

// Pamja që i kthehet një sesioni. Shoferi pronar sheh kërkesat e udhëtimit të vet;
// udhëtari sheh vetëm kërkesën e vet. Leximi nuk ndryshon asgjë.
export type Gjendja = {
  udhetimi: {
    id: string;
    nisja: string;
    destinacioni: string;
    ora: string;
    shoferi: string;
    vende: number;
  };
  roli: "pronar" | "udhetar";
  emriIm: string;
  kerkesat: KerkesaPamje[];
  lexuar: string;
};

export type Gabim = "hyr" | "fushe" | "nuk-ekziston" | "ndaluar" | "plot" | "pronari";

const ID = /^\d{1,9}$/;

export async function lexoGjendjen(udhetimiId: string): Promise<Gjendja | Gabim> {
  const p = await profiliIm();
  if (!p) return "hyr";
  if (!ID.test(udhetimiId)) return "fushe";
  const sql = getSql();
  const rows = await sql`
    SELECT u.id, u.nisja, u.destinacioni, u.ora, u.vende, u.shofer_id,
           COALESCE(s.emri, 'Shoferi') AS shoferi
    FROM udhetimet u LEFT JOIN profilet s ON s.github_id = u.shofer_id
    WHERE u.id = ${udhetimiId}`;
  const u = rows[0];
  if (!u) return "nuk-ekziston";
  const pronar = u.shofer_id === p.id;

  // Filtri sipas sesionit bëhet në SQL: udhëtari nuk merr kurrë kërkesat e të tjerëve.
  const kerkesat = pronar
    ? await sql`
        SELECT k.id, pr.emri AS udhetari, k.statusi
        FROM kerkesat k JOIN profilet pr ON pr.github_id = k.udhetari_id
        WHERE k.udhetimi_id = ${udhetimiId} ORDER BY k.id`
    : await sql`
        SELECT k.id, pr.emri AS udhetari, k.statusi
        FROM kerkesat k JOIN profilet pr ON pr.github_id = k.udhetari_id
        WHERE k.udhetimi_id = ${udhetimiId} AND k.udhetari_id = ${p.id}`;

  return {
    udhetimi: {
      id: String(u.id),
      nisja: u.nisja,
      destinacioni: u.destinacioni,
      ora: u.ora,
      shoferi: u.shoferi,
      vende: Number(u.vende),
    },
    roli: pronar ? "pronar" : "udhetar",
    emriIm: p.emri,
    kerkesat: kerkesat.map((k) => ({
      id: String(k.id),
      udhetari: String(k.udhetari),
      statusi: k.statusi as StatusiKerkeses,
    })),
    lexuar: new Date().toISOString(),
  };
}

// Udhëtari dërgon kërkesën. Udhëtari vjen nga sesioni, jo nga trupi i kërkesës.
// UNIQUE + ON CONFLICT: dërgimi i përsëritur nuk krijon kopje.
export async function dergoKerkesen(udhetimiId: string): Promise<Gjendja | Gabim> {
  const p = await profiliIm();
  if (!p) return "hyr";
  if (!ID.test(udhetimiId)) return "fushe";
  const sql = getSql();
  const rows = await sql`SELECT shofer_id, vende FROM udhetimet WHERE id = ${udhetimiId}`;
  const u = rows[0];
  if (!u) return "nuk-ekziston";
  if (u.shofer_id === p.id) return "pronari";
  if (Number(u.vende) <= 0) return "plot";
  await sql`INSERT INTO kerkesat (udhetimi_id, udhetari_id)
    VALUES (${udhetimiId}, ${p.id})
    ON CONFLICT (udhetimi_id, udhetari_id) DO NOTHING`;
  return lexoGjendjen(udhetimiId);
}

// Shoferi pronar pranon një kërkesë. Statusi dhe vendet ndryshojnë në NJË deklaratë
// SQL (një transaksion): ose ndryshojnë të dyja, ose asnjëra.
// - vetëm kërkesa 'ne_pritje' kalon në 'pranuar' → pranimi i dytë nuk ul vendet sërish;
// - vetëm nëse vende > 0 → me 0 vende nuk konfirmohet vend i ri;
// - FOR UPDATE: dy pranime të njëkohshme serializohen; i dyti e sheh statusin e ri.
export async function pranoKerkesen(kerkesaId: string): Promise<Gjendja | Gabim> {
  const p = await profiliIm();
  if (!p) return "hyr";
  if (!ID.test(kerkesaId)) return "fushe";
  const sql = getSql();
  const ndryshuar = await sql`
    WITH k AS (
      SELECT kk.id, kk.udhetimi_id
      FROM kerkesat kk JOIN udhetimet u ON u.id = kk.udhetimi_id
      WHERE kk.id = ${kerkesaId} AND kk.statusi = 'ne_pritje'
        AND u.shofer_id = ${p.id} AND u.vende > 0
      FOR UPDATE OF kk, u
    ), vendi AS (
      UPDATE udhetimet SET vende = vende - 1
      WHERE id = (SELECT udhetimi_id FROM k) AND vende > 0
      RETURNING id
    )
    UPDATE kerkesat SET statusi = 'pranuar', ndryshuar = now()
    WHERE id = (SELECT id FROM k) AND EXISTS (SELECT 1 FROM vendi)
    RETURNING udhetimi_id`;
  if (ndryshuar.length === 1) return lexoGjendjen(String(ndryshuar[0].udhetimi_id));

  // Asgjë s'ndryshoi: gjej arsyen pa ndryshuar të dhënat.
  const rows = await sql`
    SELECT k.udhetimi_id, k.statusi, u.shofer_id, u.vende
    FROM kerkesat k JOIN udhetimet u ON u.id = k.udhetimi_id
    WHERE k.id = ${kerkesaId}`;
  const r = rows[0];
  if (!r) return "nuk-ekziston";
  if (r.shofer_id !== p.id) return "ndaluar";
  // Pranim i përsëritur: rezultati është i njëjtë, vendet nuk ulen përsëri.
  if (r.statusi === "pranuar") return lexoGjendjen(String(r.udhetimi_id));
  return "plot";
}

export const statusiHttp: Record<Gabim, number> = {
  hyr: 401,
  fushe: 400,
  "nuk-ekziston": 404,
  ndaluar: 403,
  pronari: 409,
  plot: 409,
};
