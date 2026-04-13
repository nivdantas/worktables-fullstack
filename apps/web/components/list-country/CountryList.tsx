"use client";

import { useState, useEffect, useMemo } from "react";
import { List, ListItem, ListTitle } from "@vibe/core/next";
import type { Country } from "./types";

interface CountryListProps {
  countries: Country[];
  onCountryClick: (country: Country) => void;
  emptyMessage?: string;
  className?: string;
  maxHeight?: number;
  mobileMaxHeight?: number;
  mobileBreakpoint?: number;
}

export default function CountryList({
  countries,
  onCountryClick,
  emptyMessage = "No results found",
  maxHeight = 420,
  mobileMaxHeight = 800,
  mobileBreakpoint = 981,
}: CountryListProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`);

    const update = () => setIsMobile(mediaQuery.matches);
    update();

    mediaQuery.addEventListener("change", update);
    window.addEventListener("resize", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, [mobileBreakpoint]);

  const resolvedMaxHeight = useMemo(
    () => (isMobile ? mobileMaxHeight : maxHeight),
    [isMobile, mobileMaxHeight, maxHeight],
  );
  return (
    <section className="w-full" aria-label="Countries section">
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
          Countries
        </h2>
        <span className="text-xs text-slate-500 dark:text-slate-300">
          {countries.length} result{countries.length === 1 ? "" : "s"}
        </span>
      </div>

      <List
        aria-label="Countries list"
        className="countries-list-scroll w-full rounded-xl bg-white/70 p-2 shadow-sm dark:bg-slate-900/30 border-2 border-slate-400 dark:border-slate-800"
        maxHeight={resolvedMaxHeight}
      >
        <>
          {countries.map((country) => (
            <ListItem
              key={country.id}
              label={country.name}
              value={country.name}
              onClick={() => onCountryClick(country)}
              className="rounded-lg px-2 py-1 transition-colors dark:text-white! hover:bg-slate-100 dark:hover:bg-slate-800/70 mb-3 lg:mb-1 *:text-2xl! lg:*:text-base!"
            />
          ))}

          {countries.length === 0 ? (
            <ListTitle className="py-6 text-center text-sm text-slate-500 dark:text-slate-300">
              {emptyMessage}
            </ListTitle>
          ) : null}
        </>
      </List>
    </section>
  );
}
