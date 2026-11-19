# RideShare — Java 10

## Çfarë ndërtova
Kerkesa e udhetarit ruhet ne Neon (`kerkesat`). Shoferi dhe udhetari e lexojne gjendjen cdo 5 sekonda pa Refresh. Shoferi pranon; statusi dhe vendet ndryshojne bashke ne server. Ndryshe nga java 9, ndryshimi i nje perdoruesi shihet nga tjetri.

## Përgatitja e provës
Udhetimi 2 me 2 vende. Shoferi: llogaria ime (dritare normale). Udhetari: llogari e dyte GitHub (Incognito).

## Provat që bëra
### Prova 1: Rasti 1 · Kërkesa mbërrin te shoferi
- Hapat: udhetari klikoi "Kerko nje vend".
- Çfarë prisja: shoferi sheh "Ne pritje", vendet 2.
- Çfarë pa realisht shoferi dhe udhëtari, pa Refresh: te dy "Ne pritje", vendet 2.
- Ku e verifikova ruajtjen: Neon, tabela `kerkesat`.

### Prova 2: Rasti 2 · Pranimi përditëson të dy ekranet
- Hapat dhe vendet para/pas: shoferi pranoi; 2 → 1.
- Përsëritja e pranimit dhe prova me 0 vende: pranimi 2 here nga Console: 200, vendet mbeten 1. Me 0 vende: 409 `plot`.
- Çfarë pashë realisht te të dy përdoruesit: te dy "U pranua" dhe 1 vend, pa Refresh.

### Prova 3: Rasti 3 · Ndërprerja dhe rilidhja
- ID-ja e udhëtimit të ri të provës, cila dritare ishte offline dhe si e provova: Nuk u provua.
- Pamja e fundit gjatë ndërprerjes: Nuk u provua.
- Çfarë ndryshoi pas rilidhjes: Nuk u provua.

## Ku gjendet puna
`aplikacioni/schema-java10.sql`, `src/lib/kerkesat.ts`, `src/app/api/udhetimet/[id]/gjendja/route.ts`, `src/app/api/kerkesat/route.ts`, `src/components/GjendjaUdhetimit.tsx`. Demonstrimi: nuk eshte publikuar.

## Prova me kolegun
Pa koleg. Hyrje tjeter: 0 vende. Parashikimi: refuzim. Ndodhi: 409 `plot` (`pranoKerkesen`).

## Çfarë mbetet për përmirësim
Rasti 3 (offline) nuk u provua.

## Ndihma nga AI (Artificial Intelligence – inteligjencë artificiale)
Claude me ndihmoi me raportin.
## Pas dorëzimit të parë — përditëso më vonë
Ky seksion mund të mbetet kështu në dorëzimin e parë. Pasi të marrësh përgjigjen, shto linkun e Issue-t, commit-in e kontrolluar dhe çfarë kaloi ose duhet korrigjuar. 2/2 teknikisht nuk provon funksionimin e aplikacionit.
