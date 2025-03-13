// src/utils/supabaseClient.js
/*import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(`Supabase URL IS ${supabaseUrl} and/or API key is ${supabaseKey} are missing. Check your environment variables.`);
}

export const supabase = createClient(supabaseUrl, supabaseKey);*/

import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      cookieOptions: { 
        domain: '.bundlesbets.casino',  // Ensure cookies work across subdomains
        path: '/',
        secure: true,  // Enforce HTTPS
        sameSite: 'Lax', // Allows session sharing across subdomains
      },
    },
  }
);


