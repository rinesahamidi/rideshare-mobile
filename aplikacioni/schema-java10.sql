-- Java 10: kërkesat për vend (udhëtar → shofer pronar).
-- Ekzekutohet në Neon SQL Editor pas schema.sql, schema-java05.sql dhe schema-java09.sql.
-- Përdor tabelat ekzistuese udhetimet/profilet; shton vetëm kërkesat.
CREATE TABLE IF NOT EXISTS kerkesat (
  id          SERIAL PRIMARY KEY,
  udhetimi_id TEXT NOT NULL REFERENCES udhetimet(id) ON DELETE CASCADE,
  udhetari_id TEXT NOT NULL REFERENCES profilet(github_id) ON DELETE CASCADE,
  statusi     TEXT NOT NULL DEFAULT 'ne_pritje' CHECK (statusi IN ('ne_pritje', 'pranuar')),
  krijuar     TIMESTAMPTZ NOT NULL DEFAULT now(),
  ndryshuar   TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Një udhëtar ka vetëm një kërkesë për të njëjtin udhëtim.
  UNIQUE (udhetimi_id, udhetari_id)
);

-- Prova përdor udhëtimin ekzistues 2 (shoferi pronar është llogaria ime e shoferit).
-- Para çdo rasti: fillo me 2 vende dhe pa kërkesa (vetëm të dhëna fiktive):
-- DELETE FROM kerkesat WHERE udhetimi_id = '2';
-- UPDATE udhetimet SET vende = 2 WHERE id = '2';
-- Prova me 0 vende: UPDATE udhetimet SET vende = 0 WHERE id = '2';
-- Pas provave, ktheje si ishte: UPDATE udhetimet SET vende = 1 WHERE id = '2';

SELECT u.id, u.vende, u.shofer_id, k.id AS kerkesa, k.udhetari_id, k.statusi
FROM udhetimet u LEFT JOIN kerkesat k ON k.udhetimi_id = u.id
WHERE u.id = '2' ORDER BY k.id;
