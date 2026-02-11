import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import VendorPropertyList from "@/components/dashboard/VendorPropertyList";
import Button from "@/components/ui/Button";
import { getHouses } from "@/actions/properties";

export const metadata = {
    title: "Espace Vendeur | EADES",
};

export default async function VendorDashboard() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'VENDEUR' && session.user.role !== 'ADMIN') {
        redirect("/auth/signin");
    }

    const houses = await getHouses({ vendorId: session.user.id });

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Vendeur</h1>
                    <Link href="/dashboard/vendor/add">
                        <Button>Ajouter un nouveau bien</Button>
                    </Link>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Mes biens immobiliers</h2>
                    <VendorPropertyList houses={houses} />
                </div>
            </div>
        </div>
    );
}
