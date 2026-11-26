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

export async function gantiPassword(_stateSebelumnya, formData) {
  const passwordBaru = String(formData.get("password_baru") ?? "");
  const konfirmasi = String(formData.get("konfirmasi_password") ?? "");

  if (passwordBaru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (passwordBaru !== konfirmasi) {
    return { error: "Konfirmasi password tidak sama dengan password baru." };
  }

  try {
    const supabase = await buatClientSesi();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { error: "Sesi tidak valid. Silakan masuk kembali sebagai admin." };
    }

    const { error } = await supabase.auth.updateUser({
      password: passwordBaru,
    });

    if (error) {
      console.error("Gagal mengganti password:", error);
      if (error.code === "same_password") {
        return { error: "Password baru harus berbeda dari password saat ini." };
      }
      return { error: "Gagal mengganti password. Silakan coba lagi." };
    }

    return { sukses: "Password berhasil diganti." };
  } catch (err) {
    console.error("Gagal terhubung saat mengganti password:", err);
    return {
      error: "Gagal terhubung ke server autentikasi. Pastikan konfigurasi koneksi sudah benar.",
    };
  }
}
