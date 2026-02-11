"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./PropertyMap"), {
    ssr: false,
    loading: () => <div className="h-96 w-full bg-gray-100 rounded-lg animate-pulse" />
});

interface PropertyMapWrapperProps {
    latitude: number;
    longitude: number;
    locationName: string;
}

export default function PropertyMapWrapper(props: PropertyMapWrapperProps) {
    return <Map {...props} />;
}
