import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/admin";

const bucketName = "shop-images";
const maxImageSize = 5 * 1024 * 1024;

function unauthorized() {
  return NextResponse.json({ error: "Administrator access required." }, { status: 401 });
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const context = await getAdminContext();
  if (!context) return unauthorized();

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Please provide an image file." }, { status: 400 });
  }
  if (file.type !== "image/webp") {
    return NextResponse.json({ error: "Images must be optimized WebP files." }, { status: 400 });
  }
  if (file.size > maxImageSize) {
    return NextResponse.json(
      { error: "The optimized image must be 5 MB or smaller." },
      { status: 400 },
    );
  }

  const path = `${params.id}/${crypto.randomUUID()}.webp`;
  const storage = context.client.storage.from(bucketName);
  const { error: uploadError } = await storage.upload(path, file, {
    cacheControl: "31536000",
    contentType: "image/webp",
    upsert: false,
  });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 400 });

  const {
    data: { publicUrl },
  } = storage.getPublicUrl(path);
  const { error: updateError } = await context.client
    .from("businesses")
    .update({ image_url: publicUrl })
    .eq("id", params.id);
  if (updateError) {
    await storage.remove([path]);
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({ imageUrl: publicUrl });
}
