import type { Metadata } from "next";
import {
  generateLocationMetadata,
  LocationDirectoryPage,
} from "@/components/location-directory-page";

type LocationPageProps = { params: { location: string } };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  return generateLocationMetadata(params.location);
}

export default function LocationPage({ params }: LocationPageProps) {
  return <LocationDirectoryPage locationSlug={params.location} />;
}
