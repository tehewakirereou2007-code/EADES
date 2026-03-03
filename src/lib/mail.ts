import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeEmail = async (email: string, name: string) => {
    try {
        await resend.emails.send({
            from: "KIRAEDES <onboarding@resend.dev>",
            to: email,
            subject: "Bienvenue chez KIRAEDES !",
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; rounded-lg: 12px;">
                    <h1 style="color: #000; font-size: 24px; font-weight: bold; margin-bottom: 16px;">Bienvenue, ${name} !</h1>
                    <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                        Nous sommes ravis de vous accueillir sur <strong>KIRAEDES</strong>, votre plateforme immobilière de confiance.
                    </p>
                    <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                        Que vous soyez à la recherche de votre futur chez-vous ou que vous souhaitiez mettre en vente un bien, nous sommes là pour vous accompagner à chaque étape.
                    </p>
                    <div style="text-align: center; margin-bottom: 24px;">
                        <a href="${process.env.NEXTAUTH_URL}" style="background-color: #000; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">
                            Accéder à mon tableau de bord
                        </a>
                    </div>
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">
                        Si vous avez des questions, n'hésitez pas à répondre à cet email.
                    </p>
                    <p style="color: #6b7280; font-size: 14px; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
                         L'équipe KIRAEDES
                    </p>
                </div>
            `,
        });
    } catch (error) {
        console.error("Error sending welcome email:", error);
    }
};
