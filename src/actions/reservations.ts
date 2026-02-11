"use server";

import { prisma } from "@/lib/prisma";

export async function createReservation(userId: string, houseId: string, note?: string) {
    if (!userId || !houseId) throw new Error("Données manquantes");

    // Check if already reserved by this user
    const existing = await prisma.reservation.findFirst({
        where: { userId, houseId, status: "EN_ATTENTE" }
    });

    if (existing) throw new Error("Vous avez déjà une réservation en attente pour ce bien.");

    const reservation = await prisma.reservation.create({
        data: {
            userId,
            houseId,
            note,
            status: "EN_ATTENTE"
        }
    });

    return reservation;
}

export async function getUserReservations(userId: string) {
    return await prisma.reservation.findMany({
        where: { userId },
        include: {
            house: {
                include: { neighborhood: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
}
