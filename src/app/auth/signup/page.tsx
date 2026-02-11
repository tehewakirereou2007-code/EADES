import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Inscription | EADES",
    description: "Créez votre compte EADES",
};

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <SignUpForm />
            </div>
        </div>
    );
}
