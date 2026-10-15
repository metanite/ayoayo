"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

const navigation = [
  { href: "/admin", label: "Overview", icon: "grid" },
  { href: "/admin/shops", label: "All shops", icon: "store" },
  { href: "/admin/shops/new", label: "Add new shop", icon: "plus" },
  { href: "/admin/services", label: "Services", icon: "tag" },
] as const;

function NavIcon({ icon }: { icon: (typeof navigation)[number]["icon"] }) {
  if (icon === "plus") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <path
          d="M12 5v14M5 12h14"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (icon === "store") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <path
          d="M4 10.5h16v8.25A1.25 1.25 0 0 1 18.75 20h-13.5A1.25 1.25 0 0 1 4 18.75V10.5ZM3 10.5l1.75-5h14.5l1.75 5M8 10.5V20m8-9.5V20"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
      </svg>
    );
  }

  if (icon === "tag") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
        <path
          d="M4 5.75A1.75 1.75 0 0 1 5.75 4h5.1a2 2 0 0 1 1.42.59l6.14 6.14a2 2 0 0 1 0 2.83l-4.85 4.85a2 2 0 0 1-2.83 0L4.59 12.42A2 2 0 0 1 4 11V5.75Z"
          fill="none"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
        <circle cx="8" cy="8" r="1.25" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <rect x="4" y="4" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="14" y="4" width="6" height="6" rx="1" fill="currentColor" opacity=".55" />
      <rect x="4" y="14" width="6" height="6" rx="1" fill="currentColor" opacity=".55" />
      <rect x="14" y="14" width="6" height="6" rx="1" fill="currentColor" />
    </svg>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ adminName, children }: { adminName: string; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    const { getSupabaseClient } = await import("@/lib/supabase");
    await getSupabaseClient()?.auth.signOut();
    router.replace("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#f5f6f4] text-ink lg:flex">
      <aside className="hidden w-56 shrink-0 flex-col bg-forest text-white lg:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <Link href="/admin" className="inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime text-lg font-black text-forest">
              a
            </span>
            <span>
              <span className="block text-lg font-bold tracking-[-0.05em]">ayoayo.ph</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                Admin workspace
              </span>
            </span>
          </Link>
        </div>

        <nav aria-label="Admin navigation" className="flex-1 px-3 py-5">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
            Manage directory
          </p>
          <div className="mt-3 space-y-1">
            {navigation.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${active ? "bg-white text-forest" : "text-white/65 hover:bg-white/10 hover:text-white"}`}
                >
                  <NavIcon icon={item.icon} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-white/10 p-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-coral text-sm font-bold text-white">
              {adminName.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{adminName}</p>
              <p className="text-xs text-white/45">Administrator</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
              <path
                d="M10 5H6.75A1.75 1.75 0 0 0 5 6.75v10.5A1.75 1.75 0 0 0 6.75 19H10m5-4 4-3-4-3m4 3H10"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="border-b border-white/10 bg-forest px-3 py-3 text-white lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <Link href="/admin" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime text-lg font-black text-forest">
                a
              </span>
              <span className="text-base font-bold tracking-[-0.04em]">ayoayo.ph</span>
            </Link>
            <button
              type="button"
              onClick={logout}
              className="text-xs font-semibold text-white/70 hover:text-white"
            >
              Sign out
            </button>
          </div>
          <nav aria-label="Admin navigation" className="mt-4 grid grid-cols-4 gap-1.5">
            {navigation.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-2 py-2.5 text-center text-xs font-semibold ${active ? "bg-white text-forest" : "bg-white/10 text-white/70"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        {children}
      </div>
    </div>
  );
}
