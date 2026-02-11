"use client";

import { useState } from "react";
import Image from "next/image";
import { FaCube, FaImages, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Button from "@/components/ui/Button";

interface PropertyGalleryProps {
    images: string[];
}

export default function PropertyGallery({ images }: PropertyGalleryProps) {
    const [viewMode, setViewMode] = useState<"photos" | "3d">("photos");
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end space-x-2">
                <Button
                    variant={viewMode === "photos" ? "primary" : "outline"}
                    onClick={() => setViewMode("photos")}
                    size="sm"
                >
                    <FaImages className="mr-2" /> Photos
                </Button>
                <Button
                    variant={viewMode === "3d" ? "primary" : "outline"}
                    onClick={() => setViewMode("3d")}
                    size="sm"
                >
                    <FaCube className="mr-2" /> Visite 3D
                </Button>
            </div>

            <div className="relative h-96 bg-gray-900 rounded-xl overflow-hidden shadow-lg group">
                {viewMode === "photos" ? (
                    <>
                        <img
                            src={images[currentIndex] || "/placeholder-house.jpg"}
                            alt={`Vue de maison ${currentIndex + 1}`}
                            className="w-full h-full object-cover transition-opacity duration-300"
                        />
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <FaChevronLeft />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <FaChevronRight />
                                </button>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                                    {images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentIndex(idx)}
                                            className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? "bg-white" : "bg-white/50"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white bg-gray-800">
                        {/* Simulation of 3D View */}
                        <div className="text-center p-8">
                            <FaCube className="text-6xl mx-auto mb-4 text-black animate-pulse" />
                            <h3 className="text-xl font-bold">Mode Visite 3D</h3>
                            <p className="text-gray-400 mt-2">
                                Utilisez votre souris pour explorer la pièce.
                                (Fonctionnalité simulée: nécessite des images panoramiques réelles)
                            </p>
                            <div className="mt-8 perspective-1000">
                                <img
                                    src={images[currentIndex] || "/placeholder-house.jpg"}
                                    className="w-64 h-40 object-cover rotate-y-12 shadow-2xl rounded-lg mx-auto transform hover:rotate-y-0 transition-transform duration-1000"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            setCurrentIndex(idx);
                            setViewMode("photos");
                        }}
                        className={`relative h-20 rounded-md overflow-hidden ${idx === currentIndex ? "ring-2 ring-black" : "opacity-70 hover:opacity-100"}`}
                    >
                        <img src={img} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
}
