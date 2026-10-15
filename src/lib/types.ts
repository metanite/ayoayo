export type Category = { id: string; name: string; slug: string; description: string };

export type ServiceIconName =
  | "laptop"
  | "desktop"
  | "gaming"
  | "macbook"
  | "data"
  | "iphone"
  | "android"
  | "tablet"
  | "printer"
  | "all"
  | "location";

export type Service = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  icon: ServiceIconName;
  description: string;
  keywords: string[];
};

export type Location = {
  slug: string;
  name: string;
  type: "province" | "city" | "municipality";
  parentSlug?: string;
  description: string;
  latitude: number;
  longitude: number;
};

export type Business = {
  id: string;
  slug: string;
  name: string;
  image?: string;
  tagline: string;
  description: string;
  locationSlug: string;
  barangay: string;
  address: string;
  phone: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  hours: string;
  latitude: number;
  longitude: number;
  serviceSlugs: string[];
  verified: boolean;
  featured?: boolean;
  updatedAt: string;
  locationName?: string;
  serviceNames?: Record<string, string>;
};

export type BusinessStatus = "draft" | "published" | "unpublished" | "flagged";

export type BusinessHours = Record<string, string>;
