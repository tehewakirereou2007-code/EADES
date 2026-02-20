"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { signInSchema, SignInValues } from "@/lib/validations/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function SignInForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInValues>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = async (data: SignInValues) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (result?.error) {
                setError("Email ou mot de passe incorrect");
            } else {
                router.push("/");
                router.refresh();
            }
        } catch (error) {
            setError("Une erreur est survenue");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        signIn("google", { callbackUrl: "/" });
    };

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6 border border-gray-100">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
                <p className="mt-2 text-gray-600">Bienvenue sur KIRAEDES</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Email"
                    type="email"
                    placeholder="votre@email.com"
                    error={errors.email?.message}
                    {...register("email")}
                />
                <Input
                    label="Mot de passe"
                    type="password"
                    placeholder="••••••••"
                    error={errors.password?.message}
                    {...register("password")}
                />

                <Button type="submit" className="w-full" isLoading={isLoading}>
                    Se connecter
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
                </div>
            </div>

            <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleGoogleSignIn}
            >
                <FaGoogle className="text-red-500" />
                Google
            </Button>

            <p className="text-center text-sm text-gray-600">
                Pas encore de compte ?{" "}
                <Link href="/auth/signup" className="text-black hover:underline font-medium">
                    S'inscrire
                </Link>
            </p>
        </div>
    );
}
