import { createClient } from "@supabase/supabase-js";

// ✅ Initialize Supabase inside the function to avoid "supabase is not defined" error
export async function POST(req) {
  // Initialize Supabase client here
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON
  );

  try {
    console.log("Received POST request at /api/dashboardBackend");

    // Get the request JSON body
    const body = await req.json();
    console.log("Request body:", body);

    // Verify authentication using the Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Missing Authorization header.");
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    // ✅ Validate token with Supabase
    console.log("Verifying token...");
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error("Invalid session:", error);
      return new Response(JSON.stringify({ error: "Invalid session" }), { status: 401 });
    }

    console.log("Fetching user profile...");
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("first_name, balance")
      .eq("id", user.id)
      .single();

    if (profileError) throw profileError;

    console.log("Profile fetched:", profile);

    return new Response(
      JSON.stringify({
        firstName: profile.first_name || "Guest",
        balance: profile.balance || 0,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Internal Server Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
