/*
  # Fix RLS policies and seed sample data

  1. Security Changes
    - Drop existing overly restrictive RLS policies
    - Add proper policies allowing anon key to read approved incidents
    - Add policy allowing anon key to insert incidents
    - Keep service_role policies for update/delete
  
  2. Data Changes
    - Insert 15 sample incidents across German cities
    - All with status 'approved' so they are visible immediately
    - Covers various incident types and severities
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Approved incidents are publicly readable" ON incidents;
DROP POLICY IF EXISTS "Anyone can report incidents" ON incidents;
DROP POLICY IF EXISTS "Service role can update incidents" ON incidents;
DROP POLICY IF EXISTS "Service role can delete incidents" ON incidents;

-- Recreate with proper role targeting
CREATE POLICY "Approved incidents are publicly readable"
  ON incidents FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

CREATE POLICY "Anyone can report incidents"
  ON incidents FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Service role can update incidents"
  ON incidents FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete incidents"
  ON incidents FOR DELETE
  TO service_role
  USING (true);

-- Seed sample data
INSERT INTO incidents (city, area, incident_type, severity, description, status, ai_confidence, ai_reason) VALUES
  ('Berlin', 'Alexanderplatz', 'Taschendiebstahl', 'Hoch', 'Zwei Personen haben am Abend einen Touristen bestohlen und sind in Richtung U-Bahn geflohen.', 'approved', 0.92, 'Plausible und respektvolle Meldung.'),
  ('Berlin', 'Kreuzberg, Oranienstraße', 'Aggression', 'Mittel', 'Betrunkenen Streit vor einem Club, Polizei wurde gerufen.', 'approved', 0.88, 'Plausible und respektvolle Meldung.'),
  ('München', 'Marienplatz', 'Betrug', 'Hoch', 'Betrügerische Straßenhändler verkaufen gefälschte Markenware.', 'approved', 0.90, 'Plausible und respektvolle Meldung.'),
  ('München', 'Hauptbahnhof', 'Taschendiebstahl', 'Mittel', 'Taschendiebe aktiv im Bahnhofsbereich, besonders zur Rush Hour.', 'approved', 0.87, 'Plausible und respektvolle Meldung.'),
  ('Hamburg', 'Reeperbahn', 'Aggression', 'Hoch', 'Schlägerei vor einem Club in den frühen Morgenstunden.', 'approved', 0.91, 'Plausible und respektvolle Meldung.'),
  ('Hamburg', 'Hauptbahnhof', 'Raub', 'Hoch', 'Überfall auf einen Passanten in der Unterführung am späten Abend.', 'approved', 0.89, 'Plausible und respektvolle Meldung.'),
  ('Köln', 'Domplatte', 'Taschendiebstahl', 'Mittel', 'Taschendiebe mischen sich unter Touristengruppen am Kölner Dom.', 'approved', 0.86, 'Plausible und respektvolle Meldung.'),
  ('Köln', 'Belgisches Viertel', 'Vandalismus', 'Niedrig', 'Graffiti an mehreren Gebäuden in der Nacht.', 'approved', 0.82, 'Plausible und respektvolle Meldung.'),
  ('Frankfurt', 'Hauptwache', 'Betrug', 'Mittel', 'Betrügerische Umfrage-Team sammelt persönliche Daten.', 'approved', 0.85, 'Plausible und respektvolle Meldung.'),
  ('Frankfurt', 'Bahnhofsviertel', 'Aggression', 'Hoch', 'Aggressive Bettler belästigen Passanten vor dem Bahnhof.', 'approved', 0.88, 'Plausible und respektvolle Meldung.'),
  ('Stuttgart', 'Königstraße', 'Taschendiebstahl', 'Niedrig', 'Leicht verdächtige Personengruppe in der Fußgängerzone.', 'approved', 0.78, 'Plausible und respektvolle Meldung.'),
  ('Düsseldorf', 'Altstadt', 'Vandalismus', 'Niedrig', 'Mülltonnen umgekippt und Bank beschädigt.', 'approved', 0.80, 'Plausible und respektvolle Meldung.'),
  ('Düsseldorf', 'Hauptbahnhof', 'Betrug', 'Mittel', 'Gefälschte Spenden-Sammler am Bahnhofseingang.', 'approved', 0.84, 'Plausible und respektvolle Meldung.'),
  ('Leipzig', 'Augustusplatz', 'Sonstiges', 'Niedrig', 'Laute Gruppe versammelt sich abends und stört Anwohner.', 'approved', 0.75, 'Plausible und respektvolle Meldung.'),
  ('Dresden', 'Neumarkt', 'Taschendiebstahl', 'Mittel', 'Taschendiebe aktiv im Bereich der Frauenkirche.', 'approved', 0.83, 'Plausible und respektvolle Meldung.');
