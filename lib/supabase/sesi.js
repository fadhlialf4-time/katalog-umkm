import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function buatClientSesi() {
  const url = process.env.SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Environment variable SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY belum diatur."
    );
  }

  const cookieStore = await cookies();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Di Server Component, penulisan cookie diabaikan karena penyegaran sesi ditangani oleh proxy.js.
        }
      },
    },
  });
}
