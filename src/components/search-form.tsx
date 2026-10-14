import { locations, services } from "@/lib/data";

type SearchFormProps = {
  compact?: boolean;
  defaultValues?: { service?: string; location?: string };
};

export function SearchForm({ compact = false, defaultValues = {} }: SearchFormProps) {
  return (
    <form
      action="/search"
      className={compact ? "search-panel search-panel-compact" : "search-panel"}
    >
      <div className="search-field">
        <label htmlFor={compact ? "compact-service" : "service"}>Service</label>
        <select
          id={compact ? "compact-service" : "service"}
          name="service"
          defaultValue={defaultValues.service ?? ""}
        >
          <option value="">All services</option>
          {services.map((service) => (
            <option key={service.slug} value={service.slug}>
              {service.name}
            </option>
          ))}
        </select>
      </div>
      <div className="search-field">
        <label htmlFor={compact ? "compact-location" : "location"}>Municipality</label>
        <select
          id={compact ? "compact-location" : "location"}
          name="location"
          defaultValue={defaultValues.location ?? ""}
        >
          <option value="">All municipalities</option>
          {locations
            .filter((location) => location.slug !== "cebu")
            .map((location) => (
              <option key={location.slug} value={location.slug}>
                {location.name}
              </option>
            ))}
        </select>
      </div>
      <button type="submit" className="button-lime search-submit">
        Search <span aria-hidden>→</span>
      </button>
    </form>
  );
}
