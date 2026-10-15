import { Business, Category, Location, Service } from "@/lib/types";

export const categories: Category[] = [
  {
    id: "computers",
    name: "Computers",
    slug: "computers",
    description: "Laptop, desktop, gaming PC, MacBook and data recovery services.",
  },
  {
    id: "mobile",
    name: "Mobile devices",
    slug: "mobile-devices",
    description: "Phone, tablet and screen replacement specialists.",
  },
  {
    id: "electronics",
    name: "Electronics",
    slug: "electronics",
    description: "Printers and other electronics repair specialists.",
  },
];

export const services: Service[] = [
  {
    id: "laptop-repair",
    categoryId: "computers",
    name: "Laptop repair",
    slug: "laptop-repair",
    icon: "laptop",
    description: "Find dependable laptop repair shops for diagnostics, parts and upgrades.",
    keywords: ["notebook repair", "laptop technician"],
  },
  {
    id: "computer-repair",
    categoryId: "computers",
    name: "Computer repair",
    slug: "computer-repair",
    icon: "desktop",
    description: "Local computer repair for slow, broken or unreliable desktops and workstations.",
    keywords: ["desktop repair", "pc repair"],
  },
  {
    id: "gaming-pc-repair",
    categoryId: "computers",
    name: "Gaming PC repair",
    slug: "gaming-pc-repair",
    icon: "gaming",
    description: "Get help with gaming PC builds, thermals, upgrades and troubleshooting.",
    keywords: ["gaming computer repair", "pc upgrade"],
  },
  {
    id: "macbook-repair",
    categoryId: "computers",
    name: "MacBook repair",
    slug: "macbook-repair",
    icon: "macbook",
    description: "MacBook diagnostics, battery, display, keyboard and board-level repair.",
    keywords: ["mac repair", "apple laptop repair"],
  },
  {
    id: "iphone-repair",
    categoryId: "mobile",
    name: "iPhone repair",
    slug: "iphone-repair",
    icon: "iphone",
    description: "Find iPhone repair shops for screens, batteries, charging ports and more.",
    keywords: ["iphone screen replacement", "apple phone repair"],
  },
  {
    id: "android-repair",
    categoryId: "mobile",
    name: "Android phone repair",
    slug: "android-repair",
    icon: "android",
    description:
      "Android phone repair for screens, batteries, charging issues and software problems.",
    keywords: ["samsung repair", "phone repair"],
  },
  {
    id: "tablet-repair",
    categoryId: "mobile",
    name: "Tablet repair",
    slug: "tablet-repair",
    icon: "tablet",
    description: "Tablet repair and replacement parts from local technicians.",
    keywords: ["ipad repair", "tablet screen replacement"],
  },
];

export const locations: Location[] = [
  {
    slug: "cebu",
    name: "Cebu",
    type: "province",
    description: "Tech repair shops across Cebu Province and Metro Cebu.",
    latitude: 10.3157,
    longitude: 123.8854,
  },
  {
    slug: "cebu-city",
    name: "Cebu City",
    type: "city",
    parentSlug: "cebu",
    description:
      "Repair shops serving Cebu City neighborhoods, including Lahug, Banilad and the downtown area.",
    latitude: 10.3157,
    longitude: 123.8854,
  },
  {
    slug: "mandaue-city",
    name: "Mandaue City",
    type: "city",
    parentSlug: "cebu",
    description: "Computer, phone and electronics repair services in Mandaue City.",
    latitude: 10.3333,
    longitude: 123.9333,
  },
  {
    slug: "lapu-lapu-city",
    name: "Lapu-Lapu City",
    type: "city",
    parentSlug: "cebu",
    description: "Tech repair services for Mactan and Lapu-Lapu City.",
    latitude: 10.3103,
    longitude: 123.9494,
  },
  {
    slug: "talisay-city",
    name: "Talisay City",
    type: "city",
    parentSlug: "cebu",
    description: "Local tech repair options in Talisay City and nearby communities.",
    latitude: 10.2447,
    longitude: 123.8494,
  },
  {
    slug: "consolacion",
    name: "Consolacion",
    type: "municipality",
    parentSlug: "cebu",
    description: "Tech repair shops serving Consolacion and northern Metro Cebu.",
    latitude: 10.3768,
    longitude: 123.9573,
  },
  {
    slug: "minglanilla",
    name: "Minglanilla",
    type: "municipality",
    parentSlug: "cebu",
    description: "Repair services in Minglanilla and the south corridor.",
    latitude: 10.2449,
    longitude: 123.7962,
  },
  {
    slug: "liloan",
    name: "Liloan",
    type: "municipality",
    parentSlug: "cebu",
    description: "Tech repair services in Liloan, Cebu.",
    latitude: 10.3997,
    longitude: 123.9996,
  },
  {
    slug: "danao-city",
    name: "Danao City",
    type: "city",
    parentSlug: "cebu",
    description: "Local repair shops in Danao City and nearby northern Cebu areas.",
    latitude: 10.5208,
    longitude: 124.0273,
  },
  {
    slug: "naga-city",
    name: "Naga City",
    type: "city",
    parentSlug: "cebu",
    description: "Tech repair options in Naga City and southern Cebu.",
    latitude: 10.208,
    longitude: 123.758,
  },
];

