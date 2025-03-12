// pages/api/signup.js
import { createClient } from "@supabase/supabase-js";

import { supabase } from "@/app/components/utils/supabase/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { firstName, lastName, email, country, dob, password } = req.body;

  if (!firstName || !lastName || !email || !country || !dob || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Insert additional user information into the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: authData.user.id, // Use the user ID from the auth response
          first_name: firstName,
          last_name: lastName,
          email,
          country,
          dob,
          balance: 0.0, // Set the balance to 0 upon signup
        },
      ]);

    if (profileError) {
      return res.status(400).json({ error: profileError.message });
    }

    res.status(200).json({ message: "Signup successful", user: authData.user });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Failed to sign up" });
  }
}