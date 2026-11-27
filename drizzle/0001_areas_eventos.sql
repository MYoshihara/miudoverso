ALTER TABLE waitlist ADD COLUMN areas TEXT NOT NULL DEFAULT '';
CREATE TABLE eventos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  dia TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('visita', 'acao')),
  pagina TEXT NOT NULL,
  alvo TEXT NOT NULL DEFAULT ''
);
CREATE INDEX eventos_dia ON eventos (dia);
