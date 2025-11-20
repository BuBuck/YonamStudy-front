import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

function handleLogoutCleanup() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAt");
    localStorage.removeItem("user");
}

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = localStorage.getItem("token");
                const expiresAt = localStorage.getItem("expiresAt");

                if (!token || !expiresAt) {
                    handleLogoutCleanup();
                }

                const currentTime = new Date().getTime();
                const expirationTime = Number(expiresAt);

                if (currentTime <= expirationTime) {
                    setIsAuthenticated(true);
                    setIsLoading(false);
                } else {
                    handleLogoutCleanup();
                    setIsLoading(false);
                }
            } catch (err) {
                setIsAuthenticated(false);
                setIsLoading(false);
                console.error(err.message);
            }
        };

        checkLoginStatus();
    }, [isAuthenticated]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
