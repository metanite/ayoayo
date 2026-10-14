"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { BusinessHours, BusinessStatus } from "@/lib/types";

type Option = { id: string; name: string; slug: string; type?: string };
type Shop = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  location_id: string;
  location?: { id: string; name: string; slug: string };
  barangay: string | null;
  address: string;
  phone: string | null;
  website: string | null;
  facebook: string | null;
  instagram: string | null;
  hours: BusinessHours;
  status: BusinessStatus;
  verified: boolean;
  featured: boolean;
  serviceIds: string[];
  created_at: string;
  updated_at: string;
  latitude: number | null;
  longitude: number | null;
};

type ShopForm = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  locationId: string;
  barangay: string;
  address: string;
  phone: string;
  website: string;
  facebook: string;
  instagram: string;
  hours: BusinessHours;
  latitude: string;
  longitude: string;
  status: BusinessStatus;
  verified: boolean;
  featured: boolean;
  serviceIds: string[];
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const statuses: BusinessStatus[] = ["draft", "published", "unpublished", "flagged"];

function emptyForm(): ShopForm {
  return {
    slug: "",
    name: "",
    tagline: "",
    description: "",
    locationId: "",
    barangay: "",
    address: "",
    phone: "",
    website: "",
    facebook: "",
    instagram: "",
    hours: Object.fromEntries(days.map((day) => [day, ""])) as BusinessHours,
    latitude: "",
    longitude: "",
    status: "draft",
    verified: false,
    featured: false,
    serviceIds: [],
  };
}

