import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth/AuthContext";

function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    if (!isAuthenticated && !isLoading) {
        alert("로그인이 필요합니다.");
        return <Navigate to="/auth" />;
    }

    return children;
}

export default ProtectedRoute;
