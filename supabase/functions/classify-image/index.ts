import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();
    if (!image) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `You are a campus infrastructure issue classifier. Analyze the image and classify it into exactly one category and priority.

Categories: electrical, plumbing, furniture, cleanliness, network, security, other
Priorities: low, medium, high, critical
Departments: Maintenance, Housekeeping, IT, Security, General

Rules:
- electrical (fans, lights, switches, wiring) → Maintenance
- plumbing (water, leaks, taps, pipes) → Maintenance  
- furniture (chairs, desks, doors, windows) → Maintenance
- cleanliness (dirt, garbage, stains) → Housekeeping
- network (wifi, cables, routers, computers) → IT
- security (locks, gates, CCTV, broken entry) → Security
- other → General

For priority: critical = safety hazard, high = blocks usage, medium = inconvenience, low = cosmetic`,
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Classify this campus infrastructure image. What issue category, priority, and department does it belong to? Also provide a short one-line description of the issue.",
                },
                {
                  type: "image_url",
                  image_url: { url: image },
                },
              ],
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "classify_issue",
                description:
                  "Classify an infrastructure issue from an image",
                parameters: {
                  type: "object",
                  properties: {
                    category: {
                      type: "string",
                      enum: [
                        "electrical",
                        "plumbing",
                        "furniture",
                        "cleanliness",
                        "network",
                        "security",
                        "other",
                      ],
                    },
                    priority: {
                      type: "string",
                      enum: ["low", "medium", "high", "critical"],
                    },
                    department: {
                      type: "string",
                      enum: [
                        "Maintenance",
                        "Housekeeping",
                        "IT",
                        "Security",
                        "General",
                      ],
                    },
                    description: {
                      type: "string",
                      description: "Short one-line description of the issue",
                    },
                  },
                  required: [
                    "category",
                    "priority",
                    "department",
                    "description",
                  ],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "classify_issue" },
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error("AI classification failed");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No classification result returned");

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("classify-image error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