// Starter records are intentionally demo data; replace them with verified Supabase rows before launch.
export const businesses: Business[] = [
  {
    id: "cebu-laptop-lab",
    slug: "cebu-laptop-lab",
    name: "Cebu Laptop Lab",
    tagline: "Diagnostics, upgrades and everyday laptop repair.",
    description:
      "A starter directory listing for laptop diagnostics, SSD upgrades, battery replacement and general computer troubleshooting in Cebu City.",
    locationSlug: "cebu-city",
    barangay: "Lahug",
    address: "Salinas Drive, Lahug, Cebu City",
    phone: "+63 917 000 0101",
    website: "https://ayoayo.ph",
    facebook: "https://facebook.com",
    hours: "Mon–Sat · 9:00 AM–6:00 PM",
    latitude: 10.3378,
    longitude: 123.9006,
    serviceSlugs: ["laptop-repair", "computer-repair", "gaming-pc-repair", "data-recovery"],
    verified: true,
    featured: true,
    updatedAt: "2026-10-01",
  },
  {
    id: "pixel-fix-cebu",
    slug: "pixel-fix-cebu",
    name: "Pixel Fix Cebu",
    tagline: "Phone and tablet repairs with clear turnaround times.",
    description:
      "A starter directory listing for screen, battery and charging repairs across popular phone and tablet models.",
    locationSlug: "cebu-city",
    barangay: "Mabolo",
    address: "M. J. Cuenco Avenue, Mabolo, Cebu City",
    phone: "+63 917 000 0102",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    hours: "Mon–Sun · 10:00 AM–7:00 PM",
    latitude: 10.3275,
    longitude: 123.9182,
    serviceSlugs: ["iphone-repair", "android-repair", "tablet-repair"],
    verified: true,
    featured: true,
    updatedAt: "2026-09-28",
  },
  {
    id: "northside-tech-mandaue",
    slug: "northside-tech-mandaue",
    name: "Northside Tech Mandaue",
    tagline: "Computer, network and office equipment support.",
    description:
      "A starter directory listing for small-business computer support, printer repair and network troubleshooting in Mandaue.",
    locationSlug: "mandaue-city",
    barangay: "Centro",
    address: "A. S. Fortuna Street, Mandaue City",
    phone: "+63 917 000 0103",
    website: "https://ayoayo.ph",
    hours: "Mon–Sat · 8:30 AM–5:30 PM",
    latitude: 10.3332,
    longitude: 123.944,
    serviceSlugs: ["computer-repair", "printer-repair"],
    verified: true,
    updatedAt: "2026-09-25",
  },
  {
    id: "mactan-device-care",
    slug: "mactan-device-care",
    name: "Mactan Device Care",
    tagline: "Mobile device support for Mactan and Lapu-Lapu.",
    description:
      "A starter directory listing for phone, tablet and accessory troubleshooting near Lapu-Lapu City.",
    locationSlug: "lapu-lapu-city",
    barangay: "Pusok",
    address: "Pusok Road, Lapu-Lapu City",
    phone: "+63 917 000 0104",
    facebook: "https://facebook.com",
    hours: "Mon–Sat · 9:00 AM–6:00 PM",
    latitude: 10.3037,
    longitude: 123.9615,
    serviceSlugs: ["iphone-repair", "android-repair", "tablet-repair"],
    verified: false,
    updatedAt: "2026-09-20",
  },
  {
    id: "southside-pc-care",
    slug: "southside-pc-care",
    name: "Southside PC Care",
    tagline: "Desktop repair and gaming PC upgrades in the south.",
    description:
      "A starter directory listing for desktop repair, gaming builds, system cleanup and component upgrades in Talisay.",
    locationSlug: "talisay-city",
    barangay: "Tabunok",
    address: "Tabunok Road, Talisay City",
    phone: "+63 917 000 0105",
    website: "https://ayoayo.ph",
    hours: "Mon–Sat · 9:00 AM–5:00 PM",
    latitude: 10.2585,
    longitude: 123.8406,
    serviceSlugs: ["computer-repair", "gaming-pc-repair"],
    verified: true,
    updatedAt: "2026-09-18",
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
export function getLocation(slug: string) {
  return locations.find((location) => location.slug === slug);
}
export function getBusiness(slug: string) {
  return businesses.find((business) => business.slug === slug);
}
export function getCategory(id: string) {
  return categories.find((category) => category.id === id);
}

export function getBusinessesFor(serviceSlug?: string, locationSlug?: string) {
  return businesses.filter(
    (business) =>
      (!serviceSlug || business.serviceSlugs.includes(serviceSlug)) &&
      (!locationSlug || locationSlug === "cebu" || business.locationSlug === locationSlug),
  );
}

export function searchBusinesses(query: { service?: string; location?: string }) {
  return businesses.filter((business) => {
    return (
      (!query.service || business.serviceSlugs.includes(query.service)) &&
      (!query.location || query.location === "cebu" || business.locationSlug === query.location)
    );
  });
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}
