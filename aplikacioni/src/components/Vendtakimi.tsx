"use client";
import { useState } from "react";

// Gjendja jeton vetëm në këtë shfletues: pas rifreskimit humbet
// dhe shoferi nuk e sheh. Koordinatat nuk ruhen e nuk shfaqen.
export function Vendtakimi() {
  const [teksti, setTeksti] = useState("");
  const [vendtakimi, setVendtakimi] = useState("");
  const [gabimFushe, setGabimFushe] = useState("");
  const [pritje, setPritje] = useState(false);
  const [mesazh, setMesazh] = useState("");

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
    setPritje(false);
    const metra = Math.round(position.coords.accuracy);
    setMesazh(`Pozicioni u mor. Saktësia rreth ${metra} m. Shkruaj një vend të dallueshëm.`);
  }

  function kurDeshtonLeximi(error: { code: number }) {
    setPritje(false);
    if (error.code === 1) {
      setMesazh("Leja u refuzua. Shkruaj vendtakimin vetë.");
    } else if (error.code === 2) {
      setMesazh("Pozicioni nuk është i disponueshëm. Shkruaj vendtakimin vetë.");
    } else if (error.code === 3) {
      setMesazh("Koha mbaroi. Provo sërish ose shkruaj vendtakimin vetë.");
    } else {
      setMesazh("Leximi dështoi. Shkruaj vendtakimin vetë.");
    }
  }

  function perdorVendndodhjen() {
    if (!("geolocation" in navigator)) {
      setMesazh("Ky shfletues nuk e mbështet vendndodhjen. Shkruaj vendtakimin vetë.");
      return;
    }
    setPritje(true);
    setMesazh("Po kërkojmë vendndodhjen…");
    navigator.geolocation.getCurrentPosition(
      kurMerretPozicioni,
      kurDeshtonLeximi,
      { timeout: 10000 }
    );
  }

  return (
    <section className="vendtakimi" data-testid="vendtakimi">
      <button
        type="button"
        className="action"
        onClick={perdorVendndodhjen}
        disabled={pritje}
        data-testid="vendndodhja-buton"
      >
        Përdor vendndodhjen time
      </button>
      <p role="status" data-testid="vendndodhja-mesazh">{mesazh}</p>

      <label htmlFor="vendtakimi-fusha">Shkruaj vendtakimin</label>
      <input
        id="vendtakimi-fusha"
        type="text"
        value={teksti}
        onChange={(e) => setTeksti(e.target.value)}
        placeholder="p.sh. Biblioteka"
        data-testid="vendtakimi-fusha"
      />
      <button
        type="button"
        className="action"
        onClick={konfirmo}
        data-testid="vendtakimi-konfirmo"
      >
        Konfirmo në telefon
      </button>
      {gabimFushe && <p role="alert" data-testid="vendtakimi-gabim">{gabimFushe}</p>}
      <p data-testid="vendtakimi-konfirmuar">
        Vendtakimi i konfirmuar: {vendtakimi || "asnjë ende"}
      </p>
    </section>
  );
}
