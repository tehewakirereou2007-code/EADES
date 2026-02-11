import { getHouseById } from "@/actions/properties";
import PropertyGallery from "@/components/property/PropertyGallery";
import PropertyMapWrapper from "@/components/property/PropertyMapWrapper";
import ReservationForm from "@/components/property/ReservationForm";
import ReviewSection from "@/components/property/ReviewSection";
import { formatPrice } from "@/lib/format";
import { notFound } from "next/navigation";
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined } from "react-icons/fa";

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const house = await getHouseById(id);

    if (!house) {
        notFound();
    }

    // Parse images
    let images: string[] = [];
    try {
        images = JSON.parse(house.images);
    } catch {
        images = ["/placeholder-house.jpg"];
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Gallery & Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{house.title}</h1>
                            <div className="flex items-center text-gray-500">
                                <FaMapMarkerAlt className="mr-2 text-black" />
                                <span>{house.neighborhood.name}, {house.location || "Togo"}</span>
                            </div>
                        </div>

                        <PropertyGallery images={images} />

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                                {house.description}
                            </p>

                            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100">
                                <div className="text-center">
                                    <FaBed className="mx-auto text-2xl text-gray-400 mb-2" />
                                    <span className="block font-bold text-gray-900">3 Chambres</span>
                                </div>
                                <div className="text-center">
                                    <FaBath className="mx-auto text-2xl text-gray-400 mb-2" />
                                    <span className="block font-bold text-gray-900">2 Sdb.</span>
                                </div>
                                <div className="text-center">
                                    <FaRulerCombined className="mx-auto text-2xl text-gray-400 mb-2" />
                                    <span className="block font-bold text-gray-900">120 m²</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Localisation</h2>
                            <PropertyMapWrapper
                                latitude={house.latitude || 6.13}
                                longitude={house.longitude || 1.21}
                                locationName={house.neighborhood.name}
                            />
                        </div>

                        <ReviewSection houseId={house.id} reviews={house.reviews} />
                    </div>

                    {/* Right Column: Reservation & Price */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Prix du bien</p>
                                <div className="text-3xl font-bold text-black">
                                    {formatPrice(house.price)}
                                </div>
                                <div className="mt-4 flex items-center gap-3">
                                    {house.vendor.image ? (
                                        <img src={house.vendor.image} className="w-12 h-12 rounded-full" />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                            V
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-gray-900">{house.vendor.name || "Vendeur"}</p>
                                        <p className="text-sm text-gray-500">Propriétaire</p>
                                    </div>
                                </div>
                            </div>

                            <ReservationForm
                                houseId={house.id}
                                houseTitle={house.title}
                                vendorPhone={house.vendor.phone}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
