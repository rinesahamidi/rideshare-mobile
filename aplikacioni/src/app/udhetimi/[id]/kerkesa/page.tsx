import Link from "next/link";
import { GjendjaUdhetimit } from "@/components/GjendjaUdhetimit";
import { profiliIm } from "@/lib/lejet";

export const dynamic = "force-dynamic";

// Java 10: ekrani i përbashkët i kërkesës. Udhëtari dhe shoferi pronar hapin të
// njëjtën adresë; secili sheh pamjen që i lejon sesioni i vet.
export default async function Kerkesa({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let profili: Awaited<ReturnType<typeof profiliIm>> = null;
  try {
    profili = await profiliIm();
  } catch {
    return (
      <main>
        <h1>RideShare</h1>
        <p role="alert">Nuk u lidhëm me databazën. Provo përsëri.</p>
        <Link href="/">← Kthehu te lista</Link>
      </main>
    );
  }

  return (
    <main>
      <Link href={`/udhetimi/${id}`}>← Kthehu te detajet</Link>
      <h1>RideShare</h1>
      {profili ? (
        <GjendjaUdhetimit udhetimiId={id} />
      ) : (
        <p><Link href="/panel">Hyr</Link> për të kërkuar vend ose për të parë kërkesat.</p>
      )}
    </main>
  );
}
