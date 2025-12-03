import React from "react";
import { useNavigate } from "react-router-dom";

import MyGroupList from "../components/group/MyGroupList";

import { GoPencil } from "react-icons/go";
import { GoSearch } from "react-icons/go";
import { GoCommentDiscussion } from "react-icons/go";

function DashboardPage() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const handleEditProfile = () => {};

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
                <div className="dashboard-user-profile">
                    <img className="user-image" alt={`${user.name} 프로필 사진`} />
                    <div className="user-info">
                        <div>
                            <h1>{user.name}</h1>
                            <div onClick={handleEditProfile}>
                                <GoPencil />
                            </div>
                        </div>
                        <h3>{user.studentId}</h3>
                        <h3>{user.major}</h3>
                    </div>
                </div>
                <div className="dashboard-layout">
                    <section className="dashboard-section">
                        <div className="section-header">
                            <h2>내 스터디 그룹</h2>
                            <div onClick={() => navigate("/search")}>더보기</div>
                        </div>
                        <MyGroupList groups={user.group} />
                    </section>
                    <aside className="dshboard-sidebar">
                        <div className="sidebar-section">
                            <h2>내가 작성한 신청서</h2>
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
