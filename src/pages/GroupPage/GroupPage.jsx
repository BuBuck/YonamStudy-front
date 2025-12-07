import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import useLocalStorage from "../../hooks/useLocalStorage";

import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import Comment from "../../components/Comment/Comment";

import { GoFile, GoPaste, GoPeople } from "react-icons/go";
import { GoCalendar } from "react-icons/go";
import { GoLocation } from "react-icons/go";
import { GoX } from "react-icons/go";

import "./GroupPage.css";
import ApplicationFormModal from "../../components/group/ModalForm/ApplicationFormModal";
import CreateFormModal from "../../components/group/ModalForm/CreateFormModal";
import ApplicationListModal from "../../components/group/ModalForm/ApplicationListModal";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

function GroupPage() {
    const [user, setUser] = useLocalStorage("user", null);

    const [group, setGroup] = useState({});
    const [isJoined, setIsJoined] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        schedule: { weeks: [], time: "" },
    });

    // 신청서 관련 모달 state
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showApplicationList, setShowApplicationList] = useState(false);

    // 신청서 양식
    const [applicationForm, setApplicationForm] = useState({});
    // 제출된 신청서 목록
    const [applications, setApplications] = useState([]);

    // 태그 관련 state
    const [isEditTag, setIsEditTag] = useState(null);
    const [tagInput, setTagInput] = useState("");

    const { groupId } = useParams();
    const navigate = useNavigate();

    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");

    const currentUserId = user?.userId;
    const isGroupLeader = currentUserId === group.groupLeader?._id;

    const getImageUrl = (path) => {
        if (!path) return null;
        return path.startsWith("http") ? path : `${import.meta.env.VITE_BACKEND_URL}${path}`;
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        const previewUrl = URL.createObjectURL(selectedFile);
        setPreview(previewUrl);
    };

    const fetchGroupData = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/${groupId}`
            );

            const groupData = res.data.group;
            setGroup(groupData);

            // [로직 추가] 내가 이 그룹의 멤버인지 확인하여 isJoined 상태 업데이트
            if (user && groupData) {
                // 리더이거나, 멤버 리스트에 내 ID가 있다면 가입된 상태
                const isLeader = groupData.groupLeader?._id === user.userId;
                const isMember = groupData.groupMembers?.some(
                    (member) => member._id === user.userId
                );

                setIsJoined(isLeader || isMember);
            }

            // [기존 유지] 저장된 질문지(questions)가 있으면 state에 넣어줌
            if (groupData.questions && groupData.questions.length > 0) {
                setApplicationForm({ questions: groupData.questions });
            }
        } catch (error) {
            console.error("그룹 정보 로딩 실패:", error);
        }
    };

    // 2. 신청서 목록 가져오기 (GET) - 리더만 호출
    const fetchApplications = async () => {
        if (!user) return;

        try {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/${groupId}/applications`
            );
            setApplications(res.data.applications); // DB에서 가져온 신청서 목록 넣기
        } catch (error) {
            console.error("신청서 목록 로딩 실패:", error);
        }
    };

    // 3. useEffect 수정 (데이터 로딩 시점 관리)
    useEffect(() => {
        fetchGroupData();
    }, [groupId]);

    // 4. 리더일 경우에만 신청서 목록을 따로 가져옴
    useEffect(() => {
        // 그룹 정보가 로딩되었고, 내가 리더라면 신청서 목록을 가져온다 (GET)
        if (group && group.groupLeader?._id === user?.userId) {
            fetchApplications();
        }
    }, [group, user]); // group 정보나 user가 로딩된 후 실행

    // 스피너
    if (!group) {
        return <LoadingSpinner message="스터디 그룹 정보를 불러오고 있습니다..." />;
    }

    // =========================================
    //  * 신청 폼 관련
    // =========================================
    const handleJoin = () => {
        if (!user) {
            alert("로그인을 해야 스터디 그룹 신청이 가능합니다.");

            if (confirm("로그인하러 가시겠습니까?")) return navigate("/auth/login");

            return;
        }

        // 신청 모달 열기
        setShowApplicationForm(true);
    };

    const handleLeave = async () => {
        if (!confirm("정말 스터디 그룹을 탈퇴하시겠습니까?")) return;

        try {
            // 서버에 탈퇴 요청 보내기 (DELETE)
            // 백엔드 API 주소에 맞게 수정 필요 (보통 /api/study-groups/:groupId/members/:userId 같은 형태)
            await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/${groupId}/members`,
                {
                    data: { userId: user.userId }, // body에 내 ID 실어서 보냄
                }
            );

            // 성공하면 화면 상태 변경
            setIsJoined(false);
            alert("스터디 그룹에서 탈퇴했습니다.");

            // 인원수 갱신을 위해 데이터 다시 불러오기
            fetchGroupData();
        } catch (error) {
            console.error("탈퇴 실패:", error);
            const msg = error.response?.data?.message || "탈퇴 처리 중 오류가 발생했습니다.";
            alert(msg);
        }
    };

    // 신청서 제출 핸들러
    const handleSubmitApplication = async (applicationData) => {
        if (!user) return alert("로그인이 필요합니다.");

        const { answers } = applicationData;
        // 1. 데이터 가공
        const formattedAnswers = Object.entries(answers).map(([key, value]) => ({
            questionId: key,
            answer: value,
        }));

        try {
            // 2. API 호출
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/${groupId}/applications`,
                {
                    userId: user.userId, // 현재 로그인한 유저 ID
                    answers: formattedAnswers,
                }
            );

            // 3. 성공 처리
            if (res.status === 201) {
                // 목록에 금방 만든 신청서 추가 (화면 갱신용)
                // (res.data.application에 DB에 저장된 완전한 데이터가 들어있음)
                setApplications((prev) => [...prev, res.data.application]);

                setShowApplicationForm(false); // 모달 닫기
                alert("신청서가 제출되었습니다! 스터디장의 승인을 기다려주세요.");
            }
        } catch (error) {
            console.error("제출 실패:", error);
            const msg = error.response?.data?.message || "신청서 제출 중 오류가 발생했습니다.";
            alert(msg);
        }
    };

    // 신청서 양식(질문) 저장 함수
    const handleSaveForm = async (newFormData) => {
        // 1. 저장 전 확인
        if (!confirm("작성하신 신청서 양식을 저장하시겠습니까?")) return;

        try {
            // 2. 데이터 가공
            // 모달에서 넘어온 데이터가 { questions: [...] } 형태인지, 그냥 배열 [...] 인지에 따라 처리
            // 안전하게 questions 배열을 추출합니다.
            const questionsToSave = newFormData.questions || newFormData;

            // 3. 백엔드로 전송 (PUT)
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/${groupId}/questions`,
                { questions: questionsToSave } // body: { questions: [ ... ] }
            );

            // 4. 성공 처리
            if (res.status === 200) {
                // state 업데이트 (화면에 바로 반영)
                setApplicationForm({ questions: res.data.questions });

                // 모달 닫기
                setShowCreateForm(false);

                alert("신청서 양식이 성공적으로 저장되었습니다!");

                // (선택) 전체 데이터 다시 불러오기
                // fetchGroupData();
            }
        } catch (error) {
            console.error("신청서 저장 실패:", error);
            const errorMessage = error.response?.data?.message || "저장 중 오류가 발생했습니다.";
            alert(errorMessage);
        }
    };

    // 신청서 승인 핸들러
    const handleApprove = async (applicationId) => {
        setApplications(
            applications.map((app) =>
                app.id === applicationId ? { ...app, status: "approved" } : app
            )
        );
        alert("신청서가 승인되었습니다!");
    };

    // 신청서 거절 핸들러
    const handleReject = async (applicationId) => {
        setApplications(
            applications.map((app) =>
                app.id === applicationId ? { ...app, status: "rejected" } : app
            )
        );
        alert("신청서가 거절되었습니다!");
    };

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
                return { ...prev, schedule: { ...prev.schedule, weeks: [...currentWeeks, day] } };
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

    const handleAddTag = () => {
        if (!tagInput.trim()) return;
        if (formData.tags.includes(tagInput)) {
            alert("이미 존재하는 태그입니다.");
            return;
        }

        setFormData({
            ...formData,
            tags: [...formData.tags, tagInput],
        });

        setTagInput("");
    };

    const handleDeleteTag = (tag, index) => {
        if (formData.tags[index] === tag) {
            formData.tags.splice(index, 1);
            setIsEditTag(null);
        }
    };

    const formCheck = () => {
        try {
            if (!formData.group) throw "스터디 그룹 이름은 반드시 있어야합니다.";
            if (!formData.schedule.time) throw "일정 시간은 반드시 있어야합니다.";
            if (formData.schedule.weeks.length < 1) throw "일정 요일은 반드시 있어야합니다.";
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
                        throw "난이도 초급, 중급, 고급 중 한가지만 입력해주세요";
                }
            }
            if (!formData.maxMembers) throw "최대 인원 수는 반드시 있어야합니다.";
            else if (formData.maxMembers < group.groupMembers?.length + 1)
                throw "최대 인원 수가 현재 스터디 그룹 멤버 수 보다 작을 수 없습니다.";

            return true;
        } catch (error) {
            alert(error);
            return false;
        }
    };

    const handleUpdateGroup = async () => {
        if (!formCheck()) return;

        try {
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/${group._id}`,
                {
                    groupName: formData.group,
                    description: formData.description,
                    groupImage: formData.groupImage,
                    schedule: {
                        weeks: formData.schedule.weeks,
                        time: formData.schedule.time,
                    },
                    location: formData.location,
                    duration: formData.duration,
                    difficulty: formData.difficulty,
                    tags: formData.tags,
                    maxMembers: formData.maxMembers,
                    userId: user.userId,
                }
            );

            if (!res.data) throw "수정 실패";

            if (file) {
                const _formData = new FormData();
                _formData.append("image", file);
                _formData.append("groupId", group._id);

                await axios.put(
                    `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/update-groupImage`,
                    _formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            }

            await fetchGroupData();

            setIsEditing(false);
            setFile(null);
            alert(`${group.group}의 정보가 수정되었습니다.`);
        } catch (error) {
            console.error(error);
            if (error.response?.status === 409) return alert(error.response.data.message);
        }
    };

    const handleDeleteGroup = async () => {
        if (confirm("정말 삭제하시겠습니까?")) {
            try {
                const res = await axios.delete(
                    `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/${groupId}`,
                    { data: { userId: user.userId } }
                );

                if (res.data.groups) {
                    const updatedUser = { ...user, group: res.data.groups };
                    setUser(updatedUser);
                } else {
                    const updatedGroups = user.group.filter(
                        (g) => (typeof g === "string" ? g : g._id) !== groupId
                    );
                    setUser({ ...user, group: updatedGroups });
                }

                if (res.data) {
                    alert(res.data.message);
                    navigate(-1, { replace: true });
                }
            } catch (error) {
                console.error(error);
            }
        }
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
                                    rows={5}
                                    maxLength={500}
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
                                        placeholder=" '#' 을 제외하고 추가할 태그를 입력해주세요"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                    />
                                    <button
                                        type="text"
                                        className="btn btn-primary btn-full"
                                        onClick={handleAddTag}
                                        style={{ margin: 0 }}
                                    >
                                        추가
                                    </button>
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
                            {isEditing ? (
                                <div>
                                    <input
                                        ref={fileInputRef}
                                        name="groupImage"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        style={{ display: "none" }}
                                    />
                                    <div
                                        className="group-image"
                                        onClick={() => fileInputRef.current.click()}
                                    >
                                        <img
                                            src={preview}
                                            alt="스터디그룹 이미지 미리보기"
                                            className="group-avatar"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <img
                                    src={getImageUrl(group.groupImage)}
                                    alt="스터디그룹 이미지 미리보기"
                                    className="group-avatar"
                                />
                            )}

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
                                        {isEditing ? null : (
                                            <button
                                                className="btn btn-primary btn-full"
                                                onClick={() => navigate(`/chat/${groupId}`)}
                                            >
                                                채팅
                                            </button>
                                        )}
                                        {user?.userId !== group?.groupLeader?._id ? (
                                            <button
                                                className="btn btn-outline btn-full"
                                                onClick={handleLeave}
                                            >
                                                그룹 탈퇴하기
                                            </button>
                                        ) : null}
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="sidebar-card">
                            <h3 className="leader-h3">
                                스터디 그룹 리더
                                {user?.userId === group.groupLeader?._id &&
                                    (isEditing ? (
                                        <div style={{ display: "flex", gap: "0.5rem" }}>
                                            <button
                                                type="button"
                                                className="btn btn-outline btn-full"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    handleSetFormData();
                                                    setPreview(getImageUrl(group.groupImage));
                                                    setFile(null);
                                                }}
                                                style={{ margin: 0 }}
                                            >
                                                취소
                                            </button>

                                            <button
                                                type="button"
                                                className="btn btn-primary btn-full"
                                                onClick={handleUpdateGroup}
                                                style={{ margin: 0 }}
                                            >
                                                저장
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ display: "flex" }}>
                                            <button
                                                type="button"
                                                className="btn btn-primary btn-full"
                                                onClick={() => {
                                                    handleSetFormData();
                                                    setPreview(getImageUrl(group.groupImage));
                                                    setIsEditing(true);
                                                }}
                                                style={{ margin: 0 }}
                                            >
                                                그룹 수정
                                            </button>
                                        </div>
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
                                                        margin: 0,
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

                        {isGroupLeader && (
                            <div className="sidebar-card leader-actions-card">
                                <h3>신청폼 관리</h3>
                                <div className="leader-actions">
                                    <button
                                        className="btn btn-outline btn-full btn-with-icon"
                                        onClick={() => setShowCreateForm(true)}
                                    >
                                        <GoFile size={18} />
                                        신청서 양식 관리
                                    </button>
                                    <button
                                        className="btn btn-outline btn-full btn-with-icon"
                                        onClick={() => setShowApplicationList(true)}
                                    >
                                        <GoPaste size={18} />
                                        신청서 관리
                                        {applications?.filter((a) => a.status === "pending")
                                            .length > 0 && (
                                            <span className="notification-badge">
                                                {
                                                    applications?.filter(
                                                        (a) => a.status === "pending"
                                                    ).length
                                                }
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="sidebar-actions">
                            {group.groupLeader?._id === user?.userId
                                ? isEditing && (
                                      <button
                                          className="btn btn-secondary btn-full"
                                          onClick={handleDeleteGroup}
                                      >
                                          그룹 삭제하기
                                      </button>
                                  )
                                : null}
                        </div>
                    </aside>

                    <Comment groupId={groupId} user={user} />
                </div>
            </div>

            {/* Modals */}
            <ApplicationFormModal
                isOpen={showApplicationForm}
                onClose={() => setShowApplicationForm(false)}
                groupTitle={group.title}
                applicationForm={applicationForm}
                onSubmit={handleSubmitApplication}
            />

            <CreateFormModal
                isOpen={showCreateForm}
                onClose={() => setShowCreateForm(false)}
                onSave={handleSaveForm}
                existingForm={applicationForm}
            />

            <ApplicationListModal
                isOpen={showApplicationList}
                onClose={() => setShowApplicationList(false)}
                applications={applications}
                applicationForm={applicationForm}
                onApprove={handleApprove}
                onReject={handleReject}
            />
        </div>
    );
}

export default GroupPage;
