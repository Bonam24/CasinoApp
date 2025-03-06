import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  try {
    const cookieStore = await cookies(); // Ensure `cookies()` is awaited

    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY,
      {
        cookies: {
          getAll: async () => {
            try {
              return cookieStore.getAll(); // No need to await here
            } catch (error) {
              console.error('🔴 Error getting cookies:', error);
              return [];
            }
          },
          setAll: async (cookiesToSet) => {
            try {
              for (const { name, value, options } of cookiesToSet) {
                await cookieStore.set(name, value, options);
              }
            } catch (error) {
              console.warn('⚠️ Skipping setAll due to server environment.', error);
            }
          },
        },
      }
    );
  } catch (error) {
    console.error('🔴 Error initializing Supabase client:', error);
    return null;
  }
}
