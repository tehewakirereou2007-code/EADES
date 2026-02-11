import PropertyCard from "@/components/property/PropertyCard";
import SearchFilters from "@/components/search/SearchFilters";
import { getHouses } from "@/actions/properties";
import { getNeighborhoods } from "@/actions/neighborhoods";
import Link from "next/link";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{
        search?: string;
        minPrice?: string;
        maxPrice?: string;
        neighborhoodId?: string;
    }>;
}) {
    const params = await searchParams;
    const query = params.search || "";
    const minPrice = params.minPrice ? parseInt(params.minPrice) : undefined;
    const maxPrice = params.maxPrice ? parseInt(params.maxPrice) : undefined;
    const neighborhoodId = params.neighborhoodId || undefined;

    const houses = await getHouses({
        search: query,
        minPrice,
        maxPrice,
        neighborhoodId
    });

    const neighborhoods = await getNeighborhoods();

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Trouver votre futur chez-vous
                    </h1>
                </div>

                <SearchFilters neighborhoods={neighborhoods} />

                {houses.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-lg text-gray-600">Aucun résultat trouvé pour "{query}".</p>
                        <p className="text-gray-500">Essayez d'autres mots-clés ou vérifiez l'orthographe.</p>
                        <Link href="/search" className="text-black hover:underline font-medium mt-4 inline-block">
                            Voir tout les biens
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {houses.map((house) => (
                            <PropertyCard key={house.id} house={house} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
