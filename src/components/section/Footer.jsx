import React from "react";

import { Link } from "react-router-dom";

import { LuInstagram } from "react-icons/lu";
import { RxGithubLogo } from "react-icons/rx";

import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <div className="footer-logo">
                            <div className="logo-icon">Y</div>
                            <span className="logo-text">YonamStudy</span>
                        </div>
                        <p className="footer-description">
                            연암공과대학교 학생들을 위한 스터디 그룹 매칭 플랫폼
                        </p>
                        <div className="footer-social">
                            <a
                                href="https://www.instagram.com/s._.jeongin/"
                                className="social-link"
                                aria-label="Instagram"
                            >
                                <LuInstagram size={20} stroke="currentColor" />
                            </a>
                            <a
                                href="https://github.com/BuBuck"
                                className="social-link"
                                aria-label="GitHub"
                            >
                                <RxGithubLogo size={20} fill="currentColor" />
                            </a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-title">서비스</h4>
                        <ul className="footer-links">
                            <li>
                                <Link to="/search">스터디 찾기</Link>
                            </li>
                            <li>
                                <Link to="/createGroup">그룹 만들기</Link>
                            </li>
                            <li>
                                <Link to="/dashboard">대시보드</Link>
                            </li>
                            <li>
                                <Link to="/chat">채팅</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-title">프로젝트 GitHub</h4>
                        <ul className="footer-links">
                            <li>
                                <Link to="https://github.com/BuBuck/YonamStudy-front">
                                    Frontend
                                </Link>
                            </li>
                            <li>
                                <Link to="https://github.com/BuBuck/YonamStudy-back">Backend</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">&copy; 2025 YonamStudy. All rights reserved.</p>
                    <p className="footer-info">
                        연암공과대학교 JavaScript 기말 프로젝트 team, Babtudy
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
