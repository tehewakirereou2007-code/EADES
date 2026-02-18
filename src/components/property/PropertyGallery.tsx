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
                    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                        {/* Enhanced 3D Panoramic Viewer */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-full h-full perspective-1000">
                                <div 
                                    className="absolute inset-0 transform-gpu transition-transform duration-700 ease-out hover:scale-110"
                                    style={{
                                        transformStyle: 'preserve-3d',
                                        animation: 'rotate3d 20s infinite linear'
                                    }}
                                >
                                    {/* Cube faces for 360° effect */}
                                    {images.slice(0, 6).map((img, idx) => {
                                        const transforms = [
                                            'rotateY(0deg) translateZ(200px)',
                                            'rotateY(90deg) translateZ(200px)',
                                            'rotateY(180deg) translateZ(200px)',
                                            'rotateY(-90deg) translateZ(200px)',
                                            'rotateX(90deg) translateZ(200px)',
                                            'rotateX(-90deg) translateZ(200px)',
                                        ];
                                        return (
                                            <div
                                                key={idx}
                                                className="absolute inset-0 opacity-80"
                                                style={{
                                                    transform: transforms[idx],
                                                    backfaceVisibility: 'hidden',
                                                }}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Vue ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Overlay Info */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 text-white">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <FaCube className="text-4xl animate-pulse" />
                                <h3 className="text-2xl font-bold">Visite 3D Interactive</h3>
                            </div>
                            <p className="text-center text-gray-300 text-sm">
                                Explorez cette propriété en 360°. Survolez pour zoomer.
                            </p>
                            <p className="text-center text-gray-400 text-xs mt-2">
                                💡 Astuce : Pour une expérience optimale, le vendeur peut ajouter des photos panoramiques 360°
                            </p>
                        </div>

                        {/* CSS Animation */}
                        <style jsx>{`
                            @keyframes rotate3d {
                                from {
                                    transform: rotateY(0deg) rotateX(10deg);
                                }
                                to {
                                    transform: rotateY(360deg) rotateX(10deg);
                                }
                            }
                            .perspective-1000 {
                                perspective: 1000px;
                            }
                        `}</style>
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
