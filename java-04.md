# RideShare — Java 4 · Neon dhe PostgreSQL

## Çfarë ndërtova
Krijova databazen `rideshare-java4` ne Neon permes Vercel dhe e lidha me projektin. Ne SQL Editor krijova tabelen `udhetimet` me tri udhetime. Tani lista dhe detajet nuk i marrin udhetimet nga kodi, por i lexojne nga Neon. Kodi per lidhjen eshte ne `src/lib/db.ts`, ndersa `src/lib/udhetimet.ts` ka dy funksione: `lexoUdhetimet` per listen dhe `gjejUdhetimin` per detajet.

## Provat që bëra
### Prova 1: Ndryshimi në databazë shfaqet në aplikacion
Ne SQL Editor ndryshova oren e ID 2 nga 08:15 ne 08:25. Pas rifreskimit, edhe lista edhe detajet tregonin 08:25, pa e ndryshuar kodin. E ktheva oren ne 08:15 dhe pas rifreskimit u shfaq perseri 08:15. ID 3 kishte ende 0 vende dhe /udhetimi/99 tregonte "Udhetimi nuk u gjet".

### Prova 2: Lista bosh dhe rikthimi
Shtova `WHERE false` vetem te `lexoUdhetimet`. U shfaq mesazhi "Nuk ka udhetime per momentin." Kur e hoqa `WHERE false`, u kthyen tri kartat.

### Prova 3: Lidhja mungon, rikthimi dhe siguria
Ne `.env.local` e ndryshova emrin `DATABASE_URL` ne `DATABASE_URL_PA_TEST` dhe e rinisa serverin. U shfaq mesazhi "Nuk u lidhem me databazen. Provo perseri." E ktheva emrin, e rinisa serverin dhe aplikacioni punoi perseri. Ne GitHub Desktop `.env.local` nuk shfaqej ne listen e ndryshimeve.

## Ku gjendet puna
- `aplikacioni/schema.sql`: tabela dhe tri udhetimet
- Skedar i ri: `src/lib/db.ts`
- Skedare te ndryshuar: `src/lib/udhetimet.ts`, `src/app/page.tsx`, `src/app/udhetimi/[id]/page.tsx`, `src/app/udhetimi/[id]/kerkesa/page.tsx`
- `.env.local` eshte vetem ne kompjuter, jo ne GitHub
- Repository: https://github.com/rinesahamidi/rideshare-mobile
- Vercel: https://rideshare-mobile-sooty.vercel.app

## Çfarë mbetet për përmirësim
Kerkesa "Ne pritje" mbetet vetem simulim: nuk ruhet ne databaze dhe shoferi nuk njoftohet. Hapi im i ardhshem eshte te krijoj nje tabele per kerkesat qe kerkesa te ruhet vertet. Gjate punes faqja kryesore me dha 404. E rregullova duke kontrolluar dhe ngjitur perseri kodin ne `src/app/page.tsx`.

## Ndihma nga AI (Artificial Intelligence – inteligjencë artificiale)
E perdora Claude per te krijuar databazen Neon ne Vercel. Me ndihmoi te zgjedh rajonin, te vendos prefiksin `DATABASE` qe variabla te quhet `DATABASE_URL` dhe ta caktivizoj "Sensitive" qe te punoje edhe ne kompjuter. Me ndihmoi edhe kur faqja kryesore jepte 404. Kodin e skedareve e kopjova nga udhezimi. Provat ne SQL Editor dhe ne browser i bera vete.