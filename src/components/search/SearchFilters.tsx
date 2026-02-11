"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import Input from "@/components/ui/Input";
import { FaSearch } from "react-icons/fa";

interface SearchFiltersProps {
    neighborhoods?: { id: string; name: string }[];
}

export default function SearchFilters({ neighborhoods = [] }: SearchFiltersProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [term, setTerm] = useState(searchParams.get("search")?.toString() || "");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice")?.toString() || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice")?.toString() || "");
    const [neighborhoodId, setNeighborhoodId] = useState(searchParams.get("neighborhoodId")?.toString() || "");

    const [debouncedTerm] = useDebounce(term, 300);
    const [debouncedMinPrice] = useDebounce(minPrice, 500);
    const [debouncedMaxPrice] = useDebounce(maxPrice, 500);

    const updateParams = useCallback(() => {
        const params = new URLSearchParams(searchParams);

        if (debouncedTerm) params.set("search", debouncedTerm);
        else params.delete("search");

        if (debouncedMinPrice) params.set("minPrice", debouncedMinPrice);
        else params.delete("minPrice");

        if (debouncedMaxPrice) params.set("maxPrice", debouncedMaxPrice);
        else params.delete("maxPrice");

        if (neighborhoodId) params.set("neighborhoodId", neighborhoodId);
        else params.delete("neighborhoodId");

        replace(`${pathname}?${params.toString()}`);
    }, [debouncedTerm, debouncedMinPrice, debouncedMaxPrice, neighborhoodId, searchParams, pathname, replace]);

    useEffect(() => {
        updateParams();
    }, [debouncedTerm, debouncedMinPrice, debouncedMaxPrice, neighborhoodId, updateParams]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Recherche textuelle */}
                <div className="md:col-span-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all sm:text-sm"
                        placeholder="Rechercher par mot-clé, titre..."
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                    />
                </div>

                {/* Quartier */}
                <div>
                    <select
                        className="block w-full px-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all sm:text-sm"
                        value={neighborhoodId}
                        onChange={(e) => setNeighborhoodId(e.target.value)}
                    >
                        <option value="">Tous les quartiers</option>
                        {neighborhoods.map((n) => (
                            <option key={n.id} value={n.id}>{n.name}</option>
                        ))}
                    </select>
                </div>

                {/* Bouton pour réinitialiser (Optionnel) */}
                <div className="flex items-center">
                    <button
                        onClick={() => {
                            setTerm("");
                            setMinPrice("");
                            setMaxPrice("");
                            setNeighborhoodId("");
                        }}
                        className="text-sm text-gray-500 hover:text-black underline transition-colors"
                    >
                        Réinitialiser les filtres
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div className="text-sm font-medium text-gray-700">Plage de prix (CFA) :</div>
                <div className="flex items-center space-x-2 md:col-span-2">
                    <input
                        type="number"
                        placeholder="Min"
                        className="block w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        className="block w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
