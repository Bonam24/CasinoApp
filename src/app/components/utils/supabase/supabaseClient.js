// src/utils/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_DATABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(`Supabase URL IS ${supabaseUrl} and/or API key is ${supabaseKey} are missing. Check your environment variables.`);
}

export const supabase = createClient(supabaseUrl, supabaseKey);