# RideShare — Java 9

## Çfarë ndërtova
Te detajet shtova butonin "☆ Ruaj udhetimin". Pamja ndryshon menjehere dhe del "Po ruhet…". Pas konfirmimit nga serveri del "★ I ruajtur". Nese ruajtja deshton, ylli dhe numri kthehen dhe del "Provo perseri". Preferimi ruhet ne Neon, nje rresht per çdo perdorues dhe udhetim.

## Provat që bëra
Provat i bera vete ne shfletues dhe ne Neon.

### Prova 1: Ruajtja e suksesshme mbetet pas rifreskimit.
Prita: "★ I ruajtur" dhe 1 rresht ne Neon pas rifreskimit.
Ndodhi: Pas F5 mbeti "★ I ruajtur", numri 1 dhe 1 rresht ne Neon.

### Prova 2: Gabimi i serverit nuk lë një sukses të rremë në ekran.
Prita: Me `PREFERIMI_REFUZO=1`, ylli bosh, numri 0 dhe "Provo perseri".
Ndodhi: Doli "Provo perseri", numri 0 dhe 0 rreshta ne Neon. Pa refuzimin u ruajt.

### Prova 3: Klikimet e përsëritura nuk krijojnë kopje.
Prita: Pas 5 klikimeve te shpejta vetem 1 rresht.
Ndodhi: Numri 1 dhe 1 rresht ne Neon.

## Ku gjendet puna
- `aplikacioni/schema-java09.sql`
- `aplikacioni/src/lib/preferimet.ts`
- `aplikacioni/src/app/api/preferimet/route.ts`
- `aplikacioni/src/components/RuajUdhetimin.tsx`
- `aplikacioni/src/app/udhetimi/[id]/page.tsx`

Demonstrimi: nuk eshte publikuar.

## Çfarë mbetet për përmirësim
Preferimi nuk mund te hiqet ende.

## Ndihma nga AI (Artificial Intelligence – inteligjencë artificiale)
Claude me ndihmoi me raportin. Provat i bera vete.
