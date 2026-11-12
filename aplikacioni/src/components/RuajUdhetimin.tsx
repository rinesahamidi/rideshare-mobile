"use client";
import { useRef, useState } from "react";

type Gjendja = "idle" | "pending" | "success" | "error";

// Pamja ndryshon menjëherë (optimistic), por "I ruajtur" shfaqet vetëm pas
// përgjigjes së suksesshme të serverit. Në gabim, ylli dhe numri kthehen.
export function RuajUdhetimin({ udhetimiId, ruajturFillimisht, numriFillestar }: {
  udhetimiId: string;
  ruajturFillimisht: boolean;
  numriFillestar: number;
}) {
  const [ruajtur, setRuajtur] = useState(ruajturFillimisht);
  const [numri, setNumri] = useState(numriFillestar);
  const [gjendja, setGjendja] = useState<Gjendja>(ruajturFillimisht ? "success" : "idle");
  const [mesazh, setMesazh] = useState(
    ruajturFillimisht ? "Preferimet u lexuan nga serveri." : "Nuk është te të preferuarat.",
  );
  // useRef bllokon klikimet e shpejta edhe para se React të rifreskojë pamjen.
  const neRuajtje = useRef(false);

  async function ruaj() {
    if (neRuajtje.current || ruajtur) return;
    neRuajtje.current = true;
    const para = { ruajtur, numri };

    setRuajtur(true);
    setNumri(numri + 1);
    setGjendja("pending");
    setMesazh("Po presim konfirmimin e serverit.");

    try {
      const res = await fetch("/api/preferimet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ udhetimiId }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const { ids } = (await res.json()) as { ids: string[] };
      setRuajtur(ids.includes(udhetimiId));
      setNumri(ids.length);
      setGjendja("success");
      setMesazh("U ruajt te të preferuarat.");
    } catch {
      setRuajtur(para.ruajtur);
      setNumri(para.numri);
      setGjendja("error");
      setMesazh("Nuk u ruajt. Provo përsëri.");
    } finally {
      neRuajtje.current = false;
    }
  }

  const etiketa =
    gjendja === "pending" ? "Po ruhet…"
    : gjendja === "error" ? "Provo përsëri"
    : ruajtur ? "I ruajtur"
    : "Ruaj udhëtimin";

  return (
    <section className="preferimi" data-testid="favorite" data-state={gjendja}>
      <button
        type="button"
        className="action ruaj"
        data-state={gjendja}
        onClick={ruaj}
        disabled={gjendja === "pending" || (ruajtur && gjendja === "success")}
        aria-pressed={ruajtur}
        data-testid="favorite-button"
      >
        <span aria-hidden="true">{ruajtur ? "★" : "☆"}</span> {etiketa}
      </button>
      <p role="status" className="ruaj-mesazh" data-state={gjendja} data-testid="favorite-status">{mesazh}</p>
      <p>
        Të preferuarat: <strong data-testid="favorite-count">{numri}</strong>
        <br /><small>Preferim personal · jo rezervim</small>
      </p>
    </section>
  );
}
