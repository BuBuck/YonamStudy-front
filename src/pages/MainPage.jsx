import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StudyGroupCard from "../components/StudyGroupCard/StudyGroupCard";
import HeroCarousel from "../components/HeroCarousel/HeroCarousel";

import "./MainPage.css";

function MainPage() {
    const [featuredGroups, setFeaturedGroups] = useState([]);

    useEffect(() => {
        const handleGetAllGroups = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/`
                );

                setFeaturedGroups(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        handleGetAllGroups();
    }, []);

    return (
        <main className="main-page">
            {/* Hero Section */}
            <section className="hero-section">
                <HeroCarousel />
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            함께 성장하는
                            <br />
                            <span className="hero-title-accent">스터디 그룹</span>
                        </h1>

                        <p className="hero-description">
                            연암공과대학교 학생들을 위한 스터디 그룹 매칭 플랫폼입니다.
                            <br />
                            같은 목표를 가진 팀원들과 함께 성장해보세요.
                        </p>

                        <div className="hero-actions">
                            <Link to="/search" className="btn btn-primary btn-lg">
                                스터디 찾기
                            </Link>
                            <Link
                                to="/createGroup"
                                className="btn btn-outline btn-lg"
                                style={{ color: "white" }}
                            >
                                그룹 만들기
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Groups Section */}
            <section className="featured-section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">인기 스터디 그룹</h2>
                            <p className="section-description">
                                지금 가장 인기있는 스터디 그룹을 만나보세요
                            </p>
                        </div>
                        <Link to="/search" className="btn btn-secondary" style={{ width: "100px" }}>
                            전체보기
                        </Link>
                    </div>

                    <div className="groups-grid">
                        {featuredGroups.map((group) => (
                            <StudyGroupCard key={group._id} group={group} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">지금 바로 시작하세요</h2>
                        <p className="cta-description">
                            원하는 스터디가 없다면 직접 만들어보세요!
                            <br />
                            당신의 열정을 공유할 팀원들을 기다리고 있습니다.
                        </p>
                        <Link to="/create-group" className="btn btn-primary btn-lg">
                            스터디 그룹 만들기
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default MainPage;
