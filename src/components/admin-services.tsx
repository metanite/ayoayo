"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin-dashboard";
import { AdminShell } from "@/components/admin-shell";
import { normalizeKeywords, slugifyService, type AdminService } from "@/lib/admin-services";

type CategoryOption = { id: string; name: string; slug: string };

type ServiceForm = {
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  keywords: string;
};

const emptyForm: ServiceForm = {
  name: "",
  slug: "",
  categoryId: "",
  description: "",
  keywords: "",
};

function keywordsFromInput(value: string) {
  return normalizeKeywords(value.split(","));
}

export function AdminServicesPage({ adminName }: { adminName: string }) {
  const [services, setServices] = useState<AdminService[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [slugEdited, setSlugEdited] = useState(false);
  const [keywordDrafts, setKeywordDrafts] = useState<Record<string, string[]>>({});
  const [keywordInputs, setKeywordInputs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingKeywords, setSavingKeywords] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/services", { cache: "no-store" });
    if (response.status === 401) {
      window.location.assign("/admin/login");
      return;
    }

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setError(data?.error ?? "Unable to load services.");
      setLoading(false);
      return;
    }

    const nextServices = (data.services ?? []) as AdminService[];
    setServices(nextServices);
    setCategories(data.categories ?? []);
    setKeywordDrafts(
      Object.fromEntries(nextServices.map((service) => [service.id, service.keywords ?? []])),
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function updateForm(field: keyof ServiceForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (field === "name" && !slugEdited) {
      setForm((current) => ({ ...current, slug: slugifyService(value) }));
    }
  }

  async function addService(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const response = await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        keywords: keywordsFromInput(form.keywords),
      }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setError(data?.error ?? "Unable to save service.");
      setSaving(false);
      return;
    }

    setForm(emptyForm);
    setSlugEdited(false);
    setNotice("Service added successfully.");
    await load();
    setSaving(false);
  }

  function addKeyword(serviceId: string) {
    const input = keywordInputs[serviceId] ?? "";
    const additions = keywordsFromInput(input);
    if (!additions.length) return;
    setKeywordDrafts((current) => ({
      ...current,
      [serviceId]: normalizeKeywords([...(current[serviceId] ?? []), ...additions]),
    }));
    setKeywordInputs((current) => ({ ...current, [serviceId]: "" }));
  }

  function removeKeyword(serviceId: string, keyword: string) {
    setKeywordDrafts((current) => ({
      ...current,
      [serviceId]: (current[serviceId] ?? []).filter((item) => item !== keyword),
    }));
  }

  async function saveKeywords(service: AdminService) {
    setSavingKeywords(service.id);
    setError("");
    setNotice("");
    const response = await fetch(`/api/admin/services/${service.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: service.name,
        slug: service.slug,
        categoryId: service.categoryId,
        description: service.description,
        keywords: keywordDrafts[service.id] ?? [],
      }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) setError(data?.error ?? "Unable to save keywords.");
    else setNotice(`SEO keywords updated for ${service.name}.`);
    setSavingKeywords(null);
  }

  async function removeService(service: AdminService) {
    if (!window.confirm(`Remove ${service.name} from the directory services?`)) return;
    setError("");
    setNotice("");
    const response = await fetch(`/api/admin/services/${service.id}`, { method: "DELETE" });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setError(data?.error ?? "Unable to remove service.");
      return;
    }
    setNotice(`${service.name} was removed from the active services.`);
    await load();
  }

  return (
    <AdminShell adminName={adminName}>
      <AdminPageHeader
        eyebrow="Directory configuration"
        title="Services & SEO keywords"
        description="Manage the services shops can offer and the search phrases used in service landing-page metadata."
      />
      <main className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        {(error || notice) && (
          <p
            className={`mb-5 rounded-xl px-4 py-3 text-sm ${error ? "bg-red-50 text-red-700" : "bg-lime/20 text-forest"}`}
          >
            {error || notice}
          </p>
        )}

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(280px,0.75fr)_minmax(0,1.25fr)]">
          <section className="rounded-2xl border border-ink/10 bg-white p-5 shadow-soft sm:p-6">
            <div className="border-b border-ink/10 pb-4">
              <p className="eyebrow">Add a service</p>
              <h2 className="mt-1.5 text-xl font-semibold tracking-[-0.05em]">
                New directory service
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-ink/55">
                The slug is generated from the name so new service URLs stay clean and searchable.
              </p>
            </div>
            <form onSubmit={addService} className="mt-5 space-y-4">
              <label className="block text-sm font-semibold">
                Service name
                <input
                  required
                  value={form.name}
                  onChange={(event) => updateForm("name", event.target.value)}
                  placeholder="Laptop repair"
                  className="admin-input"
                />
              </label>
              <label className="block text-sm font-semibold">
                URL slug
                <input
                  required
                  value={form.slug}
                  onChange={(event) => {
                    setSlugEdited(true);
                    updateForm("slug", slugifyService(event.target.value));
                  }}
                  placeholder="laptop-repair"
                  className="admin-input"
                />
              </label>
              <label className="block text-sm font-semibold">
                Category
                <select
                  required
                  value={form.categoryId}
                  onChange={(event) => updateForm("categoryId", event.target.value)}
                  className="admin-input"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-semibold">
                Description
                <textarea
                  value={form.description}
                  onChange={(event) => updateForm("description", event.target.value)}
                  placeholder="Describe the repair service."
                  rows={4}
                  className="admin-input resize-y"
                />
              </label>
              <label className="block text-sm font-semibold">
                SEO keywords
                <input
                  value={form.keywords}
                  onChange={(event) => updateForm("keywords", event.target.value)}
                  placeholder="laptop repair cebu, computer repair"
                  className="admin-input"
                />
                <span className="mt-1 block text-xs font-normal leading-5 text-ink/45">
                  Separate phrases with commas.
                </span>
              </label>
              <button
                type="submit"
                disabled={saving}
                className="button-lime w-full disabled:opacity-60"
              >
                {saving ? "Saving…" : "Add service"}
              </button>
            </form>
          </section>

          <section>
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Active services</p>
                <h2 className="mt-1.5 text-xl font-semibold tracking-[-0.05em]">
                  Search keyword manager
                </h2>
              </div>
              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-ink/55 shadow-soft">
                {loading ? "Loading…" : `${services.length} services`}
              </span>
            </div>
            {loading ? (
              <div className="rounded-2xl border border-ink/10 bg-white p-6 text-sm text-ink/55 shadow-soft">
                Loading services…
              </div>
            ) : services.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-ink/20 bg-white p-8 text-center shadow-soft">
                <p className="text-sm text-ink/55">No active services yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {services.map((service) => {
                  const keywords = keywordDrafts[service.id] ?? [];
                  return (
                    <article
                      key={service.id}
                      className="rounded-2xl border border-ink/10 bg-white p-5 shadow-soft sm:p-6"
                    >
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold tracking-[-0.04em]">
                              {service.name}
                            </h3>
                            <span className="rounded-full bg-cloud px-2.5 py-1 text-[11px] font-semibold text-ink/55">
                              {service.categoryName}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-ink/45">/{service.slug}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => void removeService(service)}
                          className="self-start text-sm font-semibold text-coral hover:text-ink"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-ink/55">
                        {service.description || "No description added yet."}
                      </p>
                      <div className="mt-5 border-t border-ink/10 pt-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold">SEO search keywords</p>
                          <span className="text-xs text-ink/45">{keywords.length}/50</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {keywords.length ? (
                            keywords.map((keyword) => (
                              <span
                                key={keyword}
                                className="inline-flex items-center gap-2 rounded-full bg-cloud px-3 py-1.5 text-xs font-medium text-ink/70"
                              >
                                {keyword}
                                <button
                                  type="button"
                                  aria-label={`Remove ${keyword}`}
                                  onClick={() => removeKeyword(service.id, keyword)}
                                  className="font-bold text-ink/45 hover:text-coral"
                                >
                                  ×
                                </button>
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-ink/45">No SEO keywords added.</span>
                          )}
                        </div>
                        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                          <input
                            value={keywordInputs[service.id] ?? ""}
                            onChange={(event) =>
                              setKeywordInputs((current) => ({
                                ...current,
                                [service.id]: event.target.value,
                              }))
                            }
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                addKeyword(service.id);
                              }
                            }}
                            placeholder="Add a keyword phrase"
                            className="admin-input mt-0 flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => addKeyword(service.id)}
                            className="button-dark shrink-0 px-4 py-2.5"
                          >
                            Add keyword
                          </button>
                          <button
                            type="button"
                            onClick={() => void saveKeywords(service)}
                            disabled={savingKeywords === service.id}
                            className="button-lime shrink-0 px-4 py-2.5 disabled:opacity-60"
                          >
                            {savingKeywords === service.id ? "Saving…" : "Save keywords"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </AdminShell>
  );
}
