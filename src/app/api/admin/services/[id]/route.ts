import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/admin";
import { validateServicePayload } from "@/lib/admin-services";

function unauthorized() {
  return NextResponse.json({ error: "Administrator access required." }, { status: 401 });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const context = await getAdminContext();
  if (!context) return unauthorized();

  const validation = validateServicePayload(await request.json().catch(() => null));
  if (validation.error || !validation.data) {
    return NextResponse.json({ error: validation.error ?? "Invalid service." }, { status: 400 });
  }

  const { error } = await context.client
    .from("services")
    .update({
      name: validation.data.name,
      slug: validation.data.slug,
      description: validation.data.description,
      category_id: validation.data.categoryId,
      keywords: validation.data.keywords,
    })
    .eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ id: params.id });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const context = await getAdminContext();
  if (!context) return unauthorized();

  const { error } = await context.client
    .from("services")
    .update({ is_active: false })
    .eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
