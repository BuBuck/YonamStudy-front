import React from "react";
import { useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/auth");
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("expiresAt");
        localStorage.removeItem("expiresToken");
    };

    return (
        <header id="header" role="header">
            <button onClick={handleLogin}>로그인</button>
            <button onClick={handleLogout}>로그아웃</button>
        </header>
    );
}

export default Header;
