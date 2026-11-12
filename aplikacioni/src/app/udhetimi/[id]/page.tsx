import Link from "next/link";
import { notFound } from "next/navigation";
import { gjejUdhetimin } from "@/lib/udhetimet";
import { Vendtakimi } from "@/components/Vendtakimi";
import { RuajUdhetimin } from "@/components/RuajUdhetimin";
import { profiliIm } from "@/lib/lejet";
import { lexoPreferimet } from "@/lib/preferimet";

export const dynamic = "force-dynamic";

export default async function Detajet({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let udhetim;
  let profili: Awaited<ReturnType<typeof profiliIm>> = null;
  let preferimet: string[] = [];
  try {
    udhetim = await gjejUdhetimin(id);
    profili = await profiliIm();
    // Preferimet lexohen nga serveri: mbeten pas rifreskimit dhe janë vetëm të këtij përdoruesi.
    if (profili) preferimet = await lexoPreferimet(profili.id);
  } catch {
    return (
      <main>
        <h1>RideShare</h1>
        <p role="alert">Nuk u lidhëm me databazën. Provo përsëri.</p>
        <Link href="/">← Kthehu te lista</Link>
      </main>
    );
  }
  if (!udhetim) notFound();

  return (
    <main>
      <Link href="/">← Kthehu te lista</Link>
      <h1>{udhetim.nisja} – {udhetim.destinacioni}</h1>
      <p>Ora: {udhetim.ora}</p>
      <p>Vendtakimi: {udhetim.vendtakimi}</p>
      <p>Vende të lira: {udhetim.vende}</p>
      {udhetim.vende > 0 ? (
        <Link className="action" href={`/udhetimi/${id}/kerkesa`}>
          Kërko vend
        </Link>
      ) : <button className="action" disabled>Nuk ka vende të lira</button>}
      {profili ? (
        <RuajUdhetimin
          udhetimiId={udhetim.id}
          ruajturFillimisht={preferimet.includes(udhetim.id)}
          numriFillestar={preferimet.length}
        />
      ) : (
        <p><Link href="/panel">Hyr</Link> për ta ruajtur udhëtimin te të preferuarat.</p>
      )}
      <Vendtakimi />
    </main>
  );
}