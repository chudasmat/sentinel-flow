const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const BASTION_BASE = "http://bastion.iammik.us";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const bastionPath = body.path || "/health";
    const payload = body.payload;

    const bastionUrl = `${BASTION_BASE}${bastionPath}`;

    const fetchOptions: RequestInit = {
      headers: { "Content-Type": "application/json" },
    };

    if (payload) {
      fetchOptions.method = "POST";
      fetchOptions.body = JSON.stringify(payload);
    } else {
      fetchOptions.method = "GET";
    }

    const response = await fetch(bastionUrl, fetchOptions);
    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Bastion proxy error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
