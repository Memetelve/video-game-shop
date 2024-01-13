import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

enum Currency {
    USD = "USD",
    EUR = "EUR",
    GBP = "GBP",
    PLN = "PLN",
}

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

const defaultContext = {
    sessionToken: "",
    setSessionToken: (token: string) => {},
    currency: Currency.USD,
    setCurrency: (currency: Currency) => {},
    user: {},
    setUser: (user: User) => {},
};

const Context = createContext(defaultContext);

export function useAppContext() {
    return useContext(Context);
}

export default function ContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sessionToken, setSessionToken] = useState("");
    const [currency, setCurrency] = useState(Currency.USD);
    const [user, setUser] = useState<User>({
        id: 0,
        username: "",
        email: "",
        role: "",
    });

    useEffect(() => {
        const sessionToken = localStorage.getItem("sessionToken") || "";
        setSessionToken(sessionToken);
    }, []);

    return (
        <Context.Provider
            value={{
                sessionToken: sessionToken || "",
                setSessionToken: setSessionToken,
                currency: currency,
                setCurrency: setCurrency,
                user: user,
                setUser: setUser,
            }}
        >
            {children}
        </Context.Provider>
    );
}
