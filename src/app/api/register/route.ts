import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function POST(req: Request) {
    try {
        const { email, password, name, phone, role } = await req.json();

        if (!email || !password || !name) {
            return new NextResponse("Champs manquants", { status: 400 });
        }

        const exists = await prisma.user.findUnique({
            where: { email },
        });

        if (exists) {
            return new NextResponse("Cet email est déjà utilisé", { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                phone,
                role: role === "VENDEUR" ? UserRole.VENDEUR : UserRole.CLIENT,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("REGISTRATION_ERROR", error);
        return new NextResponse("Erreur interne", { status: 500 });
    }
}
