import { createClient } from "@supabase/supabase-js";

export function buatClientServer() {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error(
      "Environment variable SUPABASE_URL dan SUPABASE_SECRET_KEY belum diatur."
    );
  }

  return createClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
