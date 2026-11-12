-- Java 9: preferimet (udhëtimet e ruajtura nga një përdorues).
-- Ekzekutohet në Neon SQL Editor pas schema.sql dhe schema-java05.sql.
-- Çelësi primar (github_id, udhetimi_id) garanton vetëm një rresht për çiftin
-- përdorues–udhëtim, edhe nëse klikimet ose kërkesat përsëriten.
CREATE TABLE IF NOT EXISTS preferimet (
  github_id   TEXT NOT NULL REFERENCES profilet(github_id) ON DELETE CASCADE,
  udhetimi_id TEXT NOT NULL REFERENCES udhetimet(id) ON DELETE CASCADE,
  krijuar     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (github_id, udhetimi_id)
);

-- Kontroll: s'duhet të ketë asnjë çift të dyfishtë.
SELECT github_id, udhetimi_id, COUNT(*) AS rreshta
FROM preferimet GROUP BY github_id, udhetimi_id ORDER BY github_id, udhetimi_id;
