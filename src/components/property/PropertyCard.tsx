import Image from "next/image";
import Link from "next/link";
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined } from "react-icons/fa";
import { House, Neighborhood } from "@prisma/client";
import { formatPrice } from "@/lib/format";

interface PropertyCardProps {
    house: House & { neighborhood: Neighborhood };
}

export default function PropertyCard({ house }: PropertyCardProps) {
    // Parse images safely
    let images: string[] = [];
    try {
        images = JSON.parse(house.images);
    } catch (e) {
        images = ["/placeholder-house.jpg"];
    }

    const mainImage = images[0] || "/placeholder-house.jpg";

    return (
        <Link href={`/property/${house.id}`} className="group block h-full">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100">
                <div className="relative h-64 overflow-hidden">
                    {/* Image with fallback or standard img tag if external not configured for Image optimization */}
                    <img
                        src={mainImage}
                        alt={house.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-900 shadow-sm uppercase tracking-wide">
                        {house.status}
                    </div>
                    {house.status === 'LOUE' && (
                        <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                            LOUÉ
                        </div>
                    )}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-900 transition-colors line-clamp-1">
                            {house.title}
                        </h3>
                        <p className="text-xl font-bold text-black">
                            {formatPrice(house.price)}
                        </p>
                    </div>

                    <div className="flex items-center text-gray-500 mb-4 text-sm">
                        <FaMapMarkerAlt className="mr-1 text-gray-900" />
                        <span className="line-clamp-1">
                            {house.neighborhood.name}
                            {house.location ? `, ${house.location}` : ""}
                        </span>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
                        {house.description}
                    </p>

                    <div className="pt-4 border-t border-gray-100 flex justify-between text-gray-500 text-sm">
                        <span className="flex items-center gap-1"><FaBed /> 3 Ch.</span>
                        <span className="flex items-center gap-1"><FaBath /> 2 Sdb.</span>
                        <span className="flex items-center gap-1"><FaRulerCombined /> 120m²</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
