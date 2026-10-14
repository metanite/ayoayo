"use client";

import { useEffect, useRef, useState } from "react";
import { ServiceIcon } from "@/components/service-icon";
import { ServiceIconName } from "@/lib/types";

export type PickerOption = {
  name: string;
  slug: string;
  icon: ServiceIconName;
  description?: string;
};

type ServicePickerProps = {
  id: string;
  name: string;
  ariaLabel: string;
  defaultValue?: string;
  options: PickerOption[];
  allLabel: string;
  allIcon: ServiceIconName;
};

export function ServicePicker({
  id,
  name,
  ariaLabel,
  defaultValue = "",
  options,
  allLabel,
  allIcon,
}: ServicePickerProps) {
  const initialValue = options.some((option) => option.slug === defaultValue) ? defaultValue : "";
  const [selectedSlug, setSelectedSlug] = useState(initialValue);
  const [activeSlug, setActiveSlug] = useState(initialValue);
  const [open, setOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const pickerOptions = [{ name: allLabel, slug: "", icon: allIcon }, ...options];
  const selected = pickerOptions.find((option) => option.slug === selectedSlug) ?? pickerOptions[0];
  const menuId = `${id}-options`;

  useEffect(() => {
    if (!open) return;

    function closeOnOutsideClick(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [open]);

  function choose(slug: string) {
    setSelectedSlug(slug);
    setActiveSlug(slug);
    setOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const currentIndex = Math.max(
      0,
      pickerOptions.findIndex((option) => option.slug === activeSlug),
    );

    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex = (currentIndex + direction + pickerOptions.length) % pickerOptions.length;
      setActiveSlug(pickerOptions[nextIndex].slug);
      setOpen(true);
      return;
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      setActiveSlug(
        event.key === "Home" ? pickerOptions[0].slug : pickerOptions[pickerOptions.length - 1].slug,
      );
      setOpen(true);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) choose(activeSlug);
      else setOpen(true);
    }
  }

  return (
    <div ref={pickerRef} className="relative mt-1">
      <button
        id={id}
        type="button"
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex min-h-7 w-full items-center gap-2 text-left text-sm font-medium text-ink outline-none focus-visible:ring-2 focus-visible:ring-coral/40"
        onClick={() => setOpen((isOpen) => !isOpen)}
        onKeyDown={handleKeyDown}
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-cloud text-forest">
          <ServiceIcon name={selected.icon} className="h-3.5 w-3.5" />
        </span>
        <span className="min-w-0 flex-1 truncate">{selected.name}</span>
        <span
          className={`text-ink/45 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▾
        </span>
      </button>
      {open && (
        <div
          id={menuId}
          role="listbox"
          aria-label={ariaLabel}
          className="absolute left-0 top-[calc(100%+0.80rem)] z-30 max-h-80 w-full min-w-0 overflow-auto rounded-2xl border border-ink/10 bg-white p-1.5 shadow-soft"
        >
          {pickerOptions.map((option) => {
            const isSelected = option.slug === selectedSlug;
            const isActive = option.slug === activeSlug;
            return (
              <button
                key={option.slug || "all-services"}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${isActive ? "bg-cloud" : "hover:bg-cloud/70"}`}
                onMouseEnter={() => setActiveSlug(option.slug)}
                onClick={() => choose(option.slug)}
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-lime/60 text-forest">
                  <ServiceIcon name={option.icon} className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink">{option.name}</span>
                  {option.description && (
                    <span className="mt-0.5 block text-xs leading-5 text-ink/50">
                      {option.description}
                    </span>
                  )}
                </span>
                {isSelected && (
                  <span className="ml-auto pt-0.5 text-sm font-bold text-coral">✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
      <input type="hidden" name={name} value={selectedSlug} />
    </div>
  );
}
