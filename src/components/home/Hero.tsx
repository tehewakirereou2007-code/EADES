import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Hero() {
    return (
        <div className="relative bg-gray-900 overflow-hidden">
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                    alt="Architecture moderne Éades"
                    className="w-full h-full object-cover opacity-30 grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40" />
            </div>

            <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                <h1 className="text-4xl md:text-6xl font-extrabold text-black mb-6 leading-tight">
                    Bienvenue sur EADES <br />
                    <span className="text-gray-600 italic font-medium text-3xl md:text-4xl">
                        L'endroit où vous trouvez les appartements de vos rêves
                    </span>
                </h1>
                <p className="mt-6 text-xl text-gray-700 max-w-3xl">
                    Découvrez une sélection exclusive de biens immobiliers au Togo.
                </p>
                <div className="mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-start">
                    <Link href="/search">
                        <Button size="lg" className="w-full sm:w-auto px-8 py-3 text-lg bg-gray-900 hover:bg-black text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                            Visiter nos appartements disponibles
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
