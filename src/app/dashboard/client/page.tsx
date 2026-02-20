import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserReservations } from "@/actions/reservations";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

export const metadata = {
    title: "Mon Compte | KIRAEDES",
};

export default async function ClientDashboard() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin");
    }

    const reservations = await getUserReservations(session.user.id);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Bienvenue, {session.user.name}</h1>

                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-6 text-gray-800">Mes Réservations</h2>

                    {reservations.length === 0 ? (
                        <p className="text-gray-500">Vous n'avez effectué aucune réservation pour le moment.</p>
                    ) : (
                        <div className="grid gap-6">
                            {reservations.map((res) => (
                                <div key={res.id} className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{res.house.title}</h3>
                                        <p className="text-sm text-gray-600">{res.house.neighborhood.name}</p>
                                        <p className="text-black font-medium">{formatPrice(res.house.price)}</p>
                                        <p className="text-xs text-gray-500 mt-2">Démandé le {new Date(res.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${res.status === 'CONFIRME' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {res.status}
                                        </span>
                                        <Link href={`/property/${res.houseId}`} className="text-blue-600 hover:underline text-sm">
                                            Voir le bien
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
