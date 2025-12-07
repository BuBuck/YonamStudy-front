import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import useLocalStorage from "../../hooks/useLocalStorage";
import { notifyGroupCreated } from "../../utils/groupSignal";

import { CiCamera } from "react-icons/ci";

import "./CreateGroupPage.css";

const defaultGroupImage = `/uploads/study-groups/default-groupImage.png`;
const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

function CreateGroupPage() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(
        `${import.meta.env.VITE_BACKEND_URL}${defaultGroupImage}`
    );

    const [formData, setFormData] = useState({
        schedule: { weeks: [], time: "" },
    });

    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const [user, setUser] = useLocalStorage("user", null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) {
            setFile(null);
            setPreview(`${import.meta.env.VITE_BACKEND_URL}${defaultGroupImage}`);
            return;
        }

        setFile(selectedFile);
        const previewUrl = URL.createObjectURL(selectedFile);
        setPreview(previewUrl);
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

    const handleUploadImage = async (group) => {
        if (!file) return group;

        const _formData = new FormData();
        _formData.append("image", file);
        _formData.append("groupId", group._id);

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/upload-groupImage`,
                _formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            return res.data.group || group;
        } catch (error) {
            console.error(error);
            return group;
        }
    };

    const handleDayToggle = (day) => {
        setFormData((prev) => {
            const currentWeeks = prev.schedule?.weeks || [];

            if (currentWeeks?.includes(day)) {
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) return alert("로그인이 필요합니다.");

        if (formData.schedule?.weeks?.length < 1) return alert("일정 선택은 필수입니다");

        const SORT_ORDER = ["월", "화", "수", "목", "금", "토", "일"];
        const sortedWeeks = (formData.schedule?.weeks || []).sort((a, b) => {
            return SORT_ORDER.indexOf(a) - SORT_ORDER.indexOf(b);
        });

        const processedTags = formData.tags
            ? formData.tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag !== "")
            : [];

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/study-groups/`, {
                groupName: formData.group,
                description: formData.description,
                groupImage: defaultGroupImage,
                schedule: {
                    weeks: sortedWeeks,
                    time: formData.schedule?.time || "",
                },
                location: formData.location,
                duration: formData.duration,
                difficulty: formData.difficulty,
                tags: processedTags,
                maxMembers: formData.maxMembers,
                userId: user.userId,
            });

            let createdGroup = res.data.group;

            if (file) {
                createdGroup = await handleUploadImage(createdGroup);
            }

            const updatedUser = {
                ...user,
                group: [...(user.group || []), createdGroup],
            };
            setUser(updatedUser);

            // 스터디 그룹 생성 후 이벤트를 실행해 사용자를 생성된 스터디 그룹 소켓에 join 시킴
            notifyGroupCreated(createdGroup);

            alert(res.data.message);
            navigate(`/study-groups/${createdGroup._id}`, { replace: true });
        } catch (error) {
            if (error.response && error.response.status === 409) {
                return alert(error.response.data.message);
            }
            console.error(error);
        }
    };

    return (
        <div className="create-group-page">
            <div className="container">
                <form className="create-group-form" onSubmit={handleSubmit}>
                    <div className="page-header">
                        <h1>스터디 그룹 생성</h1>
                        <p>새로운 스터디 그룹을 만들고 팀원을 모집하세요</p>
                    </div>

                    <div className="form-section">
                        <div className="section-image">
                            <input
                                ref={fileInputRef}
                                name="groupImage"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />
                            <div className="create-group-image-wrapper">
                                <div
                                    className="create-group-image"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <img
                                        src={preview}
                                        alt="스터디그룹 이미지 미리보기"
                                        className="create-group-avatar"
                                    />
                                    <div className="image-overlay">
                                        <CiCamera className="camera-icon" size={24} />
                                        <span className="overlay-text">이미지 업로드</span>
                                    </div>
                                </div>
                            </div>
                            <p>클릭하여 그룹 이미지를 업로드하세요</p>
                        </div>

                        <h2 className="section-title">기본 정보</h2>
                        <div className="form-group">
                            <label className="form-label">
                                스터디 그룹 이름
                                <span className="required-mark"> * </span>
                                <input
                                    type="text"
                                    name="group"
                                    value={formData.group || ""}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="예: React 웹 개발 스터디"
                                    required
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                스터디 소개
                                <span className="required-mark"> * </span>
                                <textarea
                                    name="description"
                                    value={formData.description || ""}
                                    onChange={handleChange}
                                    className="form-textarea"
                                    placeholder="스터디의 목표, 진행 방식, 기대 효과 등을 작성해주세요"
                                    rows={5}
                                    maxLength={500}
                                    required
                                ></textarea>
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                태그
                                <span className="required-mark"> * </span>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags || ""}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="태그를 쉼표로 구분하여 입력하세요 (예: React, JavaScript, 프론트엔드)"
                                />
                            </label>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">
                                    난이도
                                    <span className="required-mark"> * </span>
                                    <select
                                        name="difficulty"
                                        value={formData.difficulty || ""}
                                        onChange={handleChange}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">선택하세요</option>
                                        <option value="초급">초급</option>
                                        <option value="중급">중급</option>
                                        <option value="고급">고급</option>
                                    </select>
                                </label>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    최대 인원
                                    <span className="required-mark"> * </span>
                                    <input
                                        type="number"
                                        name="maxMembers"
                                        value={formData.maxMembers || ""}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="최대 인원 수를 입력해주세요"
                                        min="2"
                                        max="30"
                                        style={{ height: "100%" }}
                                        required
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h2 className="section-title">일정 및 장소</h2>

                        <div className="form-group">
                            <label className="form-label">
                                일정
                                <span className="required-mark"> * </span>
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.schedule?.time || ""}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="예: 주 2회 (화/목 19:00)"
                                    required
                                />
                                <div style={{ display: "flex", flex: 1, gap: "0.5rem" }}>
                                    {DAYS.map((day) => (
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
                                                padding: "1rem 0",
                                            }}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                장소
                                <span className="required-mark"> * </span>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location || ""}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="예: 미래관 2층 스터디룸 / 온라인 (Zoom)"
                                    required
                                />
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                활동 기간
                                <span className="required-mark"> * </span>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration || ""}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="예: 3개월, 한 학기"
                                    required
                                />
                            </label>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-outline btn-lg"
                            onClick={() => navigate(-1)}
                        >
                            취소
                        </button>
                        <button type="submit" className="btn btn-primary btn-lg">
                            그룹 만들기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateGroupPage;
