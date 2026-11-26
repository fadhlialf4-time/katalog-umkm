"use server";

import { redirect } from "next/navigation";
import { buatClientSesi } from "@/lib/supabase/sesi";

export async function loginAdmin(_stateSebelumnya, formData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  let pesanError = null;

  try {
    const supabase = await buatClientSesi();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      pesanError = "Email atau password salah. Silakan periksa kembali dan coba lagi.";
    }
  } catch (err) {
    console.error("Gagal memproses login admin:", err);
    pesanError =
      "Gagal terhubung ke server autentikasi. Pastikan konfigurasi koneksi sudah benar.";
  }

  if (pesanError) {
    return { error: pesanError };
  }

  redirect("/admin");
}

export async function keluarAdmin() {
  try {
    const supabase = await buatClientSesi();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Gagal memproses keluar admin:", err);
  }

  redirect("/admin/login");
}
