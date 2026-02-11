"use server";

import { prisma } from "@/lib/prisma";
import { levenshtein } from "fast-levenshtein"; // Note: might need to check import style
// fast-levenshtein usually exports 'get'
import * as Levenshtein from "fast-levenshtein";

const THRESHOLD = 3; // Max distance for fuzzy match

function normalizeName(name: string): string {
    return name.trim().toLowerCase();
}

function capitalize(name: string): string {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

/**
 * Finds a neighborhood matching the input name, handling loose matching.
 * If no match found, creates a new one.
 */
export async function getOrCreateNeighborhood(inputName: string) {
    if (!inputName) throw new Error("Nom du quartier requis");

    const normalizedInput = normalizeName(inputName);

    // 1. Try exact match (case insensitive via prisma if db supports it, but here we do manual check or rely on findFirst)
    // SQLite doesn't strictly support case-insensitive unique without setup, so we search all and filter in memory if needed, 
    // or just search by name if we ensure stored names are capitalized consistently.

    // Let's try to find an exact match first (ignoring case)
    const allNeighborhoods = await prisma.neighborhood.findMany({
        select: { id: true, name: true }
    });

    // Strict match check
    let match = allNeighborhoods.find(n => normalizeName(n.name) === normalizedInput);

    if (match) return match;

    // 2. Fuzzy match
    // We iterate over all neighborhoods and find the closest one.
    let bestMatch: typeof match | null = null;
    let minDistance = Infinity;

    for (const n of allNeighborhoods) {
        const dist = Levenshtein.get(normalizedInput, normalizeName(n.name));
        if (dist < minDistance) {
            minDistance = dist;
            bestMatch = n;
        }
    }

    // If the best match is within threshold, use it
    if (bestMatch && minDistance <= THRESHOLD) {
        return bestMatch;
    }

    // 3. No match found, create new
    // Auto-capitalize: "adidogome" -> "Adidogome"
    // For complex names like "Agoe-Nyive", simple capitalization might not be enough, 
    // but better than "AGOE-NYIVE".
    // We will simple-capitalize first letter.
    const formattingName = inputName
        .trim()
        .toLowerCase()
        .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());

    // Check again just in case async conditions created it (unlikely in this flow but good practice)
    const existing = await prisma.neighborhood.findUnique({
        where: { name: formattingName }
    });

    if (existing) return existing;

    const newNeighborhood = await prisma.neighborhood.create({
        data: { name: formattingName }
    });

    return newNeighborhood;
}

export async function getNeighborhoods() {
    const neighborhoods = await prisma.neighborhood.findMany({
        orderBy: { name: 'asc' },
        include: { _count: { select: { houses: true } } }
    });
    return neighborhoods;
}
