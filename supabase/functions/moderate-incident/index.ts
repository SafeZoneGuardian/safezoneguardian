import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ModerationRequest {
  city: string;
  area: string;
  incident_type: string;
  severity: string;
  description: string;
}

interface ModerationResult {
  decision: "approved" | "rejected" | "pending";
  confidence: number;
  reason: string;
}

const FORBIDDEN_PATTERNS = [
  /\b(nazi|hitler|fascist)\b/i,
  /\b(n[i1]gg[e3]r)\b/i,
  /\b(schl[a4]mpe|h[uo]r[e3]|nutte)\b/i,
  /\b(r[a4]ss[i1]st|f[a4]s[i1]st)\b/i,
];

const SPAM_PATTERNS = [
  /(.)\1{9,}/,
  /^.{0,4}$/,
  /http[s]?:\/\//i,
];

function moderateIncident(req: ModerationRequest): ModerationResult {
  const { city, area, description, incident_type, severity } = req;

  const fullText = `${city} ${area} ${description}`;
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(fullText)) {
      return {
        decision: "rejected",
        confidence: 0.95,
        reason: "Die Meldung enthaelt unzulaessige oder diskriminierende Inhalte.",
      };
    }
  }

  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(description)) {
      return {
        decision: "rejected",
        confidence: 0.8,
        reason: "Die Beschreibung ist zu kurz oder wirkt wie Spam.",
      };
    }
  }

  const validTypes = [
    "Taschendiebstahl",
    "Aggression",
    "Raub",
    "Betrug",
    "Vandalismus",
    "Sonstiges",
  ];
  if (!validTypes.includes(incident_type)) {
    return {
      decision: "rejected",
      confidence: 0.9,
      reason: "Ungueltiger Vorfalltyp.",
    };
  }

  const validSeverities = ["Niedrig", "Mittel", "Hoch"];
  if (!validSeverities.includes(severity)) {
    return {
      decision: "rejected",
      confidence: 0.9,
      reason: "Ungueltiger Schweregrad.",
    };
  }

  if (description.trim().length < 10) {
    return {
      decision: "pending",
      confidence: 0.4,
      reason: "Beschreibung ist sehr kurz. Manuelle Pruefung empfohlen.",
    };
  }

  if (city.trim().length < 2) {
    return {
      decision: "pending",
      confidence: 0.3,
      reason: "Stadtname unklar. Manuelle Pruefung empfohlen.",
    };
  }

  return {
    decision: "approved",
    confidence: 0.85,
    reason:
      "Die Meldung erscheint plausibel und respektvoll. Sie wurde automatisch freigegeben.",
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const body: ModerationRequest = await req.json();

    if (!body.city || !body.area || !body.description) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: city, area, description",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const result = moderateIncident(body);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Moderation error:", error);
    return new Response(
      JSON.stringify({
        decision: "pending",
        confidence: 0.0,
        reason: "Fehler bei der KI-Moderation. Manuelle Pruefung erforderlich.",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
