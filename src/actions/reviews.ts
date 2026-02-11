"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addReview(houseId: string, userId: string, rating: number, comment: string) {
    if (!userId || !houseId) throw new Error("Utilisateur non connecté");
    if (rating < 1 || rating > 5) throw new Error("Note invalide");

    const review = await prisma.review.create({
        data: {
            houseId,
            userId,
            rating,
            comment,
        }
    });

    revalidatePath(`/property/${houseId}`);
    return review;
}
