export function convertPrice(price: number, currency: string) {
    if (currency === "EUR") {
        return price;
    } else if (currency === "USD") {
        return price * 1.18;
    } else if (currency === "GBP") {
        return price * 0.86;
    }

    return price;
}
