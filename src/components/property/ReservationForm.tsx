"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { createReservation } from "@/actions/reservations";
import { FaWhatsapp } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface ReservationFormProps {
    houseId: string;
    houseTitle: string;
    vendorPhone?: string | null;
}

export default function ReservationForm({ houseId, houseTitle, vendorPhone }: ReservationFormProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleReserve = async () => {
        if (!session?.user) {
            router.push("/api/auth/signin?callbackUrl=/property/" + houseId);
            return;
        }

        setIsLoading(true);
        try {
            // 1. Create reservation in DB
            await createReservation(session.user.id as string, houseId, "Intéressé par ce bien");

            // 2. Redirect to WhatsApp
            const companyPhone = "22870059471"; // As requested
            const text = `Bonjour, je suis intéressé par la maison : ${houseTitle} (ID: ${houseId}). J'aimerais organiser une visite.`;
            const whatsappUrl = `https://wa.me/${companyPhone}?text=${encodeURIComponent(text)}`;

            window.open(whatsappUrl, "_blank");
            setMessage("Réservation enregistrée ! Redirection vers WhatsApp...");

        } catch (error) {
            if (error instanceof Error) {
                setMessage(error.message);
            } else {
                setMessage("Erreur lors de la réservation");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Intéressé ?</h3>
            <p className="text-gray-600 mb-6 text-sm">
                Réservez une visite directement via WhatsApp avec notre équipe.
            </p>

            {message && (
                <div className={`p-3 rounded-md text-sm mb-4 ${message.includes("Erreur") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                    {message}
                </div>
            )}

            <Button
                onClick={handleReserve}
                className="w-full bg-black hover:bg-gray-800 text-white flex items-center justify-center gap-2"
                isLoading={isLoading}
            >
                <FaWhatsapp className="text-xl" />
                Réserver via WhatsApp
            </Button>

            <p className="text-xs text-gray-400 mt-4 text-center">
                Aucun paiement n'est requis pour la réservation.
            </p>
        </div>
    );
}
