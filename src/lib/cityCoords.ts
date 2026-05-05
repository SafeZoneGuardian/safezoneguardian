// Approximate coordinates for German cities and well-known areas/neighborhoods.
// Used by the interactive map to place incident markers without requiring geocoding.

export const CITY_COORDS: Record<string, [number, number]> = {
  Berlin: [52.5200, 13.4050],
  München: [48.1351, 11.5820],
  Munich: [48.1351, 11.5820],
  Hamburg: [53.5511, 9.9937],
  Köln: [50.9375, 6.9603],
  Cologne: [50.9375, 6.9603],
  Frankfurt: [50.1109, 8.6821],
  Stuttgart: [48.7758, 9.1829],
  Düsseldorf: [51.2277, 6.7735],
  Leipzig: [51.3397, 12.3731],
  Bremen: [53.0793, 8.8017],
  Hannover: [52.3759, 9.7320],
  Dortmund: [51.5136, 7.4653],
  Essen: [51.4556, 7.0116],
  Dresden: [51.0504, 13.7373],
  Nürnberg: [49.4521, 11.0767],
  Nuremberg: [49.4521, 11.0767],
};

// More specific area-level coords (city + area key) for nicer marker placement.
const AREA_COORDS: Record<string, [number, number]> = {
  // Berlin
  'berlin|alexanderplatz': [52.5219, 13.4132],
  'berlin|kottbusser tor': [52.4990, 13.4180],
  'berlin|görlitzer park': [52.4988, 13.4360],
  'berlin|hauptbahnhof': [52.5251, 13.3694],
  // München
  'münchen|hauptbahnhof': [48.1402, 11.5586],
  'münchen|karlsplatz stachus': [48.1391, 11.5660],
  'münchen|marienplatz': [48.1374, 11.5755],
  // Hamburg
  'hamburg|reeperbahn': [53.5497, 9.9637],
  'hamburg|sternschanze': [53.5635, 9.9610],
  'hamburg|hauptbahnhof': [53.5528, 10.0067],
  // Köln
  'köln|hauptbahnhof/dom': [50.9430, 6.9583],
  'köln|hauptbahnhof': [50.9430, 6.9583],
  'köln|neumarkt': [50.9367, 6.9500],
  'köln|ebertplatz': [50.9479, 6.9580],
  'köln|altstadt': [50.9384, 6.9590],
  // Frankfurt
  'frankfurt|bahnhofsviertel': [50.1075, 8.6680],
  'frankfurt|konstablerwache': [50.1146, 8.6855],
  'frankfurt|hauptbahnhof': [50.1075, 8.6638],
  // Stuttgart
  'stuttgart|schlossplatz': [48.7783, 9.1800],
  // Düsseldorf
  'düsseldorf|worringer platz': [51.2299, 6.7900],
  'düsseldorf|altstadt': [51.2270, 6.7740],
  // Leipzig
  'leipzig|eisenbahnstraße': [51.3450, 12.4030],
  // Bremen
  'bremen|bahnhofsvorstadt': [53.0832, 8.8132],
  // Hannover
  'hannover|steintor': [52.3760, 9.7330],
  // Dortmund
  'dortmund|nordstadt': [51.5260, 7.4607],
  // Essen
  'essen|altendorf': [51.4540, 6.9870],
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, (m) => m) // keep umlauts as-is
    .trim();

export const getCoords = (
  city: string,
  area?: string
): [number, number] | null => {
  if (city && area) {
    const key = `${norm(city)}|${norm(area)}`;
    if (AREA_COORDS[key]) return AREA_COORDS[key];
  }
  if (city && CITY_COORDS[city]) return CITY_COORDS[city];

  // Case-insensitive fallback for city
  const cityKey = Object.keys(CITY_COORDS).find(
    (k) => k.toLowerCase() === city.toLowerCase()
  );
  if (cityKey) return CITY_COORDS[cityKey];

  return null;
};

// Add small jitter so multiple markers in the same city don't overlap perfectly
export const jitter = (
  coords: [number, number],
  seed: string
): [number, number] => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const dx = ((h & 0xff) / 255 - 0.5) * 0.012;
  const dy = (((h >> 8) & 0xff) / 255 - 0.5) * 0.012;
  return [coords[0] + dx, coords[1] + dy];
};
