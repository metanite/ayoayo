import { ServiceIconName } from "@/lib/types";

type ServiceIconProps = {
  name: ServiceIconName;
  className?: string;
};

const iconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1.8,
};

export function ServiceIcon({ name, className = "h-4 w-4" }: ServiceIconProps) {
  const paths = {
    laptop: (
      <>
        <rect x="4" y="3.5" width="16" height="11" rx="1.5" {...iconProps} />
        <path d="M2.5 18h19l-1.5 2h-16z" {...iconProps} />
      </>
    ),
    desktop: (
      <>
        <rect x="3" y="4" width="18" height="12" rx="1.5" {...iconProps} />
        <path d="M9 20h6M12 16v4" {...iconProps} />
      </>
    ),
    gaming: (
      <>
        <path
          d="M7 8h10c2.6 0 4.2 2 5 5l.6 2.5c.5 2-1.9 3-3 1.5l-2.2-2.8H6.6l-2.2 2.8c-1.1 1.5-3.5.5-3-1.5L2 13c.8-3 2.4-5 5-5Z"
          {...iconProps}
        />
        <path d="M6 11v4M4 13h4M17 12h.01M19 14h.01" {...iconProps} />
      </>
    ),
    macbook: (
      <>
        <rect x="6" y="3" width="12" height="14" rx="1" {...iconProps} />
        <path d="M3 20h18M9 20h6" {...iconProps} />
      </>
    ),
    data: (
      <>
        <path
          d="M5 5.5C5 4.1 8.1 3 12 3s7 1.1 7 2.5v13C19 19.9 15.9 21 12 21s-7-1.1-7-2.5z"
          {...iconProps}
        />
        <path
          d="M5 5.5C5 6.9 8.1 8 12 8s7-1.1 7-2.5M5 12.5c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"
          {...iconProps}
        />
      </>
    ),
    iphone: (
      <>
        <rect x="7" y="2.5" width="10" height="19" rx="2" {...iconProps} />
        <path d="M10 5h4M11.5 18.5h1" {...iconProps} />
      </>
    ),
    android: (
      <>
        <path
          d="M7 9h10v8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2zM5 10v5M19 10v5M9 6l-1.5-2M15 6l1.5-2M7 9h10a5 5 0 0 0-10 0Z"
          {...iconProps}
        />
        <path d="M10 11v2M14 11v2" {...iconProps} />
      </>
    ),
    tablet: (
      <>
        <rect x="5" y="2.5" width="14" height="19" rx="2" {...iconProps} />
        <path d="M11 18.5h2" {...iconProps} />
      </>
    ),
    printer: (
      <>
        <path
          d="M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"
          {...iconProps}
        />
        <path d="M7 14h10v7H7zM17 11h.01" {...iconProps} />
      </>
    ),
    cctv: (
      <>
        <path d="m4 10 12-5 3 7-12 5zM7 17l-2 4M16 13l3 5M4 10l-2-1" {...iconProps} />
        <circle cx="16.5" cy="8.5" r="1" {...iconProps} />
      </>
    ),
    console: (
      <>
        <path d="m7 7 2 2h6l2-2 4 3v8a2 2 0 0 1-2 2l-3-4H8l-3 4a2 2 0 0 1-2-2v-8z" {...iconProps} />
        <path d="M7 12v4M5 14h4M17 13h.01M19 15h.01" {...iconProps} />
      </>
    ),
    network: (
      <>
        <rect x="8" y="3" width="8" height="5" rx="1" {...iconProps} />
        <rect x="3" y="16" width="6" height="5" rx="1" {...iconProps} />
        <rect x="15" y="16" width="6" height="5" rx="1" {...iconProps} />
        <path d="M12 8v4M6 16v-4h12v4" {...iconProps} />
      </>
    ),
    all: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="1" {...iconProps} />
        <rect x="14" y="4" width="6" height="6" rx="1" {...iconProps} />
        <rect x="4" y="14" width="6" height="6" rx="1" {...iconProps} />
        <rect x="14" y="14" width="6" height="6" rx="1" {...iconProps} />
      </>
    ),
    location: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" {...iconProps} />
        <circle cx="12" cy="10" r="2.2" {...iconProps} />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {paths[name]}
    </svg>
  );
}
