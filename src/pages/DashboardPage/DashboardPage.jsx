import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import UserInfo from "../../components/Dashboard/UserInfo";
import MyGroupList from "../../components/group/MyGroupList";

import { GoSearch } from "react-icons/go";
import { GoCommentDiscussion } from "react-icons/go";

import "./DashboardPage.css";

function DashboardPage() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    // 로그인하지 않은 경우 로그인 페이지로 이동
    useEffect(() => {
        if (!user) {
            navigate("/auth/login");
        }
    }, [user, navigate]);

    if (!user) {
        return null;
    }

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header">
                    <div>
                        <h1>대시보드</h1>
                        <p>안녕하세요, {user.name}님!👋</p>
                    </div>
                    <button
                        className="create-group-button"
                        onClick={() => navigate("/createGroup")}
                    >
                        새 그룹 만들기
                    </button>
                </div>

                <UserInfo user={user} />

                <div className="dashboard-layout">
                    <section className="dashboard-section">
                        <div className="section-header">
                            <h2>내 스터디 그룹</h2>
                            <div className="section-link" onClick={() => navigate("/search")}>
                                더보기
                            </div>
                        </div>
                        <MyGroupList groups={user.group} userId={user.userId} />
                    </section>
                    <aside className="dashboard-sidebar">
                        <div className="sidebar-section">
                            <h2>내가 작성한 신청서</h2>
                            {/* 신청서 컴포넌트 */}
                        </div>
                        <div className="sidebar-section">
                            <h2>바로가기</h2>
                            <div className="quick-links">
                                <a className="quick-link" href="/search">
                                    <GoSearch />
                                    <div>스터디 찾기</div>
                                </a>
                                <a className="quick-link" href="/chat">
                                    <GoCommentDiscussion />
                                    <div>채팅</div>
                                </a>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
