'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '../../components/utils/supabase/supabaseServerClient';

export async function login(formData) {
  const supabase = await createClient();

  const email = formData.get('email');
  const password = formData.get('password');

  console.log('🟢 Attempting login:', email);

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('🔴 Login error:', error); // Debugging
    return redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  console.log('✅ Login success:', data);
  revalidatePath('/', 'layout');
  redirect('/differentPages/dashboard');
}

export async function signup(formData) {
  const supabase = await createClient();

  // Extract form data
  const email = formData.get('email');
  const password = formData.get('password');
  const firstName = formData.get('firstName');
  const lastName = formData.get('lastName');
  const dob = formData.get('dob');
  const country = formData.get('country');

  console.log('🟢 Attempting signup:', email);

  // Step 1: Sign up the user in Supabase Auth
  const { data: signUpData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    console.error('🔴 Signup error:', authError.message);
    return { error: authError };
  }

  console.log('✅ Auth signup success:', signUpData);

  // Step 2: Insert additional user data into the `profiles` table
  if (signUpData.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          user_id: signUpData.user.id, // Link to the auth user
          first_name: firstName,
          last_name: lastName,
          email: email, // Optional: Store email in profiles table for easy access
          dob: dob,
          country: country,
          balance: 0.00, // Set the balance to 0 upon signup
        },
      ]);

    if (profileError) {
      console.error('🔴 Profile insertion error:', profileError.message);

      // Optional: Delete the user from auth if profile insertion fails
      await supabase.auth.admin.deleteUser(signUpData.user.id);

      return { error: profileError };
    }

    console.log('✅ Profile insertion success');
  }

  // Revalidate and redirect
  revalidatePath('/', 'layout');
  redirect('/');
}
export async function logout() {
  const supabase = await createClient();

  // Sign out the user
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('🔴 Logout error:', error.message);
    return { error: error.message };
  }

  // Redirect to the login page
  redirect('/');
}