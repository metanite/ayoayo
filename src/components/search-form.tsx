import { locations, services } from "@/lib/data";
import { PickerOption, ServicePicker } from "@/components/service-picker";

type SearchFormProps = {
  compact?: boolean;
  defaultValues?: { service?: string; location?: string };
};

const serviceOptions: PickerOption[] = services.map((service) => ({
  name: service.name,
  slug: service.slug,
  icon: service.icon,
  description: service.description,
}));

const locationOptions: PickerOption[] = locations
  .filter((location) => location.slug !== "cebu")
  .map((location) => ({
    name: location.name,
    slug: location.slug,
    icon: "location",
  }));

export function SearchForm({ compact = false, defaultValues = {} }: SearchFormProps) {
  return (
    <form
      action="/search"
      className={compact ? "search-panel search-panel-compact" : "search-panel"}
    >
      <div className="search-field">
        <label htmlFor={compact ? "compact-service" : "service"}>Service</label>
        <ServicePicker
          id={compact ? "compact-service" : "service"}
          name="service"
          ariaLabel="Choose a service"
          defaultValue={defaultValues.service}
          options={serviceOptions}
          allLabel="All services"
          allIcon="all"
        />
      </div>
      <div className="search-field">
        <label htmlFor={compact ? "compact-location" : "location"}>Municipality</label>
        <ServicePicker
          id={compact ? "compact-location" : "location"}
          name="location"
          ariaLabel="Choose a municipality"
          defaultValue={defaultValues.location ?? ""}
          options={locationOptions}
          allLabel="All municipalities"
          allIcon="location"
        />
      </div>
      <button type="submit" className="button-lime search-submit">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4.5 4.5" />
          </svg>
        </span>
        <span>Search</span>
      </button>
    </form>
  );
}
