import PropertyCard from "@/components/property/PropertyCard";
import { getHouses } from "@/actions/properties";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default async function FeaturedSection() {
    const houses = await getHouses();
    const featuredHouses = houses.slice(0, 3); // Show top 3

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Nos dernières exclusivités</h2>
                        <p className="mt-2 text-gray-600">Découvrez les biens les plus récents ajoutés sur EADES</p>
                    </div>
                    <Link href="/search" className="hidden sm:flex items-center text-black hover:text-gray-600 font-medium transition-colors">
                        Voir tout <FaArrowRight className="ml-2" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredHouses.map((house) => (
                        <PropertyCard key={house.id} house={house} />
                    ))}
                </div>

                <div className="mt-10 text-center sm:hidden">
                    <Link href="/search" className="inline-flex items-center text-black hover:text-gray-600 font-medium">
                        Voir tout <FaArrowRight className="ml-2" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
