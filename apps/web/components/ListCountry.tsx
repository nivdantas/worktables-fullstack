"use client";

import CountryList from "./list-country/CountryList";
import CountrySearch from "./list-country/CountrySearch";
import WeatherModal from "./list-country/WeatherModal";
import useCountryWeather from "./list-country/useCountryWeather";

export default function ListCountry() {
  const {
    searchValue,
    setSearchValue,
    filteredCountries,
    countriesError,
    isCountriesLoading,
    isModalOpen,
    closeModal,
    weatherData,
    weatherErrorMessage,
    isWeatherLoading,
    selectedCountry,
    handleCountryClick,
  } = useCountryWeather();

  return (
    <main className="min-h-dvh w-full bg-white px-3 py-4 text-black dark:bg-[#2f314e] dark:text-white sm:px-6 sm:py-6">
      <div className="mx-auto w-full max-w-3xl">
        <section className="rounded-2xl bg-white/90 p-4 shadow-sm dark:bg-slate-900/30 sm:p-6">
          {countriesError ? (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">
              Error loading countries.
            </div>
          ) : null}

          {isCountriesLoading ? (
            <div className="rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-200">
              Loading countries...
            </div>
          ) : null}

          {!countriesError && !isCountriesLoading ? (
            <div className="space-y-4">
              <CountrySearch value={searchValue} onChange={setSearchValue} />
              <CountryList
                countries={filteredCountries}
                onCountryClick={handleCountryClick}
              />
            </div>
          ) : null}
        </section>
      </div>

      <WeatherModal
        isOpen={isModalOpen}
        onClose={closeModal}
        weatherData={weatherData}
        isLoading={isWeatherLoading}
        errorMessage={weatherErrorMessage}
        selectedCountry={selectedCountry}
      />
    </main>
  );
}
