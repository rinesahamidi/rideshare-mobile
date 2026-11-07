import Link from "next/link";
import { Vendtakimi } from "@/components/Vendtakimi";

// Faqe prove: të dhëna lokale fiktive, pa login dhe pa Neon.
const udhetim = {
  id: "2",
  nisja: "Ferizaj",
  destinacioni: "AAB",
  ora: "08:15",
};

export default function Java08Test() {
  return (
    <main>
      <Link href="/">← Kthehu te lista</Link>
      <h1>RideShare</h1>
      <p>Arta · udhëtimi i Dritonit</p>
      <p data-testid="udhetimi-test">
        Udhëtimi {udhetim.id} · {udhetim.nisja} → {udhetim.destinacioni} · {udhetim.ora}
      </p>
      <Vendtakimi />
    </main>
  );
}
