# RideShare — Java 6 · PWA dhe puna offline

## Çfarë ndërtova
Manifesti i jep aplikacionit emer dhe ikona, qe te mund te instalohet si aplikacion. Service worker ruan faqen offline dhe listen e udhetimeve ne pajisje. Kopja publike permban vetem udhetimet nga `/api/udhetimet`, pa profile, panel ose te dhena te hyrjes.

## Provat që bëra
### Prova 1: Manifesti dhe vizita online
Hapa `http://localhost:3000`. Ne Application → Manifest pashe emrin "RideShare AAB" dhe ikonat 192x192 dhe 512x512. Te Service Workers worker-i ishte aktiv, dhe te Cache Storage `rideshare-public-v1` kishte `/api/udhetimet`.

### Prova 2: Pa internet dhe pas rifreskimit
E simulova nderprerjen me DevTools → Network → Offline. Pas rifreskimit u hap faqja offline me tri kartat dhe koha "Ruajtur per here te fundit". Butoni "Kerko vend" ishte i caktivizuar, sepse pa internet serveri nuk mund ta konfirmoje rezervimin.

### Prova 3: Lidhja rikthehet
Ne Neon e ndryshova oren e ID 2 nga 08:15 ne 08:30. Offline shfaqej ende 08:15 nga kopja e vjeter. Pasi e ktheva internetin dhe klikova "Rifresko listen", u shfaq 08:30. Pastaj e ktheva oren ne 08:15.

## Ku gjendet puna
- Repository: https://github.com/rinesahamidi/rideshare-mobile
- Skedare te rinj: `src/app/manifest.ts`, `src/app/api/udhetimet/route.ts`, `src/components/Pwa.tsx`, `public/sw.js`, `public/offline.html`
- Ndryshova `src/app/layout.tsx`
- Vercel: https://rideshare-mobile-sooty.vercel.app

## Çfarë mbetet për përmirësim
Ne vizitën e pare pa internet nuk ka kopje, prandaj faqja offline tregon "Ende nuk ka liste te ruajtur". Offline lista mund te jete e vjeter dhe nuk mund te kerkosh vend apo te ndryshosh asgje.

## Ndihma nga AI (Artificial Intelligence – inteligjencë artificiale)
Nuk perdora AI.