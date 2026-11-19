"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type Kerkesa = { id: string; udhetari: string; statusi: "ne_pritje" | "pranuar" };
type Gjendja = {
  udhetimi: { id: string; nisja: string; destinacioni: string; ora: string; shoferi: string; vende: number };
  roli: "pronar" | "udhetar";
  emriIm: string;
  kerkesat: Kerkesa[];
  lexuar: string;
};

const INTERVALI = 5000;

const gabimet: Record<string, string> = {
  hyr: "Hyr në llogari për ta parë kërkesën.",
  plot: "Nuk ka vende të lira.",
  pronari: "Je shoferi i këtij udhëtimi; nuk mund të kërkosh vend.",
  ndaluar: "Vetëm shoferi pronar mund ta pranojë.",
  "nuk-ekziston": "Udhëtimi ose kërkesa nuk ekziston.",
  fushe: "Të dhëna të pavlefshme.",
  databaza: "Serveri nuk u përgjigj. Provo përsëri.",
};

// Lexon gjendjen nga serveri çdo 5 sekonda. Nuk nis lexim të dytë ndërsa i pari pret,
// injoron përgjigjet e vjetruara dhe ndalon timer-in kur largohesh nga faqja.
// Kur leximi dështon, mban vlerat e fundit dhe shfaq "Po rilidhemi".
export function GjendjaUdhetimit({ udhetimiId }: { udhetimiId: string }) {
  const [gjendja, setGjendja] = useState<Gjendja | null>(null);
  const [offline, setOffline] = useState(false);
  const [gabimLeximi, setGabimLeximi] = useState<string | null>(null);
  const [neDergim, setNeDergim] = useState(false);
  const [mesazh, setMesazh] = useState<string | null>(null);

  const duke_lexuar = useRef(false);
  const numeruesi = useRef(0); // rritet për çdo lexim/veprim; përgjigjet më të vjetra injorohen
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aktiv = useRef(true);
  const kontrolluesi = useRef<AbortController | null>(null);

  const planifiko = useCallback((fn: () => void) => {
    if (timer.current) clearTimeout(timer.current);
    if (aktiv.current) timer.current = setTimeout(fn, INTERVALI);
  }, []);

  const lexo = useCallback(async () => {
    if (duke_lexuar.current || !aktiv.current) return;
    duke_lexuar.current = true;
    const nr = ++numeruesi.current;
    const ac = new AbortController();
    kontrolluesi.current = ac;
    try {
      const res = await fetch(`/api/udhetimet/${encodeURIComponent(udhetimiId)}/gjendja`, {
        cache: "no-store",
        signal: ac.signal,
      });
      const data = await res.json().catch(() => ({ error: "databaza" }));
      if (nr !== numeruesi.current) return; // një veprim më i ri e ka zëvendësuar
      if (!res.ok) {
        if (res.status === 401 || res.status === 404 || res.status === 400) {
          setGabimLeximi(gabimet[data.error] ?? gabimet.databaza);
          setOffline(false);
          return;
        }
        throw new Error(String(res.status));
      }
      setGjendja(data as Gjendja);
      setGabimLeximi(null);
      setOffline(false); // paralajmërimi hiqet vetëm pas një përgjigjeje të suksesshme
    } catch {
      if (ac.signal.aborted || nr !== numeruesi.current) return;
      setOffline(true); // vlerat e fundit mbeten në ekran
    } finally {
      duke_lexuar.current = false;
      if (kontrolluesi.current === ac) kontrolluesi.current = null;
      planifiko(() => void lexo());
    }
  }, [udhetimiId, planifiko]);

  useEffect(() => {
    aktiv.current = true;
    void lexo();
    // Pas rikthimit të rrjetit lexo menjëherë, pa pritur intervalin.
    const neRikthim = () => void lexo();
    window.addEventListener("online", neRikthim);
    return () => {
      aktiv.current = false;
      if (timer.current) clearTimeout(timer.current);
      kontrolluesi.current?.abort();
      window.removeEventListener("online", neRikthim);
    };
  }, [lexo]);

  async function vepro(trupi: Record<string, string>, suksesi: string) {
    if (neDergim || offline) return;
    setNeDergim(true);
    setMesazh(null);
    // Anulo leximin që po pret, që të mos mbishkruajë rezultatin e veprimit.
    kontrolluesi.current?.abort();
    const nr = ++numeruesi.current;
    try {
      const res = await fetch("/api/kerkesat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trupi),
      });
      const data = await res.json().catch(() => ({ error: "databaza" }));
      if (!res.ok) {
        setMesazh(gabimet[data.error] ?? gabimet.databaza);
        return;
      }
      if (nr === numeruesi.current) setGjendja(data as Gjendja);
      setMesazh(suksesi);
    } catch {
      setOffline(true);
      setMesazh("Veprimi nuk u dërgua. Kontrollo rrjetin.");
    } finally {
      setNeDergim(false);
      planifiko(() => void lexo());
    }
  }

  if (!gjendja) {
    return (
      <section className="sync-card" aria-busy={!gabimLeximi}>
        <p role={gabimLeximi || offline ? "alert" : "status"}>
          {gabimLeximi ?? (offline ? "Po rilidhemi…" : "Po lexohet gjendja nga serveri…")}
        </p>
      </section>
    );
  }

  const { udhetimi, roli, emriIm, kerkesat } = gjendja;
  const pronar = roli === "pronar";
  const imja = kerkesat[0];

  return (
    <section className="sync-card" data-testid="sync" data-offline={offline}>
      <p className="sync-perdoruesi">{emriIm} · {pronar ? "Shofer" : "Udhëtar"}</p>
      <p className="sync-etiketa">UDHËTIMI {udhetimi.id}</p>

      <div className="sync-kutia">
        <p className="sync-etiketa">{udhetimi.nisja.toUpperCase()} → {udhetimi.destinacioni.toUpperCase()}</p>
        <p className="sync-nisja">Nisja {udhetimi.ora}</p>
        <p>{udhetimi.shoferi}</p>
        <div className="sync-rreshti">
          <div><small>Vende të lira</small><strong data-testid="seats">{udhetimi.vende}</strong></div>
          <div className="djathtas"><small>Statusi</small><strong>Aktiv</strong></div>
        </div>
      </div>

      {pronar ? (
        kerkesat.length === 0 ? (
          <>
            <div className="sync-kutia kerkesa">
              <p className="sync-etiketa">KËRKESAT</p>
              <p className="sync-statusi" data-statusi="asnje">Pa kërkesë</p>
            </div>
            <button className="sync-buton" disabled>Ende pa kërkesë</button>
          </>
        ) : kerkesat.map((k) => (
          <div key={k.id}>
            <div className="sync-kutia kerkesa">
              <p className="sync-etiketa">KËRKESA E {k.udhetari.toUpperCase()}</p>
              <p className="sync-statusi" data-statusi={k.statusi} data-testid="request-status">
                {k.statusi === "pranuar" ? "U pranua" : "Në pritje"}
              </p>
            </div>
            <button
              className="sync-buton"
              disabled={k.statusi === "pranuar" || neDergim || offline || udhetimi.vende <= 0}
              onClick={() => vepro({ veprimi: "prano", kerkesaId: k.id }, "Pranimi u ruajt në server.")}
            >
              {k.statusi === "pranuar" ? "Pranimi u ruajt"
                : neDergim ? "Po ruhet…"
                : udhetimi.vende <= 0 ? "Nuk ka vende"
                : "Prano kërkesën"}
            </button>
          </div>
        ))
      ) : (
        <>
          <div className="sync-kutia kerkesa">
            <p className="sync-etiketa">KËRKESA IME</p>
            <p className="sync-statusi" data-statusi={imja?.statusi ?? "asnje"} data-testid="request-status">
              {!imja ? "Pa kërkesë" : imja.statusi === "pranuar" ? "U pranua" : "Në pritje"}
            </p>
          </div>
          <button
            className="sync-buton"
            disabled={Boolean(imja) || neDergim || offline || udhetimi.vende <= 0}
            onClick={() => vepro({ veprimi: "dergo", udhetimiId: udhetimi.id }, "Kërkesa u ruajt në server.")}
          >
            {imja?.statusi === "pranuar" ? "Vendi u konfirmua"
              : imja ? "Kërkesa u dërgua"
              : neDergim ? "Po dërgohet…"
              : udhetimi.vende <= 0 ? "Nuk ka vende"
              : "Kërko një vend"}
          </button>
        </>
      )}

      {mesazh && <p role="status" className="sync-mesazh">{mesazh}</p>}
      {offline ? (
        <p role="alert" className="sync-gjendja offline">
          Po rilidhemi · të dhënat mund të jenë të vjetra
          <br /><small>Veprimet që kërkojnë rrjet janë të bllokuara</small>
        </p>
      ) : (
        <p className="sync-gjendja">
          Gjendja u lexua nga serveri
          <br /><small>Përditësim automatik çdo 5 sekonda</small>
        </p>
      )}
    </section>
  );
}
