"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import cebuAddresses from "@/lib/cebu-addresses.json";
import type { BusinessHours, BusinessStatus } from "@/lib/types";
import { AdminShell } from "@/components/admin-shell";

type Option = { id: string; name: string; slug: string; type?: string };
export type Shop = {
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

export type ShopForm = {
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

function normalizeAddressName(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getCebuLocationOptions(locations: Option[]) {
  const locationsBySlug = new Map(locations.map((location) => [location.slug, location]));
  return cebuAddresses.municipalities
    .map(
      (location) =>
        locationsBySlug.get(location.slug) ?? {
          id: location.slug,
          name: location.name,
          slug: location.slug,
          type: location.type,
        },
    )
    .sort((first, second) => first.name.localeCompare(second.name));
}

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
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="border-b border-ink/10 bg-white">
      <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-4 px-4 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-end lg:px-8">
        <div className="min-w-0">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-1.5 text-2xl font-bold tracking-[-0.06em] text-ink sm:text-3xl">
            {title}
          </h1>
          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-ink/55 sm:text-sm">{description}</p>
        </div>
        {action}
      </div>
    </header>
  );
}

function useAdminData() {
  const router = useRouter();
  const [shops, setShops] = useState<Shop[]>([]);
  const [services, setServices] = useState<Option[]>([]);
  const [locations, setLocations] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/shops", { cache: "no-store" });
    if (response.status === 401) {
      router.replace("/admin/login");
      return;
    }
    const data = await response.json().catch(() => null);
    if (!response.ok) setError(data?.error ?? "Unable to load shop data.");
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

  return { shops, services, locations, loading, error, load };
}

export function AdminDashboard({ adminName }: { adminName: string }) {
  const { shops, loading, error } = useAdminData();
  const published = shops.filter((shop) => shop.status === "published").length;
  const drafts = shops.filter((shop) => shop.status === "draft").length;
  const featured = shops.filter((shop) => shop.featured).length;

  return (
    <AdminShell adminName={adminName}>
      <AdminPageHeader
        eyebrow="Private workspace"
        title="Directory overview"
        description={`Welcome back, ${adminName}. Keep your local tech-repair directory accurate and up to date.`}
        action={
          <Link href="/admin/shops/new" className="button-lime shrink-0">
            + Add new shop
          </Link>
        }
      />
      <main className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        {error && (
          <p className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total shops"
            value={loading ? "—" : shops.length.toString()}
            detail="All directory records"
            tone="dark"
          />
          <StatCard
            label="Published"
            value={loading ? "—" : published.toString()}
            detail="Visible on ayoayo.ph"
            tone="lime"
          />
          <StatCard
            label="Needs attention"
            value={loading ? "—" : drafts.toString()}
            detail="Draft listings"
            tone="paper"
          />
          <StatCard
            label="Featured"
            value={loading ? "—" : featured.toString()}
            detail="Promoted listings"
            tone="paper"
          />
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(280px,.75fr)]">
          <section className="rounded-2xl border border-ink/10 bg-white p-4 shadow-soft sm:p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Latest records</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                  Recently added shops
                </h2>
              </div>
              <Link href="/admin/shops" className="text-sm font-bold text-coral hover:text-ink">
                View all
              </Link>
            </div>
            {loading ? (
              <p className="py-12 text-center text-sm text-ink/50">Loading shops…</p>
            ) : shops.length === 0 ? (
              <EmptyState text="No shops have been added yet." href="/admin/shops/new" />
            ) : (
              <div className="mt-5 divide-y divide-ink/10">
                {shops.slice(0, 5).map((shop) => (
                  <ShopRow key={shop.id} shop={shop} />
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-ink/10 bg-forest p-5 text-white shadow-soft sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-lime">
              Quick start
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">Grow the directory</h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              Add complete, verified listings so people can find reliable repair help nearby.
            </p>
            <Link
              href="/admin/shops/new"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-lime px-4 py-3 text-sm font-bold text-forest transition hover:bg-white"
            >
              Add a shop <span aria-hidden="true">→</span>
            </Link>
          </section>
        </div>
      </main>
    </AdminShell>
  );
}

function StatCard({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  tone: "dark" | "lime" | "paper";
}) {
  const styles =
    tone === "dark"
      ? "bg-forest text-white"
      : tone === "lime"
        ? "bg-lime text-forest"
        : "border border-ink/10 bg-white text-ink";
  return (
    <article className={`rounded-xl p-4 shadow-soft ${styles}`}>
      <p className={`text-[11px] font-semibold ${tone === "paper" ? "text-ink/50" : "opacity-65"}`}>
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold tracking-[-0.06em]">{value}</p>
      <p className={`mt-1 text-[11px] ${tone === "paper" ? "text-ink/45" : "opacity-60"}`}>
        {detail}
      </p>
    </article>
  );
}

function ShopRow({ shop }: { shop: Shop }) {
  return (
    <Link
      href={`/admin/shops/${shop.id}`}
      className="flex min-w-0 items-center justify-between gap-4 py-4 first:pt-2 last:pb-2"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{shop.name}</p>
        <p className="mt-1 truncate text-xs text-ink/50">
          {shop.location?.name ?? "No location"}
          {shop.barangay ? ` · ${shop.barangay}` : ""}
        </p>
      </div>
      <StatusPill status={shop.status} />
    </Link>
  );
}

function StatusPill({ status }: { status: BusinessStatus }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${status === "published" ? "bg-lime text-forest" : status === "flagged" ? "bg-red-100 text-red-700" : "bg-cloud text-ink/55"}`}
    >
      {status}
    </span>
  );
}

function EmptyState({ text, href }: { text: string; href: "/admin/shops/new" | "/admin/shops" }) {
  return (
    <div className="py-12 text-center">
      <p className="text-sm text-ink/50">{text}</p>
      <Link href={href} className="mt-3 inline-block text-sm font-bold text-coral">
        Add the first shop
      </Link>
    </div>
  );
}

export function AdminShopList({ adminName }: { adminName: string }) {
  const router = useRouter();
  const { shops, loading, error, load } = useAdminData();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [actionError, setActionError] = useState("");

  const filteredShops = useMemo(
    () =>
      shops.filter((shop) => {
        const matchesQuery = `${shop.name} ${shop.location?.name ?? ""} ${shop.barangay ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase());
        return matchesQuery && (status === "all" || shop.status === status);
      }),
    [shops, query, status],
  );

  async function remove(shop: Shop) {
    if (!window.confirm(`Remove ${shop.name}? This cannot be undone.`)) return;
    const response = await fetch(`/api/admin/shops/${shop.id}`, { method: "DELETE" });
    const data = await response.json().catch(() => null);
    if (!response.ok) setActionError(data?.error ?? "Unable to remove shop.");
    else await load();
  }

  return (
    <AdminShell adminName={adminName}>
      <AdminPageHeader
        eyebrow="Directory records"
        title="All shops"
        description="Search, review, and update every repair shop listed on ayoayo.ph"
        action={
          <Link href="/admin/shops/new" className="button-lime shrink-0">
            + Add new shop
          </Link>
        }
      />
      <main className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        {(error || actionError) && (
          <p className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error || actionError}
          </p>
        )}
        <section className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-soft">
          <div className="flex flex-col gap-3 border-b border-ink/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <p className="text-sm font-semibold text-ink/50">Directory total</p>
              <p className="mt-1 text-3xl font-bold tracking-[-0.05em]">
                {loading ? "—" : shops.length}{" "}
                <span className="text-base font-medium text-ink/45">shops</span>
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_150px]">
              <label className="sr-only" htmlFor="shop-search">
                Search shops
              </label>
              <input
                id="shop-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by shop or location…"
                className="admin-input mt-0 min-w-0"
              />
              <label className="sr-only" htmlFor="shop-status">
                Filter by status
              </label>
              <select
                id="shop-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="admin-input mt-0"
              >
                <option value="all">All statuses</option>
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {loading ? (
            <p className="py-12 text-center text-sm text-ink/50">Loading shops…</p>
          ) : filteredShops.length === 0 ? (
            <EmptyState
              text={shops.length ? "No shops match your filters." : "No shops have been added yet."}
              href="/admin/shops/new"
            />
          ) : (
            <div className="divide-y divide-ink/10">
              {filteredShops.map((shop) => (
                <article
                  key={shop.id}
                  className="flex min-w-0 flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cloud text-base font-bold text-forest">
                      {shop.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate font-semibold">{shop.name}</h2>
                      <p className="mt-1 truncate text-xs text-ink/50">
                        {shop.location?.name ?? "No location"}
                        {shop.barangay ? ` · ${shop.barangay}` : ""}
                      </p>
                      <p className="mt-1 truncate text-xs text-ink/40">{shop.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:shrink-0">
                    <StatusPill status={shop.status} />
                    <button
                      type="button"
                      onClick={() => router.push(`/admin/shops/${shop.id}`)}
                      className="text-xs font-bold text-ink hover:text-coral"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void remove(shop)}
                      className="text-xs font-bold text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </AdminShell>
  );
}

export function AdminShopForm({ adminName, shopId }: { adminName: string; shopId?: string }) {
  const router = useRouter();
  const { shops, services, locations, loading, error } = useAdminData();
  const editingShop = shopId ? shops.find((shop) => shop.id === shopId) : undefined;
  const [form, setForm] = useState<ShopForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [barangays, setBarangays] = useState<string[]>([]);
  const [barangaysLoading, setBarangaysLoading] = useState(false);
  const [barangayError, setBarangayError] = useState("");
  const locationOptions = useMemo(() => getCebuLocationOptions(locations), [locations]);

  useEffect(() => {
    if (editingShop) setForm(toForm(editingShop));
  }, [editingShop]);

  useEffect(() => {
    const selectedLocation = locationOptions.find((location) => location.id === form.locationId);
    if (
      !selectedLocation ||
      (selectedLocation.type !== "city" && selectedLocation.type !== "municipality")
    ) {
      setBarangays([]);
      setBarangaysLoading(false);
      setBarangayError("");
      return;
    }

    setBarangaysLoading(false);
    setBarangayError("");
    const addressLocation = cebuAddresses.municipalities.find(
      (location) =>
        location.slug === selectedLocation.slug ||
        normalizeAddressName(location.name) === normalizeAddressName(selectedLocation.name),
    );
    const options = addressLocation?.barangays.map((barangay) => barangay.name) ?? [];
    setBarangays(options);
    if (!addressLocation) setBarangayError("No Cebu barangay data was found for this location.");
  }, [form.locationId, locationOptions]);

  function update<K extends keyof ShopForm>(key: K, value: ShopForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setFormError("");
    const response = await fetch(shopId ? `/api/admin/shops/${shopId}` : "/api/admin/shops", {
      method: shopId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        latitude: form.latitude || null,
        longitude: form.longitude || null,
      }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setFormError(data?.error ?? "Unable to save shop.");
      setSaving(false);
      return;
    }
    setMessage(
      shopId
        ? "Shop updated. Returning to the directory…"
        : "Shop added. Returning to the directory…",
    );
    window.setTimeout(() => router.push("/admin/shops"), 450);
  }

  const title = shopId ? "Edit shop" : "Add new shop";
  const barangayOptions =
    form.barangay && !barangays.includes(form.barangay) ? [form.barangay, ...barangays] : barangays;
  return (
    <AdminShell adminName={adminName}>
      <AdminPageHeader
        eyebrow={shopId ? "Directory record / Edit" : "Directory record / New"}
        title={title}
        description={
          shopId
            ? "Update the public details, services, and publishing settings for this listing."
            : "Create a complete listing for a local tech-repair shop."
        }
        action={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <label className="sr-only" htmlFor="header-status">
              Publishing status
            </label>
            <select
              id="header-status"
              value={form.status}
              onChange={(e) => update("status", e.target.value as BusinessStatus)}
              className="admin-input mt-0 w-auto min-w-[116px] bg-white py-3"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
              <option value="flagged">Flagged</option>
            </select>
            <label className="flex items-center gap-2 rounded-xl border border-ink/10 bg-white px-3 py-3 text-xs font-semibold text-ink">
              <input
                type="checkbox"
                checked={form.verified}
                onChange={(e) => update("verified", e.target.checked)}
                className="h-4 w-4 accent-coral"
              />
              Verified
            </label>
            <label className="flex items-center gap-2 rounded-xl border border-ink/10 bg-white px-3 py-3 text-xs font-semibold text-ink">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => update("featured", e.target.checked)}
                className="h-4 w-4 accent-coral"
              />
              Featured
            </label>
            <button
              type="submit"
              form="shop-form"
              disabled={saving}
              className="button-lime shrink-0 justify-center disabled:cursor-wait disabled:opacity-60"
            >
              {saving ? "Saving…" : shopId ? "Save changes" : "Add shop"}
            </button>
          </div>
        }
      />
      <main className="mx-auto max-w-[1280px] px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        {loading && (
          <p className="rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink/50">
            Loading form options…
          </p>
        )}
        {formError && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>
        )}
        {message && (
          <p className="mt-4 rounded-xl bg-lime/60 px-4 py-3 text-sm font-medium text-forest">
            {message}
          </p>
        )}
        {!loading && shopId && !editingShop && !error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            This shop could not be found.
          </p>
        )}
        {(!shopId || editingShop) && (
          <form
            id="shop-form"
            onSubmit={save}
            className="mt-4 grid items-start gap-4 pb-2 lg:grid-cols-2 min-[1080px]:grid-cols-3 min-[1080px]:items-stretch"
          >
            <FormSection
              title="Identity"
              description="The name and public copy visitors will see."
              className="lg:col-start-1 lg:row-span-2 lg:row-start-1 min-[1080px]:row-span-1"
            >
              <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                <Field label="Shop name *">
                  <input
                    required
                    value={form.name}
                    onChange={(e) => {
                      update("name", e.target.value);
                      if (!shopId) update("slug", slugify(e.target.value));
                    }}
                    className="admin-input"
                  />
                </Field>
                <Field label="URL slug *">
                  <input
                    required
                    value={form.slug}
                    onChange={(e) => update("slug", slugify(e.target.value))}
                    className="admin-input"
                  />
                </Field>
                <div className="min-w-0 text-sm font-semibold sm:col-span-2">
                  <span>Services</span>
                  <div className="mt-2 grid min-w-0 gap-2 sm:grid-cols-2">
                    {services.map((service) => (
                      <label
                        key={service.id}
                        className="flex min-w-0 items-center gap-3 rounded-xl border border-ink/10 px-3 py-2.5 text-sm font-medium transition hover:bg-cloud"
                      >
                        <input
                          type="checkbox"
                          checked={form.serviceIds.includes(service.id)}
                          onChange={(e) =>
                            update(
                              "serviceIds",
                              e.target.checked
                                ? [...form.serviceIds, service.id]
                                : form.serviceIds.filter((id) => id !== service.id),
                            )
                          }
                          className="h-4 w-4 shrink-0 accent-coral"
                        />
                        <span className="truncate">{service.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <Field label="Description" wide>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    className="admin-input resize-y"
                  />
                </Field>
              </div>
            </FormSection>

            <FormSection
              title="Location and contact"
              description="Help customers find and reach the shop."
              className="lg:col-start-2 lg:row-start-1 min-[1080px]:col-start-2"
            >
              <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                <Field label="City / municipality *">
                  <select
                    required
                    value={form.locationId}
                    onChange={(e) => {
                      update("locationId", e.target.value);
                      update("barangay", "");
                    }}
                    className="admin-input"
                  >
                    <option value="">Select a location</option>
                    {locationOptions.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Barangay">
                  <select
                    value={form.barangay}
                    onChange={(e) => update("barangay", e.target.value)}
                    disabled={!form.locationId || barangaysLoading}
                    className="admin-input disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="">
                      {barangaysLoading ? "Loading barangays…" : "Select a barangay"}
                    </option>
                    {barangayOptions.map((barangay) => (
                      <option key={barangay} value={barangay}>
                        {barangay}
                      </option>
                    ))}
                  </select>
                  {barangayError && (
                    <span className="mt-1 block text-xs font-normal text-red-600">
                      {barangayError}
                    </span>
                  )}
                </Field>
                <Field label="Street address *" wide>
                  <input
                    required
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    className="admin-input"
                  />
                </Field>
                <Field label="Phone">
                  <input
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="admin-input"
                  />
                </Field>
                <Field label="Website">
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => update("website", e.target.value)}
                    placeholder="https://"
                    className="admin-input"
                  />
                </Field>
                <Field label="Facebook">
                  <input
                    type="url"
                    value={form.facebook}
                    onChange={(e) => update("facebook", e.target.value)}
                    placeholder="https://facebook.com/"
                    className="admin-input"
                  />
                </Field>
                <Field label="Instagram">
                  <input
                    type="url"
                    value={form.instagram}
                    onChange={(e) => update("instagram", e.target.value)}
                    placeholder="https://instagram.com/"
                    className="admin-input"
                  />
                </Field>
                <Field label="Latitude">
                  <input
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={(e) => update("latitude", e.target.value)}
                    className="admin-input"
                  />
                </Field>
                <Field label="Longitude">
                  <input
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={(e) => update("longitude", e.target.value)}
                    className="admin-input"
                  />
                </Field>
              </div>
            </FormSection>

            <FormSection
              title="Opening hours"
              description="Use a simple format like 9:00 AM–6:00 PM or Closed."
              className="lg:col-start-2 lg:row-start-2 min-[1080px]:col-start-3 min-[1080px]:row-start-1"
            >
              <div className="space-y-2">
                {days.map((day) => (
                  <label
                    key={day}
                    className="grid min-w-0 grid-cols-[minmax(76px,100px)_minmax(0,1fr)] items-center gap-3 text-sm font-medium"
                  >
                    <span>{day}</span>
                    <input
                      value={form.hours[day] ?? ""}
                      onChange={(e) => update("hours", { ...form.hours, [day]: e.target.value })}
                      placeholder="9:00 AM–6:00 PM or Closed"
                      className="admin-input mt-0 min-w-0"
                    />
                  </label>
                ))}
              </div>
            </FormSection>
          </form>
        )}
      </main>
    </AdminShell>
  );
}

function FormSection({
  title,
  description,
  className = "",
  children,
}: {
  title: string;
  description: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`min-w-0 rounded-xl border border-ink/10 bg-white p-4 shadow-soft sm:p-5 ${className}`}
    >
      <div className="mb-4 border-b border-ink/10 pb-3">
        <h2 className="text-base font-semibold tracking-[-0.03em]">{title}</h2>
        <p className="mt-1 text-xs leading-5 text-ink/50 sm:text-sm">{description}</p>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  wide,
  children,
}: {
  label: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`min-w-0 text-sm font-semibold ${wide ? "sm:col-span-2" : ""}`}>
      {label}
      {children}
    </label>
  );
}
