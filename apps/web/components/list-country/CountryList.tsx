"use client";

import { List, ListItem, ListTitle } from "@vibe/core/next";
import type { Country } from "./types";

interface CountryListProps {
  countries: Country[];
  onCountryClick: (country: Country) => void;
  emptyMessage?: string;
  className?: string;
  maxHeight?: number;
}

export default function CountryList({
  countries,
  onCountryClick,
  emptyMessage = "No results found",
  maxHeight = 420,
}: CountryListProps) {
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
        maxHeight={maxHeight}
      >
        <>
          {countries.map((country) => (
            <ListItem
              key={country.id}
              label={country.name}
              value={country.name}
              onClick={() => onCountryClick(country)}
              className="rounded-lg px-2 py-1 transition-colors dark:text-white! hover:bg-slate-100 dark:hover:bg-slate-800/70"
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
