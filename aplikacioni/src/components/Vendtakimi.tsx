"use client";
import { useState } from "react";

// Gjendja jeton vetëm në këtë shfletues: pas rifreskimit humbet
// dhe shoferi nuk e sheh. Koordinatat nuk ruhen e nuk shfaqen.
type Gjendja = "idle" | "loading" | "success" | "denied" | "timeout" | "unavailable";

export function Vendtakimi() {
  const [teksti, setTeksti] = useState("");
  const [vendtakimi, setVendtakimi] = useState("");
  const [gabimFushe, setGabimFushe] = useState("");
  const [gjendja, setGjendja] = useState<Gjendja>("idle");
  const [mesazh, setMesazh] = useState("");
  const [saktesia, setSaktesia] = useState<number | null>(null);

  function konfirmo() {
    const pastruar = teksti.trim();
    if (!pastruar) {
      setGabimFushe("Shkruaj vendtakimin para se ta konfirmosh.");
      return;
    }
    setGabimFushe("");
    setVendtakimi(pastruar);
  }

  function kurMerretPozicioni(position: GeolocationPosition) {
    const metra = Math.round(position.coords.accuracy);
    setSaktesia(metra);
    setGjendja("success");
    setMesazh("Pozicioni u mor. Shkruaj një vend të dallueshëm.");
  }

  function kurDeshtonLeximi(error: { code: number }) {
    setSaktesia(null);
    if (error.code === 1) {
      setGjendja("denied");
      setMesazh("Leja u refuzua. Shkruaj vendtakimin vetë.");
    } else if (error.code === 3) {
      setGjendja("timeout");
      setMesazh("Koha mbaroi. Provo sërish ose shkruaj vendtakimin vetë.");
    } else {
      setGjendja("unavailable");
      setMesazh("Pozicioni nuk është i disponueshëm. Shkruaj vendtakimin vetë.");
    }
  }

  function perdorVendndodhjen() {
    setSaktesia(null);
    if (!("geolocation" in navigator)) {
      setGjendja("unavailable");
      setMesazh("Ky shfletues nuk e mbështet vendndodhjen. Shkruaj vendtakimin vetë.");
      return;
    }
    setGjendja("loading");
    setMesazh("Po kërkojmë vendndodhjen…");
    navigator.geolocation.getCurrentPosition(
      kurMerretPozicioni,
      kurDeshtonLeximi,
      { timeout: 10000 }
    );
  }

  return (
    <section className="vendtakimi">
      <button
        type="button"
        className="action"
        onClick={perdorVendndodhjen}
        disabled={gjendja === "loading"}
        data-testid="locate-me"
      >
        Përdor vendndodhjen time
      </button>
      <p role="status" data-testid="location-status" data-state={gjendja}>
        {mesazh}
      </p>
      <p data-testid="location-accuracy">
        {saktesia !== null ? `Saktësia rreth ${saktesia} m` : ""}
      </p>

      <label htmlFor="vendtakimi-fusha">Shkruaj vendtakimin</label>
      <input
        id="vendtakimi-fusha"
        type="text"
        value={teksti}
        onChange={(e) => setTeksti(e.target.value)}
        placeholder="p.sh. Biblioteka"
        data-testid="meeting-input"
      />
      <button
        type="button"
        className="action"
        onClick={konfirmo}
        data-testid="confirm-meeting"
      >
        Konfirmo në telefon
      </button>
      <p role="alert" data-testid="meeting-error">{gabimFushe}</p>
      <p>
        Vendtakimi i konfirmuar:{" "}
        <span data-testid="confirmed-meeting">{vendtakimi || "asnjë ende"}</span>
      </p>
    </section>
  );
}
