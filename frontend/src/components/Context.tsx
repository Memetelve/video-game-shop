import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

const defaultContext = {
    sessionToken: "",
    setSessionToken: (token: string) => {},
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

    useEffect(() => {
        const sessionToken = localStorage.getItem("sessionToken") || "";
        setSessionToken(sessionToken);
    }, []);

    return (
        <Context.Provider
            value={{
                sessionToken: sessionToken || "",
                setSessionToken: setSessionToken,
            }}
        >
            {children}
        </Context.Provider>
    );
}
