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
});

type HouseFormValues = z.infer<typeof houseFormSchema>;

export default function AddPropertyForm() {
    const router = useRouter();
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const [base64Images, setBase64Images] = useState<string[]>([]);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const {
        register,
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
        },
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setUploadError(null);
        const newImages: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Basic validation
            if (file.size > 2 * 1024 * 1024) { // 2MB limit per image
                setUploadError("Chaque image doit faire moins de 2 Mo");
                return;
            }

            try {
                const base64 = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
                newImages.push(base64);
            } catch (err) {
                console.error("Error reading file:", err);
            }
        }

        setBase64Images(prev => [...prev, ...newImages]);
    };

    const removeImage = (index: number) => {
        setBase64Images(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: any) => {
        if (!session?.user?.id) return;
        if (base64Images.length === 0) {
            setUploadError("Au moins une image est requise");
            return;
        }

        setIsLoading(true);
        try {
            await createHouse({
                ...data,
                images: base64Images,
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Photos du bien</label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    {base64Images.map((img, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                            <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-black hover:bg-gray-50 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="text-xs text-gray-500 mt-2">Ajouter</span>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>
                </div>

                {uploadError && <p className="text-red-500 text-sm mt-1">{uploadError}</p>}
                <p className="text-xs text-gray-400 mt-1">
                    Sélectionnez plusieurs photos. Taille max : 2 Mo par photo.
                </p>
            </div>

            <div className="pt-4 border-t">
                <Button type="submit" className="w-full" isLoading={isLoading}>
                    Publier l'annonce
                </Button>
            </div>
        </form>
    );
}
