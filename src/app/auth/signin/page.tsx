import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Connexion | KIRAEDES",
    description: "Connectez-vous à votre compte KIRAEDES",
};

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <SignInForm />
            </div>
        </div>
    );
}
