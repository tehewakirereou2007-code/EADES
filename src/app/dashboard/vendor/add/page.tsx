import AddPropertyForm from "@/components/dashboard/AddPropertyForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Ajouter un bien | EADES",
};

export default async function AddPropertyPage() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'VENDEUR' && session.user.role !== 'ADMIN') {
        redirect("/auth/signin");
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Ajouter un nouveau bien</h1>
                <AddPropertyForm />
            </div>
        </div>
    );
}