function toForm(shop: Shop): ShopForm {
  return {
    slug: shop.slug,
    name: shop.name,
    tagline: shop.tagline ?? "",
    description: shop.description ?? "",
    locationId: shop.location_id,
    barangay: shop.barangay ?? "",
    address: shop.address,
    phone: shop.phone ?? "",
    website: shop.website ?? "",
    facebook: shop.facebook ?? "",
    instagram: shop.instagram ?? "",
    hours: Object.fromEntries(days.map((day) => [day, shop.hours?.[day] ?? ""])) as BusinessHours,
    latitude: shop.latitude?.toString() ?? "",
    longitude: shop.longitude?.toString() ?? "",
    status: shop.status,
    verified: shop.verified,
    featured: shop.featured,
    serviceIds: shop.serviceIds,
  };
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function AdminDashboard({ adminName }: { adminName: string }) {
  const router = useRouter();
  const [shops, setShops] = useState<Shop[]>([]);
  const [services, setServices] = useState<Option[]>([]);
  const [locations, setLocations] = useState<Option[]>([]);
  const [form, setForm] = useState<ShopForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const response = await fetch("/api/admin/shops", { cache: "no-store" });
    if (response.status === 401) {
      router.replace("/admin/login");
      return;
    }
    const data = await response.json();
    if (!response.ok) setError(data.error ?? "Unable to load shops.");
    else {
      setShops(data.shops ?? []);
      setServices(data.services ?? []);
      setLocations(data.locations ?? []);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredShops = useMemo(
    () => shops.filter((shop) => `${shop.name} ${shop.location?.name ?? ""} ${shop.status}`.toLowerCase().includes(query.toLowerCase())),
    [shops, query],
  );

  function update<K extends keyof ShopForm>(key: K, value: ShopForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function startNew() {
    setEditingId(null);
    setForm(emptyForm());
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startEdit(shop: Shop) {
    setEditingId(shop.id);
    setForm(toForm(shop));
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    const response = await fetch(editingId ? `/api/admin/shops/${editingId}` : "/api/admin/shops", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, latitude: form.latitude || null, longitude: form.longitude || null }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) setError(data?.error ?? "Unable to save shop.");
    else {
      setMessage(editingId ? "Shop updated." : "Shop added.");
      setEditingId(null);
      setForm(emptyForm());
      await load();
    }
    setSaving(false);
  }

  async function remove(shop: Shop) {
    if (!window.confirm(`Remove ${shop.name}? This cannot be undone.`)) return;
    const response = await fetch(`/api/admin/shops/${shop.id}`, { method: "DELETE" });
    const data = await response.json().catch(() => null);
    if (!response.ok) setError(data?.error ?? "Unable to remove shop.");
    else {
      setMessage("Shop removed.");
      if (editingId === shop.id) startNew();
      await load();
    }
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    const { getSupabaseClient } = await import("@/lib/supabase");
    await getSupabaseClient()?.auth.signOut();
    router.replace("/admin/login");
  }

  return (
    <main className="min-h-screen bg-cloud">
      <section className="border-b border-ink/10 bg-white">
        <div className="container-shell flex flex-col justify-between gap-5 py-8 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">ayoayo.ph / private</p>
            <h1 className="mt-2 text-4xl font-bold tracking-[-0.06em]">Shop directory</h1>
            <p className="mt-2 text-sm text-ink/55">Signed in as {adminName}. Manage every public listing detail from one place.</p>
          </div>
          <button type="button" onClick={logout} className="button-dark self-start sm:self-auto">Sign out</button>
        </div>
      </section>

      <div className="container-shell grid gap-8 py-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(380px,0.9fr)] lg:items-start">
        <section className="rounded-3xl border border-ink/10 bg-white p-5 shadow-soft sm:p-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="eyebrow">{editingId ? "Edit listing" : "New listing"}</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">{editingId ? "Update shop details" : "Add a repair shop"}</h2>
            </div>
            {editingId && <button type="button" onClick={startNew} className="text-sm font-semibold text-ink/55 hover:text-coral">Cancel edit</button>}
          </div>
          {message && <p className="mt-5 rounded-xl bg-lime/60 px-4 py-3 text-sm font-medium text-forest">{message}</p>}
          {error && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <form onSubmit={save} className="mt-6 space-y-7">
            <fieldset className="grid gap-4 sm:grid-cols-2">
              <legend className="mb-3 text-sm font-bold text-ink">Identity</legend>
              <label className="text-sm font-semibold">Shop name *<input required value={form.name} onChange={(e) => { update("name", e.target.value); if (!editingId) update("slug", slugify(e.target.value)); }} className="admin-input" /></label>
              <label className="text-sm font-semibold">URL slug *<input required value={form.slug} onChange={(e) => update("slug", slugify(e.target.value))} className="admin-input" /></label>
              <label className="text-sm font-semibold sm:col-span-2">Tagline<input value={form.tagline} onChange={(e) => update("tagline", e.target.value)} className="admin-input" /></label>
              <label className="text-sm font-semibold sm:col-span-2">Description<textarea rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} className="admin-input" /></label>
            </fieldset>

            <fieldset className="grid gap-4 sm:grid-cols-2">
              <legend className="mb-3 text-sm font-bold text-ink">Location and contact</legend>
              <label className="text-sm font-semibold">City / municipality *<select required value={form.locationId} onChange={(e) => update("locationId", e.target.value)} className="admin-input"><option value="">Select a location</option>{locations.map((item) => <option key={item.id} value={item.id}>{item.name} {item.type ? `(${item.type})` : ""}</option>)}</select></label>
              <label className="text-sm font-semibold">Barangay<input value={form.barangay} onChange={(e) => update("barangay", e.target.value)} className="admin-input" /></label>
              <label className="text-sm font-semibold sm:col-span-2">Street address *<input required value={form.address} onChange={(e) => update("address", e.target.value)} className="admin-input" /></label>
              <label className="text-sm font-semibold">Phone<input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="admin-input" /></label>
              <label className="text-sm font-semibold">Website<input type="url" value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="https://" className="admin-input" /></label>
              <label className="text-sm font-semibold">Facebook<input type="url" value={form.facebook} onChange={(e) => update("facebook", e.target.value)} placeholder="https://facebook.com/" className="admin-input" /></label>
              <label className="text-sm font-semibold">Instagram<input type="url" value={form.instagram} onChange={(e) => update("instagram", e.target.value)} placeholder="https://instagram.com/" className="admin-input" /></label>
              <label className="text-sm font-semibold">Latitude<input type="number" step="any" value={form.latitude} onChange={(e) => update("latitude", e.target.value)} className="admin-input" /></label>
              <label className="text-sm font-semibold">Longitude<input type="number" step="any" value={form.longitude} onChange={(e) => update("longitude", e.target.value)} className="admin-input" /></label>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-sm font-bold text-ink">Services</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {services.map((service) => <label key={service.id} className="flex items-center gap-3 rounded-xl border border-ink/10 px-3 py-2.5 text-sm font-medium hover:bg-cloud"><input type="checkbox" checked={form.serviceIds.includes(service.id)} onChange={(e) => update("serviceIds", e.target.checked ? [...form.serviceIds, service.id] : form.serviceIds.filter((id) => id !== service.id))} className="h-4 w-4 accent-coral" />{service.name}</label>)}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-sm font-bold text-ink">Opening hours</legend>
              <div className="space-y-2">
                {days.map((day) => <label key={day} className="grid grid-cols-[100px_1fr] items-center gap-3 text-sm font-medium"><span>{day}</span><input value={form.hours[day] ?? ""} onChange={(e) => update("hours", { ...form.hours, [day]: e.target.value })} placeholder="9:00 AM–6:00 PM or Closed" className="admin-input mt-0" /></label>)}
              </div>
            </fieldset>

            <fieldset className="grid gap-4 sm:grid-cols-3">
              <legend className="mb-3 text-sm font-bold text-ink sm:col-span-3">Publishing</legend>
              <label className="text-sm font-semibold">Status<select value={form.status} onChange={(e) => update("status", e.target.value as BusinessStatus)} className="admin-input">{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
              <label className="flex items-center gap-3 self-end pb-3 text-sm font-semibold"><input type="checkbox" checked={form.verified} onChange={(e) => update("verified", e.target.checked)} className="h-4 w-4 accent-coral" />Verified</label>
              <label className="flex items-center gap-3 self-end pb-3 text-sm font-semibold"><input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} className="h-4 w-4 accent-coral" />Featured</label>
            </fieldset>
            <button type="submit" disabled={saving} className="button-lime w-full disabled:cursor-wait disabled:opacity-60">{saving ? "Saving…" : editingId ? "Save shop changes" : "Add shop"}</button>
          </form>
        </section>

        <section className="rounded-3xl border border-ink/10 bg-white p-5 shadow-soft sm:p-7">
          <div className="flex items-end justify-between gap-4">
            <div><p className="eyebrow">Directory records</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">{shops.length} shops</h2></div>
            <button type="button" onClick={startNew} className="button-dark px-4 py-2.5">+ Add shop</button>
          </div>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search shops…" className="admin-input mt-5" />
          {loading ? <p className="py-10 text-center text-sm text-ink/50">Loading shops…</p> : filteredShops.length === 0 ? <p className="py-10 text-center text-sm text-ink/50">No shops match this search.</p> : <div className="mt-5 space-y-3">{filteredShops.map((shop) => <article key={shop.id} className="rounded-2xl border border-ink/10 p-4"><div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold">{shop.name}</h3><p className="mt-1 text-xs text-ink/50">{shop.location?.name ?? "No location"}{shop.barangay ? ` · ${shop.barangay}` : ""}</p></div><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${shop.status === "published" ? "bg-lime text-forest" : "bg-cloud text-ink/55"}`}>{shop.status}</span></div><div className="mt-4 flex gap-3 text-sm"><button type="button" onClick={() => startEdit(shop)} className="font-semibold text-ink hover:text-coral">Edit</button><button type="button" onClick={() => remove(shop)} className="font-semibold text-red-600 hover:text-red-800">Remove</button></div></article>)}</div>}
        </section>
      </div>
    </main>
  );
}
