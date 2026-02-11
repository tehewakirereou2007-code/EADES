import { House, Neighborhood } from "@prisma/client";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { FaEdit, FaEye, FaSyncAlt } from "react-icons/fa";
import Button from "@/components/ui/Button";
import { updateHouseStatus } from "@/actions/properties";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface VendorPropertyListProps {
    houses: (House & { neighborhood: Neighborhood })[];
}

export default function VendorPropertyList({ houses }: VendorPropertyListProps) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const toggleStatus = async (houseId: string, currentStatus: string) => {
        setLoadingId(houseId);
        try {
            const newStatus = currentStatus === "DISPONIBLE" ? "LOUE" : "DISPONIBLE";
            await updateHouseStatus(houseId, newStatus);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la mise à jour du statut");
        } finally {
            setLoadingId(null);
        }
    };

    if (houses.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-4">Vous n'avez pas encore ajouté de biens.</p>
                <Link href="/dashboard/vendor/add">
                    <Button>Ajouter mon premier bien</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {houses.map((house) => (
                        <tr key={house.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{house.title}</div>
                                <div className="text-sm text-gray-500">{house.neighborhood.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-900">{formatPrice(house.price)}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px - 2 inline - flex text - xs leading - 5 font - semibold rounded - full ${house.status === 'DISPONIBLE' ? 'bg-green-100 text-green-800' :
                                    house.status === 'LOUE' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                    } `}>
                                    {house.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center space-x-3">
                                <Link href={`/ property / ${house.id} `} className="text-blue-600 hover:text-blue-900" title="Voir">
                                    <FaEye className="text-lg" />
                                </Link>
                                <button
                                    onClick={() => toggleStatus(house.id, house.status)}
                                    disabled={loadingId === house.id}
                                    className={`${house.status === 'DISPONIBLE' ? 'text-gray-400' : 'text-gray-700'} hover:opacity-80 disabled:opacity-50 transition-all`}
                                    title={house.status === 'DISPONIBLE' ? 'Marquer comme Loué' : 'Marquer comme Disponible'}
                                >
                                    <FaSyncAlt className={`text - lg ${loadingId === house.id ? 'animate-spin' : ''} `} />
                                </button>
                                <button className="text-gray-300 cursor-not-allowed" title="Modifier (Prochainement)">
                                    <FaEdit className="text-lg" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
