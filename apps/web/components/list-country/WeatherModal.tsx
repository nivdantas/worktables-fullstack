"use client";

import { Modal, ModalBasicLayout, ModalContent } from "@vibe/core";
import Image from "next/image";
import type { WeatherResponse as WeatherData } from "@repo/types";
import type { Country } from "./types";

interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  weatherData?: WeatherData;
  isLoading?: boolean;
  errorMessage?: string | null;
  selectedCountry?: Country | null;
}

const formatNumber = (value: number | null | undefined): string =>
  typeof value === "number" && Number.isFinite(value)
    ? value.toLocaleString()
    : "N/A";

const formatArea = (value: number | null | undefined): string =>
  typeof value === "number" && Number.isFinite(value)
    ? `${value.toLocaleString()} km²`
    : "N/A";

const StatCard = ({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) => (
  <div
    className={`rounded-lg bg-slate-50/70 px-3 py-2 dark:bg-slate-800/70 ${className}`}
  >
    <p className="text-xs text-slate-500 dark:text-slate-300">{label}</p>
    <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-white">
      {value}
    </p>
  </div>
);

export default function WeatherModal({
  isOpen,
  onClose,
  weatherData,
  isLoading = false,
  errorMessage = null,
  selectedCountry = null,
}: WeatherModalProps) {
  if (!isOpen) return null;

  const title = selectedCountry?.name?.trim() || "Weather";

  return (
    <Modal
      id="weather-modal"
      show={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex bg-black/50! items-center justify-center"
    >
      <ModalBasicLayout className="relative w-full max-w-2xl bg-white p-2 text-black shadow-xl sm:p-4 dark:bg-[#2f314e] dark:text-white">
        <ModalContent>
          <div className="mb-2 pb-1">
            <h2 className="text-lg font-bold sm:text-xl">Weather in {title}</h2>
          </div>

          {isLoading ? (
            <p className="py-4 text-center">Loading weather data...</p>
          ) : null}

          {!isLoading && errorMessage ? (
            <p className="py-4 text-center text-red-500">{errorMessage}</p>
          ) : null}

          {!isLoading && !errorMessage && weatherData ? (
            <div className="space-y-5">
              <div className="flex items-center gap-3 rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                <Image
                  src={`https:${weatherData.conditionIcon}`}
                  alt={weatherData.condition}
                  width={64}
                  height={64}
                />
                <div>
                  <p className="text-base font-semibold sm:text-lg">
                    {weatherData.condition}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-300">
                    {weatherData.location}, {weatherData.country}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                  Weather details
                </h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <StatCard
                    label="Temperature"
                    value={`${weatherData.temperatureCelsius}°C`}
                  />
                  <StatCard
                    label="Wind"
                    value={`${weatherData.windKph} km/h`}
                  />
                  <StatCard
                    label="Humidity"
                    value={`${weatherData.humidity}%`}
                  />
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                  Country highlights
                </h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <StatCard
                    label="Capital"
                    value={selectedCountry?.capital ?? "N/A"}
                  />
                  <StatCard
                    label="Region"
                    value={selectedCountry?.region ?? "N/A"}
                  />
                  <StatCard
                    label="Subregion"
                    value={selectedCountry?.subregion ?? "N/A"}
                    className="hidden lg:block"
                  />
                  <StatCard
                    label="Population"
                    value={formatNumber(selectedCountry?.population)}
                    className="hidden lg:block"
                  />
                  <StatCard
                    label="Area"
                    value={formatArea(selectedCountry?.area)}
                    className="hidden lg:block"
                  />
                  <StatCard
                    label="Currency"
                    value={
                      selectedCountry?.currencyName ??
                      selectedCountry?.currency ??
                      "N/A"
                    }
                    className="hidden lg:block"
                  />
                </div>
              </div>
            </div>
          ) : null}
        </ModalContent>
      </ModalBasicLayout>
    </Modal>
  );
}
