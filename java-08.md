# RideShare — Java 8

## Çfarë ndërtova
Te detajet shtova komponentin `Vendtakimi.tsx`. Arta shkruan vendtakimin dhe e konfirmon me "Konfirmo ne telefon". Butoni "Perdor vendndodhjen time" kerkon lejen vetem pas klikimit. Fusha manuale mbetet gjithmone aktive. Faqja `/java-08-test` perdor te njejtin komponent me te dhena fiktive.

## Provat që bëra
### Prova 1: Leja nuk kërkohet sapo hapet faqja.
Hapat: Rifreskova `/udhetimi/1`, klikova butonin dhe pranova lejen.
Pritshmëria: Pa leje para klikimit; pastaj "Pozicioni u mor" me saktesine ne metra.
Vëzhgimi: Faqja u hap pa kerkuar leje. Pas pranimit doli "Pozicioni u mor" me saktesine ne metra.

### Prova 2: Refuzimi i lejes nuk e bllokon përdoruesin.
Hapat: Bllokova lejen, rifreskova dhe klikova butonin. Pastaj konfirmova Parkingu. Timeout-in e simulova me `{ code: 3 }`.
Pritshmëria: "Leja u refuzua", pritja mbaron, Parkingu konfirmohet.
Vëzhgimi: Doli mesazhi i refuzimit dhe Parkingu u konfirmua. Ne simulim doli "Koha mbaroi".

### Prova 3: Dëshmitë në GitHub nuk tregojnë adresën time reale.
Hapat: Kontrollova skedaret dhe pamjet e ekranit.
Pritshmëria: Pa koordinata, adresa ose sekrete.
Vëzhgimi: Komponenti lexon vetem `coords.accuracy`. `.env.local` nuk publikohet.

## Ku gjendet puna
- `aplikacioni/src/components/Vendtakimi.tsx`
- `aplikacioni/src/app/udhetimi/[id]/page.tsx`
- `aplikacioni/src/app/java-08-test/page.tsx`

Demonstrimi: nuk eshte publikuar.

## Çfarë mbetet për përmirësim
Pas rifreskimit Biblioteka humbi dhe doli "asnje ende", sepse ruhet vetem lokalisht. Hapi i ardhshem: ta ruaj ne Neon qe ta shohe edhe Dritoni.

## Ndihma nga AI (Artificial Intelligence – inteligjencë artificiale)
Claude me ndihmoi me kodin dhe raportin. Provat i bera vete.

## Prova me një hyrje të re
- Hyrja që provova: vetem hapesira.
- Parashikimi im para klikimit: nuk konfirmohet.
- Çfarë pashë realisht: doli "Shkruaj vendtakimin para se ta konfirmosh."
- Skedari dhe funksioni që e shpjegojnë: `Vendtakimi.tsx`, `konfirmo()`.
- Çfarë kuptova ose korrigjova: `trim()` e ben tekstin bosh.

Këtë pjesë e shpjegoj në klasë. Kontrolli automatik nuk verifikon vërtetësinë e provës.
