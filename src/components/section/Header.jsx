import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { GoSearch } from "react-icons/go";

function Header({ isAuthenticated, user }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <div className="header-content-top">
                        <Link to="/" className="logo">
                            <div className="logo-icon">Y</div>
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
                            <button className="user-button">
                                <div
                                    className="user-avatar"
                                    onClick={() => navigate(`/dashboard/${user.studentId}`)}
                                >
                                    {user.studentId ? (
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
                        </div>
                    </div>

                    <nav className={`nav ${mobileMenuOpen ? "nav-open" : ""}`}>
                        <Link to="/" className="nav-link">
                            홈
                        </Link>
                        <Link to="/search" className="nav-link">
                            스터디 찾기
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link to="/create-group" className="nav-link">
                                    그룹 만들기
                                </Link>
                                <Link to="/chat" className="nav-link">
                                    채팅
                                </Link>
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
                                    onClick={() => navigate("/auth/login")}
                                >
                                    회원가입
                                </button>
                            </>
                        )}
                    </nav>

                    <button
                        className="mobile-menu-button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M3 12h18M3 6h18M3 18h18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
