"use client"

import type { WeatherResponse as WeatherData } from "@repo/types"
import mondaySdk from "monday-sdk-js";
import { useState } from "react";
import { Modal, ModalContent, ModalBasicLayout, Search } from "@vibe/core";
import { List, ListItem, ListTitle } from "@vibe/core/next";
import useSWR from "swr";
import Image from 'next/image';


export interface Country {
	id: string;
	name: string;
}

const monday = mondaySdk();


const query = `
       query {
           boards (ids: 9343551951) {
               items_page (limit: 300) {
                   items { id name }
               }
           }
       }
   `;


const fetchCountries = async (query: string) => {
	if (!monday) return [];
	const res = await monday.api(query);
	if (!res?.data?.boards?.[0]?.items_page?.items) throw new Error("Failed to fetch");
		return res.data.boards[0].items_page.items;
	}

const fetchWeather = async (url: string) => {
	const response = await fetch(url);
	if (!response.ok) throw new Error("Failed to fetch weather data");
	return response.json();
}

const ListCountry = () => {
	const [searchValue, setSearchValue] = useState("");

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedCountry, setSelectedCountry] = useState<string | null>(null);


	const { data: countries = [], error: countriesError, isLoading: isCountriesLoading } = useSWR(query, fetchCountries)

	const weatherUrl = isModalOpen && selectedCountry ? `http://localhost:3001/api/weather/${encodeURIComponent(selectedCountry)}` : null;

	const { data: weatherData, error: weatherError, isLoading: isWeatherLoading}  = useSWR<WeatherData>(weatherUrl, fetchWeather);

	const handleCountryClick = async (countryName: string) => {
		setSelectedCountry(countryName);
		setIsModalOpen(true);
	}


	if(countriesError) return <div className="text-red-500">Error loading countries.</div>
	if (isCountriesLoading) return <div>Loading countries...</div>;


	const filteredCountries = countries.filter((country: Country) =>
		country.name.toLowerCase().includes(searchValue.toLowerCase())
)


	const handleSearchChange = (value: string) => {
		setSearchValue(value);
	}


	return (
        <main className="flex flex-col items-center w-full max-w-md mx-auto gap-6 bg-white dark:bg-[#2f314e]">

            <div className="w-full">
                <Search
                    value={searchValue}
                    onChange={handleSearchChange}
                    placeholder="Search for a country"
                    debounceRate={200}
                    size="small"
                />
            </div>
            <List aria-label="Countries list" className="rounded-xl" maxHeight={300}>
                                {filteredCountries.map((country: Country) => (
                                    <ListItem
                                        key={country.id}
                                        label={country.name}
                                        value={country.name}
										onClick={() => handleCountryClick(country.name)}
										className="dark:text-white! hover:bg-gray-400!"
                                    />
                                ))}

                                {filteredCountries.length === 0 && (
                                    <ListTitle className="text-center text-white py-2">
                                        No results found
                                    </ListTitle>
                                )}

                            </List>
            {/* Modal */}
                  {isModalOpen && (
                    <Modal id="weather-modal" show={isModalOpen} onClose={()=>{setIsModalOpen(false)}} className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                      <ModalBasicLayout className="bg-white p-6 rounded-md min-w-75 relative text-black shadow-lg">
                      <ModalContent>
                        {isWeatherLoading && <p className="text-center py-4">Loading weather data...</p>}

                        {weatherError && <p className="text-red-500 text-center py-4">{weatherError.message}</p>}

                        {weatherData && (
                          <div className="flex flex-col gap-2">
                            <h2 className="text-xl font-bold border-b pb-2">Weather in {weatherData.location}, {weatherData.country}</h2>
                            <div className="flex items-center gap-4 py-2">
                              <Image src={`https:${weatherData.conditionIcon}`} alt={weatherData.condition} width={64} height={64} />
                              <p className="text-lg font-semibold">{weatherData.condition}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                              <div>
                                <p className="text-sm text-gray-500">Temperature</p>
                                <p className="font-medium">{weatherData.temperatureCelsius}°C</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Wind</p>
                                <p className="font-medium">{weatherData.windKph} km/h</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Humidity</p>
                                <p className="font-medium">{weatherData.humidity}%</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </ModalContent>
                      </ModalBasicLayout>
                    </Modal>
                  )}
        </main>
	)

}

export default ListCountry;
