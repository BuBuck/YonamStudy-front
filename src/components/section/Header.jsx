import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { GoSearch } from "react-icons/go";

import "./Header.css";

function Header({ isAuthenticated, setIsAuthenticated, user, setUser }) {
    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("expiresAt");
        localStorage.removeItem("expiresToken");

        setUser(null);
        setIsAuthenticated(false);

        alert("로그아웃 되었습니다.");
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <div className="header-content-top">
                        <Link to="/" className="logo">
                            <span className="logo-icon">Y</span>
                            <span className="logo-text">YonamStudy</span>
                        </Link>

                        <form className="search-form" onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="스터디 그룹 검색..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                            <button type="submit" className="search-button">
                                <GoSearch size={20} stroke="currentColor" />
                            </button>
                        </form>

                        <div className="user-menu">
                            {isAuthenticated ? (
                                <>
                                    <button
                                        className="btn btn-primary logout"
                                        onClick={handleLogout}
                                    >
                                        로그아웃
                                    </button>
                                    <button className="user-button">
                                        <div
                                            className="user-avatar"
                                            onClick={() => navigate(`/dashboard/${user.studentId}`)}
                                        >
                                            {user?.userProfile ? (
                                                <img
                                                    src={`${import.meta.env.VITE_BACKEND_URL}${
                                                        user.userProfile
                                                    }`}
                                                    className="user-avatar"
                                                />
                                            ) : (
                                                user?.name?.[0]
                                            )}
                                        </div>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => navigate("/auth/login")}
                                    >
                                        로그인
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => navigate("/auth/signup")}
                                    >
                                        회원가입
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
