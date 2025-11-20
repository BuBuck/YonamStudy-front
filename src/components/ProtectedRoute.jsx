import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    if (!isAuthenticated) {
        alert("로그인이 필요합니다.");
        return <Navigate to="/auth" replace />;
    }

    return children;
}

export default ProtectedRoute;
