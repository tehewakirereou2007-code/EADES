export function formatPrice(price: number): string {
    return new Intl.NumberFormat("fr-TG", {
        style: "currency",
        currency: "XOF",
        maximumFractionDigits: 0,
    }).format(price);
}
