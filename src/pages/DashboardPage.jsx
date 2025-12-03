import React from "react";
import { useNavigate } from "react-router-dom";

import MyGroupList from "../components/group/MyGroupList";

function DashboardPage() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header">
                    <div className="dashboard-header-user-info">
                        <h1>{user.name}님의 대시보드</h1>
                    </div>
                    <button
                        className="create-group-button"
                        onClick={() => navigate("/createGroup")}
                    >
                        새 그룹 만들기
                    </button>
                </div>
                <div className="dashboard-layout">
                    <section className="dashboard-section">
                        <div className="section-header">
                            <h2>내 스터디 그룹</h2>
                        </div>
                        <div className="" onClick={() => navigate("/search")}>
                            더보기
                        </div>

                        <MyGroupList groups={user.group} />
                    </section>
                    <aside className="dshboard-sidebar"></aside>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
