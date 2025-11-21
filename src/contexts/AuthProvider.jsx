import { useEffect, useState } from "react";

import { AuthContext } from "./AuthContext";

function handleLogoutCleanup() {
    localStorage.removeItem("expiresToken");
    localStorage.removeItem("expiresAt");
    localStorage.removeItem("user");
}

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const expiresToken = localStorage.getItem("expiresToken");
                const expiresAt = localStorage.getItem("expiresAt");

                if (!expiresToken || !expiresAt) {
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
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
