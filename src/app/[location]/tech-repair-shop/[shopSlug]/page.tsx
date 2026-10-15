import type { Metadata } from "next";
import { ShopProfilePage, generateShopMetadata } from "@/components/shop-profile-page";
import { locationSlugFromPath } from "@/lib/urls";

type ShopPageProps = { params: { location: string; shopSlug: string } };

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: ShopPageProps): Promise<Metadata> {
  return generateShopMetadata(params.shopSlug, locationSlugFromPath(params.location));
}

export default function ShopPage({ params }: ShopPageProps) {
  return (
    <ShopProfilePage
      shopSlug={params.shopSlug}
      locationSlug={locationSlugFromPath(params.location)}
    />
  );
}
