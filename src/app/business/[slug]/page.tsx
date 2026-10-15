import type { Metadata } from "next";
import { ShopProfilePage, generateShopMetadata } from "@/components/shop-profile-page";

type LegacyShopPageProps = { params: { slug: string } };

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: LegacyShopPageProps): Promise<Metadata> {
  return generateShopMetadata(params.slug);
}

export default function LegacyShopPage({ params }: LegacyShopPageProps) {
  return <ShopProfilePage shopSlug={params.slug} />;
}
