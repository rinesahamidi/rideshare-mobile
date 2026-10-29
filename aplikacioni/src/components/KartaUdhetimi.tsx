import Link from "next/link";
import type { Udhetim } from "@/lib/udhetimet";

export function KartaUdhetimi({ udhetim }: { udhetim: Udhetim }) {
  return (
    <article className="trip-card">
      <h2>{udhetim.nisja} – {udhetim.destinacioni}</h2>
      <p>
        Ora: {udhetim.ora} ·{" "}
        {udhetim.vende > 0
          ? `Vende të lira: ${udhetim.vende}`
          : "Nuk ka vende të lira"}
      </p>
      <Link className="action" href={`/udhetimi/${udhetim.id}`}>
        Shiko detajet
      </Link>
    </article>
  );
}