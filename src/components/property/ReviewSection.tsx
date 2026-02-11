"use client";

import { useState } from "react";
import { FaStar, FaUserCircle } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";
import { addReview } from "@/actions/reviews";
import { useRouter } from "next/navigation";

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: Date;
    user: { name: string | null; image: string | null };
}

interface ReviewSectionProps {
    houseId: string;
    reviews: Review[];
}

export default function ReviewSection({ houseId, reviews }: ReviewSectionProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user) {
            router.push("/api/auth/signin");
            return;
        }

        setIsSubmitting(true);
        try {
            await addReview(houseId, session.user.id as string, rating, comment);
            setComment("");
            setRating(5);
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'envoi de l'avis");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-12 border-t border-gray-100 pt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Avis ({reviews.length})</h3>

            <div className="space-y-6 mb-10">
                {reviews.length === 0 ? (
                    <p className="text-gray-500 italic">Aucun avis pour le moment. Soyez le premier !</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                                <div className="mr-3">
                                    {review.user.image ? (
                                        <img src={review.user.image} alt={review.user.name || "User"} className="w-8 h-8 rounded-full" />
                                    ) : (
                                        <FaUserCircle className="w-8 h-8 text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{review.user.name || "Anonyme"}</p>
                                    <div className="flex text-black text-sm">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} className={i < review.rating ? "text-black" : "text-gray-300"} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Laisser un avis</h4>
                {session ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                            <div className="flex space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`text-2xl transition-colors ${rating >= star ? "text-black" : "text-gray-300 hover:text-gray-400"}`}
                                    >
                                        <FaStar />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black p-2 border"
                                rows={3}
                                placeholder="Votre expérience..."
                                required
                            />
                        </div>
                        <Button type="submit" isLoading={isSubmitting}>
                            Publier l'avis
                        </Button>
                    </form>
                ) : (
                    <div className="text-center p-6 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 mb-4">Vous devez être connecté pour laisser un avis.</p>
                        <Button onClick={() => router.push("/api/auth/signin")}>Se connecter</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
