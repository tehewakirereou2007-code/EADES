"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { signUpSchema, SignUpValues } from "@/lib/validations/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { signIn } from "next-auth/react";

export default function SignUpForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            role: "CLIENT",
        },
    });

    const onSubmit = async (data: SignUpValues) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Une erreur est survenue");
            }

            // Connexion automatique après inscription
            await signIn("credentials", {
                email: data.email,
                password: data.password,
                callbackUrl: "/",
            });

        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Une erreur est survenue");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6 border border-gray-100">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">Créer un compte</h2>
                <p className="mt-2 text-gray-600">Rejoignez la communauté KIRAEDES</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Nom complet"
                    type="text"
                    placeholder="Jean Dupont"
                    error={errors.name?.message}
                    {...register("name")}
                />

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

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Je suis
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <label className="cursor-pointer">
                            <input
                                type="radio"
                                value="CLIENT"
                                className="peer sr-only"
                                {...register("role")}
                            />
                            <div className="rounded-md border border-gray-200 p-3 text-center hover:bg-gray-50 peer-checked:border-black peer-checked:bg-gray-100 peer-checked:text-black transition-all">
                                Client
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input
                                type="radio"
                                value="VENDEUR"
                                className="peer sr-only"
                                {...register("role")}
                            />
                            <div className="rounded-md border border-gray-200 p-3 text-center hover:bg-gray-50 peer-checked:border-black peer-checked:bg-gray-100 peer-checked:text-black transition-all">
                                Vendeur
                            </div>
                        </label>
                    </div>
                    {errors.role && (
                        <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                    )}
                </div>

                <Button type="submit" className="w-full" isLoading={isLoading}>
                    S'inscrire
                </Button>
            </form>

            <p className="text-center text-sm text-gray-600">
                Déjà un compte ?{" "}
                <Link href="/auth/signin" className="text-black hover:underline font-medium">
                    Se connecter
                </Link>
            </p>
        </div>
    );
}
