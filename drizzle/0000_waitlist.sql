CREATE TABLE waitlist (
  email TEXT PRIMARY KEY NOT NULL,
  area TEXT NOT NULL CHECK (area IN ('pedagogia', 'fonoaudiologia', 'outra')),
  interesse TEXT NOT NULL CHECK (interesse IN ('baixar', 'compartilhar', 'vender')),
  inscrito_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
