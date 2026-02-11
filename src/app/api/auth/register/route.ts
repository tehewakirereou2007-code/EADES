import { prisma } from "@/lib/prisma";
import { signUpSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, name, role } = signUpSchema.parse(body);

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "Cet email est déjà utilisé" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role,
            },
        });

        // Ne pas renvoyer le mot de passe
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(
            { message: "Utilisateur créé avec succès", user: userWithoutPassword },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: "Données invalides", errors: error.errors },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { message: "Une erreur est survenue lors de l'inscription" },
            { status: 500 }
        );
    }
}
