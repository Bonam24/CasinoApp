import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = cookies(); // No need to await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_ANON_KEY,
    {
      cookies: {
        getAll: async () => {
          try {
            return await cookieStore.getAll(); // Ensure async
          } catch (error) {
            console.error('🔴 Error getting cookies:', error);
            return [];
          }
        },
        setAll: async (cookiesToSet) => {
          try {
            for (const { name, value, options } of cookiesToSet) {
              await cookieStore.set(name, value, options); // Ensure async
            }
          } catch (error) {
            console.warn('⚠️ Skipping setAll due to server environment.', error);
          }
        },
      },
    }
  );
}
