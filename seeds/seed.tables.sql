BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'SpanishMedTerms', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'los pulmones', 'lungs', 2),
  (2, 1, 'los riñones', 'kidneys', 3),
  (3, 1, 'el hígado', 'liver', 4),
  (4, 1, 'el corazón', 'heart', 5),
  (5, 1, 'las amígdalas', 'tonsils', 6),
  (6, 1, 'el cuello', 'neck', 7),
  (7, 1, 'el hombro', 'shoulder', 8),
  (8, 1, 'el tobillo', 'ankle', 9),
  (9, 1, 'la espalda', 'back', 10),
  (10, 1, 'la cabeza', 'head', 11),
  (11, 1, 'la garganta', 'throat', 12),
  (12, 1, 'la rodilla', 'knee', 13),
  (13, 1, 'el hueso', 'bone', 14),
  (14, 1, 'el oído', 'ear', 15),
  (15, 1, 'la sangre', 'blood', 16),
  (16, 1, 'la orina', 'urine', 17),
  (17, 1, 'médula ósea', 'bone marrow', 18),
  (18, 1, 'cálculo renal', 'kidney stone', 19),
  (19, 1, 'la cirugía', 'surgery', 20),
  (20, 1, 'desmayarse', 'to faint', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
