import React, { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth/AuthContext";

function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useContext(AuthContext);

    const navigate = useNavigate();

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    if (!isAuthenticated) {
        alert("로그인이 필요합니다.");
        return navigate("/auth");
    }

    return children;
}

export default ProtectedRoute;
