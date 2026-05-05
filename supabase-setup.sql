-- Incidents Tabelle
CREATE TABLE incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  city TEXT NOT NULL,
  area TEXT NOT NULL,
  incident_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('Niedrig', 'Mittel', 'Hoch')),
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  ai_confidence FLOAT,
  ai_reason TEXT,
  reporter_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Öffentlich lesbar (approved), nur einfügen erlaubt
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jeder kann genehmigte Vorfälle lesen"
  ON incidents FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Jeder kann Vorfälle melden"
  ON incidents FOR INSERT
  WITH CHECK (true);
