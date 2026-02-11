"use server";

import { prisma } from "@/lib/prisma";
import { getOrCreateNeighborhood } from "./neighborhoods";
import { House, Prisma } from "@prisma/client";
import { z } from "zod";

const houseSchema = z.object({
    title: z.string().min(5),
    description: z.string().min(10),
    price: z.coerce.number().positive(),
    location: z.string().optional(),
    neighborhoodName: z.string().min(2),
    vendorId: z.string(),
    images: z.array(z.string()).min(1), // Array of URLs
    status: z.enum(["DISPONIBLE", "LOUE", "VENDU"]).default("DISPONIBLE"),
});

export type HouseInput = z.infer<typeof houseSchema>;

export async function createHouse(data: HouseInput) {
    const parsed = houseSchema.parse(data);

    // 1. Handle Neighborhood
    const neighborhood = await getOrCreateNeighborhood(parsed.neighborhoodName);

    // 2. Create House
    const house = await prisma.house.create({
        data: {
            title: parsed.title,
            description: parsed.description,
            price: parsed.price,
            location: parsed.location,
            neighborhoodId: neighborhood.id,
            vendorId: parsed.vendorId,
            status: parsed.status,
            images: JSON.stringify(parsed.images), // Store as JSON string as per schema
        }
    });

    return house;
}

export async function getHouses(filter?: {
    neighborhoodId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    vendorId?: string;
}) {
    const where: Prisma.HouseWhereInput = {};

    // Only filter by status DISPONIBLE if not a vendor viewing their own
    if (!filter?.vendorId) {
        where.status = "DISPONIBLE";
    }

    if (filter?.vendorId) {
        where.vendorId = filter.vendorId;
    }

    if (filter?.neighborhoodId) {
        where.neighborhoodId = filter.neighborhoodId;
    }

    if (filter?.minPrice !== undefined) {
        where.price = { ...where.price as object, gte: filter.minPrice };
    }

    if (filter?.maxPrice !== undefined) {
        where.price = { ...where.price as object, lte: filter.maxPrice };
    }

    if (filter?.search) {
        where.OR = [
            { title: { contains: filter.search, mode: 'insensitive' } },
            { description: { contains: filter.search, mode: 'insensitive' } },
            { neighborhood: { name: { contains: filter.search, mode: 'insensitive' } } }
        ];
    }

    // Note: Prisma with SQLite might need case-insensitive mode explicitly enabled or defaults vary.
    // For now simple contains.

    const houses = await prisma.house.findMany({
        where,
        include: {
            neighborhood: true,
            vendor: {
                select: { name: true, phone: true, image: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return houses;
}

export async function getHouseById(id: string) {
    const house = await prisma.house.findUnique({
        where: { id },
        include: {
            neighborhood: true,
            vendor: {
                select: { name: true, email: true, phone: true, image: true }
            },
            reviews: {
                include: { user: { select: { name: true, image: true } } }
            }
        }
    });
    return house;
}

export async function updateHouseStatus(houseId: string, status: "DISPONIBLE" | "LOUE" | "VENDU") {
    const house = await prisma.house.update({
        where: { id: houseId },
        data: { status }
    });
    return house;
}
