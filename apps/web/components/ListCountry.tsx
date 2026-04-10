"use client"

import mondaySdk from "monday-sdk-js";
import { useState } from "react";
import { Search } from "@vibe/core";
import useSWR from "swr";

export interface Country {
	id: string;
	name: string;
}

const monday = mondaySdk();
const VISIBLE_COUNT = 10;

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

const ListCountry = () => {
	const [searchValue, setSearchValue] = useState("");
	const [startIndex, setStartIndex] = useState(0);
	const { data: countries = [], error, isLoading } = useSWR(query, fetchCountries)

	if(error) return <div className="text-red-500">Error loading countries.</div>
	if (isLoading) return <div>Loading countries...</div>;


	const filteredCountries = countries.filter((country: Country) =>
		country.name.toLowerCase().includes(searchValue.toLowerCase())
)

	const handleSearchChange = (value: string) => {
		setSearchValue(value);
		setStartIndex(0);
	}

	const handleWheel = (e: React.WheelEvent<HTMLUListElement>) => {
		if (filteredCountries.length <= VISIBLE_COUNT) return;

		if (e.deltaY > 0) {
			setStartIndex((prev) => Math.min(prev + 1, filteredCountries.length - VISIBLE_COUNT));
		} else if (e.deltaY < 0) {
			setStartIndex((prev) => Math.max(prev - 1, 0));
		}
	};

	const visibleCountries = filteredCountries.slice(startIndex, startIndex + VISIBLE_COUNT);
	const hasMoreTop = startIndex > 0;
	const hasMoreBottom = startIndex < filteredCountries.length - VISIBLE_COUNT;
	return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto mt-10 gap-6">

            <div className="w-full">
                <Search
                    value={searchValue}
                    onChange={handleSearchChange}
                    placeholder="Search for a country"
                    debounceRate={200}
                    size="small"
                />
            </div>

			<ul className="w-full border rounded-md p-4 flex flex-col gap-1 overflow-hidden select-none snap-y snap-mandatory" onWheel={handleWheel}>
                {hasMoreTop && (
                    <li className="text-center text-gray-400 font-bold tracking-widest pb-1">
                    ▲
                    </li>
                )}

                {visibleCountries.map((country: Country) => (
                    <li key={country.id} className="h-10 p-2 border-b last:border-0 hover:bg-gray-50 snap-start">
                        {country.name}
                    </li>
                ))}

                {filteredCountries.length === 0 && (
                    <li className="text-gray-500 text-center py-2">No results found</li>
                )}

                {hasMoreBottom && (
                    <li className="text-center text-gray-400 font-bold tracking-widest pt-1">
                        ...
                    </li>
                )}
            </ul>
        </div>
	)

}

export default ListCountry;
