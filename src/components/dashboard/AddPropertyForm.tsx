"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { createHouse } from "@/actions/properties";
import { useSession } from "next-auth/react";

const houseFormSchema = z.object({
    title: z.string().min(5, "Titre trop court"),
    description: z.string().min(10, "Description trop courte"),
    price: z.number().positive("Le prix doit être positif"),
    neighborhoodName: z.string().min(2, "Nom du quartier requis"),
    location: z.string().optional(),
    images: z.array(z.string().url("URL invalide")).min(1, "Au moins une image requise"),
});

type HouseFormValues = z.infer<typeof houseFormSchema>;

export default function AddPropertyForm() {
    const router = useRouter();
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<HouseFormValues>({
        resolver: zodResolver(houseFormSchema),
        defaultValues: {
            title: "",
            description: "",
            price: 0,
            neighborhoodName: "",
            location: "",
            images: [""],
        },
    });

    const { fields, append, remove } = useFieldArray<HouseFormValues>({
        control,
        name: "images",
    });

    const onSubmit = async (data: HouseFormValues) => {
        if (!session?.user?.id) return;

        setIsLoading(true);
        try {
            await createHouse({
                ...data,
                vendorId: session.user.id,
                status: "DISPONIBLE",
            });
            router.push("/dashboard/vendor");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la création");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ajouter un bien</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Titre de l'annonce"
                    placeholder="ex: Villa moderne avec piscine"
                    error={errors.title?.message}
                    {...register("title")}
                />
                <Input
                    label="Prix (XOF)"
                    type="number"
                    placeholder="ex: 150000"
                    error={errors.price?.message}
                    {...register("price", { valueAsNumber: true })}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Quartier (Normalisé auto)"
                    placeholder="ex: Adidogomé"
                    error={errors.neighborhoodName?.message}
                    {...register("neighborhoodName")}
                />
                <Input
                    label="Précision adresse"
                    placeholder="ex: Près du marché"
                    error={errors.location?.message}
                    {...register("location")}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black p-2 border"
                    rows={4}
                    placeholder="Décrivez le bien en détail..."
                    {...register("description")}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Images (URLs)</label>
                <div className="space-y-2">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                            <Input
                                placeholder="http://..."
                                {...register(`images.${index}` as const)}
                                error={errors.images?.[index]?.message}
                            />
                            {index > 0 && (
                                <Button type="button" variant="danger" onClick={() => remove(index)}>
                                    Supprimer
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => append("")}
                    className="mt-2"
                >
                    Ajouter une image
                </Button>
                {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>}
            </div>

            <div className="pt-4 border-t">
                <Button type="submit" className="w-full" isLoading={isLoading}>
                    Publier l'annonce
                </Button>
            </div>
        </form>
    );
}
