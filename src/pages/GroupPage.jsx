import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import useLocalStorage from "../hooks/useLocalStorage";

import Comment from "../components/comment/Comment";

import { GoPeople } from "react-icons/go";
import { GoCalendar } from "react-icons/go";
import { GoLocation } from "react-icons/go";
import { GoX } from "react-icons/go";

import "./GroupPage.css";
import Loading from "../components/Loading/Loading";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

function GroupPage() {
    const [group, setGroup] = useState({});
    const [isJoined, setIsJoined] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        schedule: {
            weeks: [],
            time: "",
        },
    });

    const [isEditTag, setIsEditTag] = useState(null);

    const { groupId } = useParams();
    const navigate = useNavigate();

    const [user, _] = useLocalStorage("user", null);

    useEffect(() => {
        const handleGetGroupData = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/${groupId}`
                );

                setGroup(res.data.group);
            } catch (error) {
                console.error(error);
            }
        };
        handleGetGroupData();
    }, []);

    if (!group) {
        return <Loading message="스터디 그룹 정보를 불러오고 있습니다..." />;
    }

    const handleDayToggle = (day) => {
        setFormData((prev) => {
            const currentWeeks = prev.schedule.weeks;

            if (currentWeeks.includes(day)) {
                return {
                    ...prev,
                    schedule: {
                        ...prev.schedule,
                        weeks: currentWeeks.filter((d) => d !== day),
                    },
                };
            } else {
                return (
                    console.log(day),
                    { ...prev, schedule: { ...prev.schedule, weeks: [...currentWeeks, day] } }
                );
            }
        });
    };

    const handleSetFormData = () => {
        setFormData({
            group: group.group,
            description: group.description,
            groupImage: group.groupImage,
            schedule: {
                weeks: group.schedule.weeks,
                time: group.schedule.time,
            },
            location: group.location,
            duration: group.duration,
            difficulty: group.difficulty,
            tags: group.tags,
            maxMembers: group.maxMembers,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "time") {
            return setFormData((prev) => ({
                ...prev,
                schedule: { ...prev.schedule, [name]: value },
            }));
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDeleteTag = (tag, index) => {
        if (formData.tags[index] === tag) {
            console.log(formData.tags);
            console.log([index]);
            formData.tags.splice(index, 1);
            setIsEditTag(null);
        }
    };

    const handleJoin = () => {
        setIsJoined(true);
    };

    const handleLeave = () => {
        setIsJoined(false);
    };

    const formCheck = () => {
        try {
            if (!formData.group) throw "스터디 그룹 이름은 반드시 있어야합니다.";
            if (!formData.schedule.time) throw "일정 시간은 반드시 있어야합니다.";
            if (!formData.schedule.weeks) throw "일정 요일은 반드시 있어야합니다.";
            if (!formData.location) throw "장소는 반드시 있어야합니다.";
            if (!formData.duration) throw "기간은 반드시 있어야합니다.";
            if (!formData.difficulty) throw "난이도는 반드시 있어야합니다.";
            else {
                switch (formData.difficulty) {
                    case "초급":
                    case "중급":
                    case "고급":
                        break;
                    default:
                        throw "난이도 초급, 중급, 고급 중 한 개만 작성해주세요.";
                }
            }
            if (!formData.maxMembers) throw "최대 인원 수는 반드시 있어야합니다.";
            else if (formData.maxMembers < group.groupMembers?.length + 1)
                throw "최대 인원 수가 현재 스터디 그룹 멤버 수 보다 작을 수 없습니다.";
        } catch (error) {
            alert(error);
        }
    };

    const handleSubmit = async () => {
        formCheck();
    };

    return (
        <div className="group-detail-page">
            <div className="group-hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="badge-container">
                            <span className={`difficulty-badge difficulty-${group.difficulty}`}>
                                {group.difficulty} 난이도
                            </span>
                        </div>
                        <h1>
                            {isEditing ? (
                                <div className="hero-input">
                                    <input
                                        type="text"
                                        className="input-pop"
                                        name="group"
                                        value={formData.group || ""}
                                        onChange={handleChange}
                                        placeholder="스터디 그룹 이름"
                                    />
                                </div>
                            ) : (
                                group.group
                            )}
                        </h1>

                        <div className="hero-meta">
                            <div className="meta-item">
                                <GoCalendar />
                                <span>
                                    {`주 ${group.schedule?.weeks.length}회 (${group.schedule?.weeks
                                        .toString()
                                        .replaceAll(",", "/")} 
                                            ${group.schedule?.time})`}
                                </span>
                            </div>

                            <div className="meta-item">
                                <GoLocation />
                                <span>{group.location}</span>
                            </div>

                            <div className="meta-item">
                                <GoPeople />
                                <span>
                                    현재 {group.groupMembers?.length + 1}명 / 최대{" "}
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            name="maxMembers"
                                            className="input-pop"
                                            value={formData.maxMembers}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        group.maxMembers
                                    )}
                                    명
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="group-layout">
                    <main className="group-main">
                        <section className="info-section">
                            <h2>스터디 소개</h2>
                            {isEditing ? (
                                <textarea
                                    type="text"
                                    className="input-pop"
                                    name="description"
                                    placeholder={`${group.group}을(를) 소개해주세요!`}
                                    rows={4}
                                    value={formData.description || ""}
                                    onChange={handleChange}
                                    style={{ width: "100%", minHeight: "100px" }}
                                />
                            ) : (
                                <p>{group.description}</p>
                            )}
                        </section>

                        <section className="info-section">
                            <h2>태그</h2>
                            {isEditing ? (
                                <div className="hash-tag">
                                    <input
                                        type="text"
                                        name="tags"
                                        className="input-pop"
                                        placeholder="추가할 태그를 입력해주세요"
                                    />
                                    <button className="btn btn-primary btn-full">추가</button>
                                </div>
                            ) : null}
                            <div className="tags-container">
                                {group.tags?.map((tag, index) => (
                                    <span
                                        key={tag}
                                        className="tag"
                                        onMouseEnter={() => isEditing && setIsEditTag(tag)}
                                        onMouseLeave={() => isEditing && setIsEditTag(null)}
                                    >
                                        #{tag}
                                        {isEditTag === tag ? (
                                            <div
                                                className="tag-X"
                                                onClick={() => handleDeleteTag(tag, index)}
                                            >
                                                <GoX size={18} />
                                            </div>
                                        ) : null}
                                    </span>
                                ))}
                            </div>
                        </section>

                        <section className="info-section">
                            <h2>
                                멤버 (
                                {group.groupMembers?.length === 0
                                    ? 1
                                    : group.groupMembers?.length + 1}
                                명)
                            </h2>
                            <div className="members-grid">
                                <div className="member-item">
                                    <img
                                        className="leader-avatar"
                                        src={`${import.meta.env.VITE_BACKEND_URL}${
                                            group.groupLeader?.userProfile
                                        }`}
                                        style={{ width: "3rem", height: "3rem" }}
                                    />
                                    <div className="member-info">
                                        <div className="member-name">{group.groupLeader?.name}</div>
                                        <div className="member-role">리더</div>
                                    </div>
                                </div>

                                {group.groupMembers?.map((member) => (
                                    <div className="member-item">
                                        <img
                                            className="member-avatar"
                                            src={`${import.meta.env.VITE_BACKEND_URL}${
                                                member?.userProfile
                                            }`}
                                        />
                                        <div className="member-info">
                                            <div className="member-name">{member?.name}</div>
                                            <div className="member-role">멤버</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </main>

                    <aside className="group-sidebar">
                        <div className="sidebar-card">
                            <div className="sidebar-actions">
                                {!isJoined ? (
                                    <button
                                        className="btn btn-primary btn-full"
                                        onClick={handleJoin}
                                    >
                                        그룹 신청하기
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            className="btn btn-secondary btn-full"
                                            onClick={() => navigate(`/chat/${groupId}`)}
                                        >
                                            채팅
                                        </button>
                                        <button
                                            className="btn btn-outline btn-full"
                                            onClick={handleLeave}
                                        >
                                            그룹 탈퇴하기
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="sidebar-card">
                            <h3 className="leader-h3">
                                스터디 그룹 리더
                                {user?.userId === group.groupLeader?._id &&
                                    (isEditing ? (
                                        <div>
                                            <button
                                                type="button"
                                                className="btn btn-outline btn-full"
                                                onClick={() => setIsEditing(false)}
                                            >
                                                취소
                                            </button>

                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-full"
                                                onClick={handleSubmit}
                                            >
                                                저장
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-full"
                                            onClick={() => {
                                                handleSetFormData();
                                                setIsEditing(true);
                                            }}
                                        >
                                            수정
                                        </button>
                                    ))}
                            </h3>
                            <div className="leader-info">
                                <img
                                    className="leader-avatar"
                                    src={`${import.meta.env.VITE_BACKEND_URL}${
                                        group.groupLeader?.userProfile
                                    }`}
                                />
                                <div>
                                    <div className="leader-name">{group.groupLeader?.name}</div>
                                    <div className="leader-major">{group.groupLeader?.major}</div>
                                </div>
                            </div>
                        </div>

                        <div className="sidebar-card">
                            <h3>상세 정보</h3>
                            <div className="detail-list">
                                <div className="detail-contatiner">
                                    <div
                                        style={{
                                            marginBottom: "1rem",
                                            display: "flex",
                                            gap: "5px",
                                            width: "100%",
                                        }}
                                    >
                                        {isEditing &&
                                            DAYS.map((day) => (
                                                <button
                                                    key={day}
                                                    type="button"
                                                    className={
                                                        formData.schedule?.weeks?.includes(day)
                                                            ? "btn btn-primary btn-full"
                                                            : "btn btn-outline btn-full"
                                                    }
                                                    onClick={() => handleDayToggle(day)}
                                                    style={{
                                                        padding: "10px 0",
                                                        width: "37px",
                                                        height: "35px",
                                                    }}
                                                >
                                                    {day}
                                                </button>
                                            ))}
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">일정</span>
                                        {isEditing ? (
                                            <div>
                                                <input
                                                    type="time"
                                                    name="time"
                                                    className="input-pop"
                                                    value={formData.schedule.time}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        ) : (
                                            <span className="detail-value">
                                                {`주 ${
                                                    group.schedule?.weeks?.length
                                                }회 (${group.schedule?.weeks
                                                    .toString()
                                                    .replaceAll(",", "/")} 
                                            ${group.schedule?.time})`}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="detail-item">
                                    <span className="detail-label">장소</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="location"
                                            className="input-pop"
                                            placeholder="장소를 입력해주세요."
                                            value={formData.location}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <span className="detail-value">{group.location}</span>
                                    )}
                                </div>

                                <div className="detail-item">
                                    <span className="detail-label">기간</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="duration"
                                            className="input-pop"
                                            placeholder="기간을 입력해주세요."
                                            value={formData.duration}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <span className="detail-value">{group.duration}</span>
                                    )}
                                </div>

                                <div className="detail-item">
                                    <span className="detail-label">난이도</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="difficulty"
                                            className="input-pop"
                                            placeholder="초급, 중급, 상급"
                                            value={formData.difficulty}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        <span className="detail-value">{group.difficulty}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <div className="container">
                <Comment groupId={groupId} group={group} user={user} />
            </div>
        </div>
    );
}

export default GroupPage;
