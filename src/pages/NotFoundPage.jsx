import React from "react";
import { useNavigate } from "react-router-dom";

import { FaHome } from "react-icons/fa";

import "./NotFoundPage.css";
import { GoArrowLeft } from "react-icons/go";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found-page">
            <div className="not-found-container">
                <div className="not-found-content">
                    <h1 className="not-found-title">404</h1>
                    <h2 className="not-found-subtitle">페이지를 찾을 수 없습니다</h2>
                    <p className="not-found-description">
                        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
                    </p>
                    <div className="not-found-actions">
                        <div className="btn-home" onClick={() => navigate("/")}>
                            <FaHome size={20} stroke="currentColor" />
                            홈으로 돌아가기
                        </div>
                        <button className="btn-back" onClick={() => navigate(-1)}>
                            <GoArrowLeft size={20} stroke="currentColor" />
                            뒤로가기
                        </button>
                    </div>
                </div>
                <div className="not-found-illustration">
                    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="200" cy="150" r="120" fill="#e8f0f0" opacity="0.5" />
                        <path
                            d="M150 120 Q 150 100, 170 100 L 230 100 Q 250 100, 250 120 L 250 180 Q 250 200, 230 200 L 170 200 Q 150 200, 150 180 Z"
                            fill="#4a5568"
                            opacity="0.3"
                        />
                        <circle cx="180" cy="140" r="10" fill="#ff6b6b" />
                        <circle cx="220" cy="140" r="10" fill="#ff6b6b" />
                        <path
                            d="M 170 170 Q 200 160, 230 170"
                            stroke="#4a5568"
                            strokeWidth="3"
                            strokeLinecap="round"
                            fill="none"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
