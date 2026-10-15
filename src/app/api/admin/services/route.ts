import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/admin";
import { normalizeKeywords, validateServicePayload } from "@/lib/admin-services";
import { REMOVED_SERVICE_SLUGS } from "@/lib/directory";

function unauthorized() {
  return NextResponse.json({ error: "Administrator access required." }, { status: 401 });
}

export async function GET() {
  const context = await getAdminContext();
  if (!context) return unauthorized();

  const [servicesResult, categoriesResult] = await Promise.all([
    context.client
      .from("services")
      .select("id, name, slug, description, keywords, category_id")
      .eq("is_active", true)
      .order("name"),
    context.client.from("categories").select("id, name, slug").eq("is_active", true).order("name"),
  ]);

  if (servicesResult.error || categoriesResult.error) {
    return NextResponse.json({ error: "Unable to load services." }, { status: 500 });
  }

  const categories = categoriesResult.data ?? [];
  const categoryNames = new Map(categories.map((category) => [category.id, category.name]));
  const services = (servicesResult.data ?? [])
    .filter((service) => !REMOVED_SERVICE_SLUGS.has(service.slug))
    .map((service) => ({
      id: service.id,
      name: service.name,
      slug: service.slug,
      description: service.description ?? "",
      categoryId: service.category_id,
      categoryName: categoryNames.get(service.category_id) ?? "Uncategorized",
      keywords: normalizeKeywords(service.keywords),
    }));

  return NextResponse.json({ services, categories });
}

export async function POST(request: Request) {
  const context = await getAdminContext();
  if (!context) return unauthorized();

  const validation = validateServicePayload(await request.json().catch(() => null));
  if (validation.error || !validation.data) {
    return NextResponse.json({ error: validation.error ?? "Invalid service." }, { status: 400 });
  }

  const service = validation.data;
  const { data: existing, error: lookupError } = await context.client
    .from("services")
    .select("id, is_active")
    .eq("slug", service.slug)
    .maybeSingle();
  if (lookupError) return NextResponse.json({ error: lookupError.message }, { status: 400 });
  if (existing?.is_active) {
    return NextResponse.json(
      { error: "A service with this slug already exists." },
      { status: 409 },
    );
  }

  if (existing) {
    const { error } = await context.client
      .from("services")
      .update({
        name: service.name,
        description: service.description,
        category_id: service.categoryId,
        keywords: service.keywords,
        is_active: true,
      })
      .eq("id", existing.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ id: existing.id }, { status: 200 });
  }

  const { data: created, error } = await context.client
    .from("services")
    .insert({
      name: service.name,
      slug: service.slug,
      description: service.description,
      category_id: service.categoryId,
      keywords: service.keywords,
    })
    .select("id")
    .single();
  if (error || !created) {
    return NextResponse.json(
      { error: error?.message ?? "Unable to create service." },
      { status: 400 },
    );
  }

  return NextResponse.json({ id: created.id }, { status: 201 });
}
