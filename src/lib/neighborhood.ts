import { prisma } from "@/lib/prisma";

/**
 * Normalizes a neighborhood name for consistent storage and comparison.
 * Removes accents, converts to lowercase, and handles special characters.
 * Example: "Adidogomé" -> "adidogome"
 */
export function normalizeNeighborhoodName(name: string): string {
    if (!name) return "";
    return name
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9 ]/g, "") // Remove special chars except spaces
        .replace(/\s+/g, " "); // Collapse spaces
}

/**
 * Generates a URL-friendly slug from the normalized name.
 * Example: "adidogome" -> "adidogome", "New York" -> "new-york"
 */
export function createSlug(name: string): string {
    return normalizeNeighborhoodName(name).replace(/\s+/g, "-");
}

/**
 * Finds an existing neighborhood or creates a new one.
 * Uses the normalized slug to prevent duplicates with different spellings/accents.
 */
export async function getOrCreateNeighborhood(name: string) {
    if (!name) throw new Error("Neighborhood name is required");

    const slug = createSlug(name);

    // Try to find by slug first (most reliable)
    const existing = await prisma.neighborhood.findUnique({
        where: { slug }
    });

    if (existing) {
        return existing;
    }

    // Create new
    // We use the raw input name for display (e.g. "Tokoin")
    // and the normalized slug for uniqueness (e.g. "tokoin")
    return await prisma.neighborhood.create({
        data: {
            name: name.trim(),
            slug: slug
        }
    });
}
