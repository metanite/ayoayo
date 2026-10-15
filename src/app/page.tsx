import Link from "next/link";
import { LandingDirectory } from "@/components/landing-directory";
import { SearchForm } from "@/components/search-form";
import { ServiceIcon } from "@/components/service-icon";
import { SectionHeading } from "@/components/section-heading";
import { getDirectoryData } from "@/lib/directory";

const categoryIcons = ["⌘", "◌", "▣"];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { categories, services, locations, businesses } = await getDirectoryData();
  return (
    <main>
      <section className="hero-section border-b border-ink/10">
        <div className="container-shell py-6 sm:py-14">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold leading-[1.05] tracking-[-0.06em] text-ink sm:text-5xl">
              Find the right tech repair shop
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-ink/60">
              Discover trusted laptop, phone, computer and electronics repair shops near you.
            </p>
          </div>
          <div className="mx-auto mt-6 max-w-4xl">
            <SearchForm locations={locations} />
          </div>
        </div>
      </section>

      <LandingDirectory businesses={businesses} locations={locations} />

      <section className="container-shell py-6 sm:py-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Browse the directory"
            title="Start with what needs fixing."
            description="Choose a service, then find a local shop in the municipality that works for you."
          />
          <Link href="/search" className="button-dark shrink-0">
            See all services <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {categories.map((category, index) => (
            <article
              key={category.id}
              className="rounded-2xl border border-ink/10 bg-white p-5 transition hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cloud text-lg font-semibold text-forest">
                  {categoryIcons[index]}
                </span>
                <span className="font-mono text-xs font-semibold text-ink/30">0{index + 1}</span>
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em]">{category.name}</h3>
              <p className="mt-2 min-h-12 text-sm font-normal leading-6 text-ink/55">
                {category.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {services
                  .filter((service) => service.categoryId === category.id)
                  .slice(0, 4)
                  .map((service) => (
                    <Link
                      href={`/search?service=${service.slug}`}
                      key={service.slug}
                      className="inline-flex items-center gap-1.5 rounded-full bg-cloud px-3 py-1.5 text-xs font-medium text-ink/70 transition hover:bg-lime hover:text-ink"
                    >
                      <ServiceIcon name={service.icon} className="h-3.5 w-3.5 text-forest/70" />
                      {service.name}
                    </Link>
                  ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container-shell py-6 sm:py-12">
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/about"
            className="group rounded-3xl bg-forest p-6 text-white transition hover:-translate-y-1 hover:shadow-soft sm:p-8"
          >
            <p className="eyebrow text-lime">About ayoayo.ph</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.06em]">
              A simpler way to find local repair shops.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/65">
              Learn more about the directory and our focus on helping people find trusted tech
              repair shops in Cebu.
            </p>
            <span className="mt-6 inline-flex font-semibold text-lime">
              Learn about us{" "}
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>
          <Link
            href="/contact"
            className="group rounded-3xl border border-ink/10 bg-white p-6 transition hover:-translate-y-1 hover:border-coral/30 hover:shadow-soft sm:p-8"
          >
            <p className="eyebrow text-coral">Contact us</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.06em] text-ink">
              Have a question or a shop to add?
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-ink/60">
              Get in touch with the ayoayo.ph team about listings, corrections, partnerships or
              anything else.
            </p>
            <span className="mt-6 inline-flex font-semibold text-coral">
              Get in touch{" "}
              <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
