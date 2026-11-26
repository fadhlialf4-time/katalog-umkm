"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { loginAdmin } from "@/app/admin/actions";

export default function FormLogin() {
  const [state, aksiLogin, sedangProses] = useActionState(loginAdmin, null);

  return (
    <form action={aksiLogin} className="flex flex-col gap-4">
      <Input label="Email" name="email" type="email" autoComplete="email" required />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      {state?.error && (
        <p
          role="alert"
          className="rounded-lg border border-bahaya bg-latar px-3 py-2 text-sm text-bahaya"
        >
          {state.error}
        </p>
      )}
      <Tombol type="submit" disabled={sedangProses}>
        {sedangProses ? "Memproses..." : "Masuk"}
      </Tombol>
    </form>
  );
}
