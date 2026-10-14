import Link from "next/link";
import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-white/95 backdrop-blur">
      <div className="container-shell flex h-16 items-center justify-between gap-5">
        <Link href="/" className="group flex shrink-0 items-center" aria-label="ayoayo.ph home">
          <Image
            src="/brand/ayoayo-logo.png"
            alt="ayoayo.ph"
            width={205}
            height={64}
            priority
            className="h-8 w-auto object-contain"
          />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-ink/65 md:flex">
          <Link href="/search" className="transition-colors hover:text-coral">
            Find a repair shop
          </Link>
          <Link href="/cebu/laptop-repair" className="transition-colors hover:text-coral">
            Popular services
          </Link>
          <a href="#how-it-works" className="transition-colors hover:text-coral">
            How it works
          </a>
        </nav>
        <Link href="/search" className="button-dark hidden px-4 py-2 sm:inline-flex">
          Find Shops <span aria-hidden>↗</span>
        </Link>
      </div>
    </header>
  );
}
