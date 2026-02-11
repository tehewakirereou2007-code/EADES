"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { divIcon } from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { FaMapMarkerAlt } from "react-icons/fa";

interface PropertyMapProps {
    latitude?: number;
    longitude?: number;
    locationName: string;
}

export default function PropertyMap({ latitude, longitude, locationName }: PropertyMapProps) {
    if (!latitude || !longitude) {
        return (
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                Carte non disponible pour ce bien.
            </div>
        );
    }

    const iconMarkup = renderToStaticMarkup(
        <FaMapMarkerAlt className="text-red-600 text-3xl drop-shadow-md" />
    );

    const customMarkerIcon = divIcon({
        html: iconMarkup,
        className: "bg-transparent",
        iconSize: [30, 30],
        iconAnchor: [15, 30],
    });

    return (
        <MapContainer
            center={[latitude, longitude]}
            zoom={15}
            scrollWheelZoom={false}
            className="h-96 w-full rounded-lg shadow-md z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[latitude, longitude]} icon={customMarkerIcon}>
                <Popup>{locationName}</Popup>
            </Marker>
        </MapContainer>
    );
}
