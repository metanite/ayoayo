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
              Find tech repair shops in Cebu
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-ink/60">
              Discover trusted laptop, phone, computer and electronics repair shops across Cebu.
            </p>
          </div>
          <div className="mx-auto mt-6 max-w-4xl">
            <SearchForm />
          </div>
          <div className="mx-auto mt-5 flex max-w-3xl flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-ink/55">
            <span className="font-semibold text-ink/75">Popular services</span>
            {services.slice(0, 4).map((service) => (
              <Link
                key={service.slug}
                href={`/cebu/${service.slug}`}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-coral"
              >
                <ServiceIcon name={service.icon} className="h-3.5 w-3.5 text-forest/70" />
                {service.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <LandingDirectory businesses={businesses} locations={locations} />

      <section className="container-shell py-10 sm:py-12">
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
                      href={`/cebu/${service.slug}`}
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

      <section id="how-it-works" className="container-shell py-10 sm:py-12">
        <div className="rounded-3xl bg-forest p-6 text-white sm:p-8">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <div>
              <p className="eyebrow text-lime">Simple by design</p>
              <h2 className="mt-3 max-w-md text-3xl font-semibold leading-tight tracking-[-0.06em]">
                Less scrolling. More fixing.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/65">
                A focused way to compare local repair shops and get your device back in your hands.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <span className="font-mono text-sm font-semibold text-lime">01</span>
                <h3 className="mt-2 font-semibold">Search</h3>
                <p className="mt-1 text-sm leading-6 text-white/60">
                  Choose a service and municipality.
                </p>
              </div>
              <div>
                <span className="font-mono text-sm font-semibold text-lime">02</span>
                <h3 className="mt-2 font-semibold">Compare</h3>
                <p className="mt-1 text-sm leading-6 text-white/60">
                  Review details, hours and services.
                </p>
              </div>
              <div>
                <span className="font-mono text-sm font-semibold text-lime">03</span>
                <h3 className="mt-2 font-semibold">Connect</h3>
                <p className="mt-1 text-sm leading-6 text-white/60">
                  Call or get directions to a shop.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
