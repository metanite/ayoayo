export type AdminService = {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  categoryName: string;
  keywords: string[];
};

export type ServicePayload = {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  keywords: string[];
};

export function slugifyService(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeKeywords(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return Array.from(new Set(value))
    .filter((keyword): keyword is string => typeof keyword === "string")
    .map((keyword) => keyword.trim().replace(/\s+/g, " ").toLowerCase())
    .filter(Boolean)
    .slice(0, 50);
}

export function validateServicePayload(
  payload: unknown,
): { data: ServicePayload; error?: undefined } | { data?: undefined; error: string } {
  if (!payload || typeof payload !== "object") return { error: "Invalid service payload." };
  const value = payload as Record<string, unknown>;
  const name = typeof value.name === "string" ? value.name.trim() : "";
  const description = typeof value.description === "string" ? value.description.trim() : "";
  const categoryId = typeof value.categoryId === "string" ? value.categoryId.trim() : "";
  const slug = slugifyService(typeof value.slug === "string" ? value.slug : name);

  if (!name) return { error: "Service name is required." };
  if (!slug) return { error: "A valid service slug is required." };
  if (!categoryId) return { error: "A category is required." };

  return {
    data: {
      name,
      slug,
      description,
      categoryId,
      keywords: normalizeKeywords(value.keywords),
    },
  };
}
