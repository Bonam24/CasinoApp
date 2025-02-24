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

  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
    //added code
    fname : formData.get('fname'),
    lname : formData.get('lname'),
    dob: formData.get('dob'),
    phone: formData.get('phone'),
  };

  const { data: signUpData, error } = await supabase.auth.signUp(data);

  if (error) {
    console.error('Signup error:', error.message);
    return { error };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

