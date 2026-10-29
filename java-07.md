# RideShare · Java 7

## Rasti im
GitHub: rinesahamidi
Kodi: P7-582
Skenari i zgjedhur (numri dhe titulli, nga Rastet 1–5): Rasti 2 · Pa vende
ID i udhëtimit në projektin tim: 2
Të dhënat fiktive të rastit: Prizren → AAB, 09:00, 1 vende. Ora për provën e re: 09:05.

Per provat i vendosa keto vlera te rreshti ID 2 ne Neon (ishte Fushe Kosove → AAB, 08:15, 1 vend). Pas provave e ktheva ID 2 ne vlerat e meparshme. Nuk kam panel te ri shoferi; vendet i kontrollova te lista publike dhe te detajet.

## Parashikimi
[PLOTËSO] Para kodimit: çfarë pret në listë, detaje dhe te skenari që zgjodhe? Shkruaj me fjalët e tua.

## Dy probleme
1. Lista nuk e dallon udhetimin pa vende. Vendosa 0 vende te ID 2 (Prizren → AAB, 09:00) dhe hapa `http://localhost:3000`. Karta shkruante "Ora: 09:00 · Vende te lira: 0", njesoj si kartat me vende, me te njejtin buton "Shiko detajet". E perserita me ID 3 (Lipjan, 0 vende) dhe pashe te njejten gje. Perdoruesi e kupton qe udhetimi eshte plot vetem pasi hap detajet.
2. Titulli i kerkeses demonstrative premton shume. Me 1 vend te ID 2 klikova "Shiko detajet", pastaj "Kerko vend". Faqja kishte titullin "Simulim: Ne pritje". "Ne pritje" tingellon sikur kerkesa po pret pergjigjen e shoferit, por fjalia poshte thote "Kerkesa per Prizren nuk eshte derguar te shoferi." Kete nuk e korrigjova sot.

## Korrigjimi
Skedari: aplikacioni/src/components/KartaUdhetimi.tsx
Ky skedar eshte karta e nje udhetimi te lista. Faqja kryesore `src/app/page.tsx` e perdor nje here per secilin udhetim. Karta shfaq nisjen, destinacionin, oren, vendet dhe lidhjen "Shiko detajet" te `/udhetimi/[id]`. Me pare teksti ishte gjithmone "Vende te lira: {udhetim.vende}". Shtova kushtin `udhetim.vende > 0`: nese ka vende, shfaqet "Vende te lira: N" si me pare; nese ka 0 vende, shfaqet "Nuk ka vende te lira". Eshte i njejti kusht qe e perdor faqja e detajeve per butonin, prandaj lista dhe detajet tani japin te njejtin mesazh. Me 0 vende lista nuk duhet te jape pershtypjen se ka vend.

## Versionet
Para: [PLOTËSO]
Pas: [PLOTËSO]

## Provat që bëra
### Prova 1
Hapat: Me ID 2 = Prizren → AAB, 09:00, 1 vend, hapa listen, klikova "Shiko detajet" te Prizren, pastaj "Kerko vend".
Pritshmëria: Lista, detajet dhe kerkesa tregojne te njejtin ID 2 me te njejtat vlera, dhe kerkesa thote qarte se eshte vetem simulim.
Vëzhgimi: Lista: "Prizren – AAB · Ora: 09:00 · Vende te lira: 1". Detajet `/udhetimi/2`: Ora 09:00, Vendtakimi "Te stacioni kryesor", 1 vend, butoni "Kerko vend". Kerkesa `/udhetimi/2/kerkesa`: "Kerkesa per Prizren nuk eshte derguar te shoferi." Vlerat perputhen. Kufiri i simulimit: asgje nuk ruhet ne Neon dhe shoferi nuk njoftohet. Kjo prove nuk kaloi plotesisht: titulli "Simulim: Ne pritje" mund te kuptohet si kerkese qe pret shoferin (problemi 2).

### Prova 2
Hapat: Vendosa 0 vende te ID 2 (Prizren, 09:00), hapa listen, pastaj "Shiko detajet" dhe me dore `/udhetimi/2/kerkesa`.
Pritshmëria: Karta te lista shkruan "Nuk ka vende te lira"; detajet tregojne 0 vende dhe butonin e caktivizuar; kerkesa nuk premton vend.
Vëzhgimi: Para ndryshimit karta shkruante "Ora: 09:00 · Vende te lira: 0". Pas ndryshimit shkruan "Ora: 09:00 · Nuk ka vende te lira". Detajet treguan "Vende te lira: 0" dhe butonin e caktivizuar "Nuk ka vende te lira". `/udhetimi/2/kerkesa` tregoi vetem "Nuk ka vende te lira." `npx tsc --noEmit` kaloi pa gabime.

### Prova 3
Hapat: Ndryshova vetem oren e ID 2 nga 09:00 ne 09:05 (vendet mbeten 0) dhe rifreskova listen dhe detajet.
Pritshmëria: Lista dhe detajet tregojne 09:05; mesazhi "Nuk ka vende te lira" mbetet, sepse kushti varet vetem nga vendet, jo nga ora.
Vëzhgimi: Lista: "Prizren – AAB · Ora: 09:05 · Nuk ka vende te lira". Detajet: Ora 09:05, "Vende te lira: 0" dhe butoni i caktivizuar. ID 1 (2 vende) tregonte ende "Vende te lira: 2", pra korrigjimi nuk i fsheh vendet e lira. Pastaj e ktheva ID 2 ne Fushe Kosove, 08:15, 1 vend.

## Ndryshimi i ri
Nuk e kam demonstruar ende para kolegut. Do ta demonstroj ne takimin e radhes duke treguar `KartaUdhetimi.tsx` dhe kushtin `udhetim.vende > 0`.

## Ndihma nga AI
E perdora Claude gjate korrigjimit. Me ndihmoi te gjej dy problemet dhe sugjeroi kushtin `udhetim.vende > 0` te `KartaUdhetimi.tsx`. Claude i ekzekutoi provat ne aplikacionin tim lokal: ndryshoi perkohesisht ID 2 ne Neon me vlerat e rastit P7-582, hapi listen, detajet dhe kerkesen, dhe pastaj e ktheu ID 2 ne vlerat e meparshme. Me ndihmoi edhe te plotesoj raportin sipas modelit dhe te bej commit-et.
