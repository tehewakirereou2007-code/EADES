"use server";

import { prisma } from "@/lib/prisma";
import { getOrCreateNeighborhood as getOrCreateParams } from "@/lib/neighborhood";

/**
 * Finds a neighborhood matching the input name, handling normalization.
 * Delegates to the detailed logic in src/lib/neighborhood.ts
 */
export async function getOrCreateNeighborhood(inputName: string) {
    return await getOrCreateParams(inputName);
}

export async function getNeighborhoods() {
    const neighborhoods = await prisma.neighborhood.findMany({
        orderBy: { name: 'asc' },
        include: { _count: { select: { houses: true } } }
    });
    return neighborhoods;
}
