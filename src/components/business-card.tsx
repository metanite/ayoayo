import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import { getLocation, getService } from "@/lib/data";
import { ServiceIcon } from "@/components/service-icon";
import { Business } from "@/lib/types";
import { shopPath } from "@/lib/urls";

const mobileServices = new Set(["iphone-repair", "android-repair", "tablet-repair"]);
const computerServices = new Set([
  "laptop-repair",
  "computer-repair",
  "gaming-pc-repair",
  "macbook-repair",
  "data-recovery",
]);
const electronicsServices = new Set(["printer-repair"]);
const serviceImages: Record<string, string> = {
  "gaming-pc-repair": "/brand/repair-shop-gaming-pc.svg",
  "iphone-repair": "/brand/repair-shop-iphone.svg",
  "tablet-repair": "/brand/repair-shop-tablet.svg",
  "printer-repair": "/brand/repair-shop-printer.svg",
  "data-recovery": "/brand/repair-shop-data-recovery.svg",
};

function getFallbackImage(serviceSlugs: string[]) {
  const hasMobile = serviceSlugs.some((slug) => mobileServices.has(slug));
  const hasComputer = serviceSlugs.some((slug) => computerServices.has(slug));
  const hasElectronics = serviceSlugs.some((slug) => electronicsServices.has(slug));

  if (hasMobile && hasComputer) return "/brand/repair-shop-laptop-phone.svg";
  const specificService = serviceSlugs.find((slug) => serviceImages[slug]);
  if (specificService) return serviceImages[specificService];
  if (hasMobile) return "/brand/repair-shop-phone.svg";
  if (hasComputer) return "/brand/repair-shop-laptop.svg";
  if (hasElectronics) return "/brand/repair-shop-electronics.svg";
  return "/brand/repair-shop-placeholder.svg";
}

export function BusinessCard({ business }: { business: Business }) {
  const location = getLocation(business.locationSlug);
  const locationName = business.locationName ?? location?.name;
  return (
    <article className="listing-card group">
      <Link
        href={shopPath(business.locationSlug, business.slug) as Route}
        aria-label={`View ${business.name}`}
      >
        <div className="listing-visual">
          <Image
            src={business.image ?? getFallbackImage(business.serviceSlugs)}
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover"
          />
          <span className="absolute inset-0 bg-black/5" aria-hidden />
          <span className="listing-favorite" aria-hidden>
            ♡
          </span>
          <span className="listing-monogram">{business.name.charAt(0)}</span>
          {business.featured && (
            <span className="relative z-10 rounded-full bg-white/85 px-3 py-1.5 text-[13px] font-medium text-ink shadow-sm backdrop-blur">
              Featured
            </span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-[13px] font-medium text-ink/50">
              {locationName} · {business.barangay}
            </p>
            <h3 className="text-lg font-semibold tracking-[-0.03em] text-ink sm:text-xl">
              <Link
                href={shopPath(business.locationSlug, business.slug) as Route}
                className="transition-colors hover:text-coral"
              >
                {business.name}
              </Link>
            </h3>
          </div>
          {business.verified && (
            <span className="mt-1 flex shrink-0 items-center gap-1 text-[13px] font-medium text-forest">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lime">
                ✓
              </span>{" "}
              Verified
            </span>
          )}
        </div>
        <p className="mb-4 line-clamp-2 text-sm font-normal leading-6 text-ink/60">
          {business.tagline}
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          {business.serviceSlugs.slice(0, 3).map((slug) => {
            const service = getService(slug);
            const serviceName = business.serviceNames?.[slug] ?? service?.name;
            return (
              <span
                key={slug}
                className="inline-flex items-center gap-1.5 rounded-full bg-cloud px-2.5 py-1 text-[13px] font-medium text-ink/70"
              >
                {service && (
                  <ServiceIcon name={service.icon} className="h-3.5 w-3.5 text-forest/70" />
                )}
                {serviceName}
              </span>
            );
          })}
          {business.serviceSlugs.length > 3 && (
            <span className="rounded-full bg-cloud px-2.5 py-1 text-[13px] font-medium text-ink/70">
              +{business.serviceSlugs.length - 3}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-ink/10 pt-3 text-[13px]">
          <span className="truncate font-normal text-ink/50">{business.hours}</span>
          <Link
            href={shopPath(business.locationSlug, business.slug) as Route}
            className="shrink-0 font-semibold text-ink transition-colors group-hover:text-coral"
          >
            View profile <span aria-hidden>↗</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
