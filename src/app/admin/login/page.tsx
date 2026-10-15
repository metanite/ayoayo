"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const client = getSupabaseClient();
    if (!client) {
      setError("Admin access is not configured yet.");
      setLoading(false);
      return;
    }
    const { data, error: signInError } = await client.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (signInError || !data.session) {
      setError(signInError?.message ?? "Unable to sign in.");
      setLoading(false);
      return;
    }
    const sessionResponse = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken: data.session.access_token }),
    });
    if (!sessionResponse.ok) {
      await client.auth.signOut();
      const result = await sessionResponse.json().catch(() => null);
      setError(result?.error ?? "This account does not have admin access.");
      setLoading(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="hero-section min-h-[70vh] border-b border-ink/10">
      <div className="container-shell flex min-h-[70vh] items-center justify-center py-12">
        <form
          onSubmit={submit}
          className="w-full max-w-md rounded-3xl border border-ink/10 bg-white p-7 shadow-soft sm:p-9"
        >
          <p className="eyebrow">Private workspace</p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.06em]">Admin dashboard</h1>
          <label className="mt-7 block text-sm font-semibold text-ink">
            Username
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              className="mt-2 w-full rounded-xl border border-ink/15 bg-cloud px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/10"
            />
          </label>
          <label className="mt-7 block text-sm font-semibold text-ink">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              className="mt-2 w-full rounded-xl border border-ink/15 bg-cloud px-4 py-3 text-sm outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/10"
            />
          </label>
          {error && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="button-dark mt-6 w-full disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
