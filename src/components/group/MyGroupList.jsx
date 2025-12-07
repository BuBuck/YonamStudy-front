import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { FaCrown } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import { GoCalendar } from "react-icons/go";

import "./MyGroupList.css";

function MyGroupList({ groups, userId }) {
    const navigate = useNavigate();

    // 그룹을 그룹장/멤버로 분리
    const { leaderGroups, memberGroups } = useMemo(() => {
        if (!groups || groups.length === 0) {
            return { leaderGroups: [], memberGroups: [] };
        }

        const leader = [];
        const member = [];

        groups.forEach((group) => {
            // groupLeader와 userId 비교 (문자열 또는 객체 ID)
            const leaderId =
                typeof group.groupLeader === "object"
                    ? group.groupLeader?._id || group.groupLeader?.userId
                    : group.groupLeader;

            const currentUserId =
                typeof userId === "object" ? userId?._id || userId?.userId : userId;

            if (leaderId === currentUserId) {
                leader.push(group);
            } else {
                member.push(group);
            }
        });

        return { leaderGroups: leader, memberGroups: member };
    }, [groups, userId]);

    if (!groups || groups.length === 0) {
        return (
            <div className="no-groups">
                <div className="no-groups-icon">📚</div>
                <p>참여 중인 스터디 그룹이 없습니다</p>
                <button className="find-group-button" onClick={() => navigate("/search")}>
                    스터디 찾으러 가기
                </button>
            </div>
        );
    }

    const renderGroupCard = (group, index, isLeader = false) => (
        <div
            key={group._id || index}
            className="group-card"
            onClick={() => navigate(`/study-groups/${group._id}`)}
        >
            {isLeader && (
                <div className="leader-badge">
                    <FaCrown />
                    <span>그룹장</span>
                </div>
            )}

            <div className="group-card-header">
                <div className="group-image">
                    {group.groupImage ? (
                        <img
                            src={`${import.meta.env.VITE_BACKEND_URL}${group.groupImage}`}
                            alt={group.group}
                        />
                    ) : (
                        <div className="group-image-placeholder">
                            {group.group?.charAt(0) || "S"}
                        </div>
                    )}
                </div>
            </div>

            <div className="group-card-body">
                <h3 className="group-name">{group.group || "스터디 그룹"}</h3>
                <p className="group-category"> </p>

                <div className="group-details">
                    <div className="group-detail">
                        <GoPeople size={16} stroke="currentColor" />
                        <span>멤버 {(group.groupMembers?.length || 0) + 1}명</span>
                    </div>
                    <div className="group-detail">
                        <GoCalendar size={16} stroke="currentcolor" />
                        <span>
                            {`주 ${group.schedule?.weeks.length}회 (${group.schedule?.weeks
                                .toString()
                                .replaceAll(",", "/")} 
                                            ${group.schedule?.time})`}
                        </span>
                    </div>
                </div>
            </div>

            {group.description && (
                <div className="group-card-footer">
                    <p className="group-description">{group.description}</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="my-group-list-container">
            {leaderGroups.length > 0 && (
                <div className="group-section">
                    <div className="section-title">
                        <FaCrown className="section-icon" />
                        <h3>내가 그룹장인 그룹</h3>
                        <span className="count-badge">{leaderGroups.length}</span>
                    </div>
                    <div className="my-group-list">
                        {leaderGroups.map((group, index) => renderGroupCard(group, index, true))}
                    </div>
                </div>
            )}

            {memberGroups.length > 0 && (
                <div className="group-section">
                    <div className="section-title">
                        <GoPeople className="section-icon" />
                        <h3>참여 중인 그룹</h3>
                        <span className="count-badge">{memberGroups.length}</span>
                    </div>
                    <div className="my-group-list">
                        {memberGroups.map((group, index) => renderGroupCard(group, index, false))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyGroupList;
