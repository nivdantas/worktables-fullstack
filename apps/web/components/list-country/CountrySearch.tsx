"use client";

import { Search } from "@vibe/core";

interface CountrySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CountrySearch({
  value,
  onChange,
  placeholder = "Search by country or capital",
  className,
}: CountrySearchProps) {
  return (
    <section
      className={className ?? "w-full"}
      aria-label="Country search section"
    >
      <div className="mb-2 flex items-center justify-between px-1">
        <h1 className="text-base font-semibold text-slate-800 dark:text-white sm:text-lg">
          World Countries
        </h1>
      </div>

      <div className="rounded-xl shadow-sm">
        <Search
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          debounceRate={200}
          size="small"
        />
      </div>
    </section>
  );
}
