import Hero from "@/components/home/Hero";
import FeaturedSection from "@/components/home/FeaturedSection";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      {user && (
        <div className="bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Bonjour, {user.name} !
            </h2>
            <p className="text-gray-600">Heureux de vous revoir sur KIRAEDES.</p>
          </div>
        </div>
      )}

      <FeaturedSection />

      <section className="bg-black py-16 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Vous vendez un bien ?</h2>
          <p className="text-lg opacity-90 mb-8">
            Rejoignez notre réseau de vendeurs et touchez des milliers d'acheteurs potentiels dès aujourd'hui.
          </p>
          <Link href="/auth/signup" className="bg-white text-black px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all">
            Devenir Vendeur
          </Link>
        </div>
      </section>
    </div>
  );
}
