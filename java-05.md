# RideShare — Java 5 · Hyrja dhe lejet

## Çfarë ndërtova
Shtova hyrjen me GitHub me NextAuth. Identiteti tregon kush je dhe e verifikon GitHub. Roli (`udhetar` ose `shofer`) ruhet ne Neon te tabela `profilet`. Pronesia tregohet me `shofer_id` te `udhetimet`, qe shoferi te ndryshoje vetem udhetimin e vet. Serveri i kontrollon te tria para se ta ruaje oren.

## Provat që bëra
### Prova 1: Hyrja, rifreskimi dhe dalja
Pa hyre, paneli tregonte "Hyr me GitHub". Pas hyrjes u shfaq emri im dhe roli `udhetar`. Pas rifreskimit mbeta e kyçur. Pas "Dil" paneli kerkoi perseri hyrje.

### Prova 2: Shoferi ndryshon udhëtimin e vet
Si shofer i ID 2 e ndryshova oren ne 08:25. Paneli tregoi "Ora u ruajt me sukses", dhe lista, detajet dhe SQL Editor tregonin 08:25. Pastaj e ktheva ne 08:15.

### Prova 3: Veprimi pa leje refuzohet
Ne DevTools e ndryshova `id` nga 2 ne 1 dhe klikova "Ruaj oren". U shfaq "Nuk ke leje per kete udhetim. Ora nuk ndryshoi." Ne SQL Editor ID 1 mbeti 08:00.

## Ku gjendet puna
- Repository: https://github.com/rinesahamidi/rideshare-mobile
- `aplikacioni/schema-java05.sql`
- Skedare te rinj: `src/lib/auth.ts`, `src/lib/lejet.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/components/hyrja.tsx`, `src/app/panel/page.tsx`, `src/app/panel/actions.ts`

## Çfarë mbetet për përmirësim
Kerkesa per vend eshte ende simulim. Me pas do te shtoja nje tabele per kerkesat, qe shoferi t'i shohe dhe t'i pranoje.

## Ndihma nga AI (Artificial Intelligence – inteligjencë artificiale)
E perdora Claude kur hyrja jepte gabimin "OAuthCallback", per te kontrolluar vlerat ne `.env.local` pa i shfaqur sekretet. Me ndihmoi edhe me emrin `page.tsx` dhe me fushen "Redirect URI" ne GitHub. Kodin e kopjova nga udhezimi, provat i bera vete.