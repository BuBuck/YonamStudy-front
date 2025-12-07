import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import useLocalStorage from "../../hooks/useLocalStorage";

import { GoPencil } from "react-icons/go";
import "./UserInfo.css";

function UserInfo({ user }) {
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: user.name || "",
        phoneNumber: user.phoneNumber || "",
    });

    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);

    const getImageUrl = (path) => {
        if (!path) return "";
        return path.startsWith("http") ? path : `${import.meta.env.VITE_BACKEND_URL}${path}`;
    };

    const [preview, setPreview] = useState(getImageUrl(user.userProfile));
    const [_, setUser] = useLocalStorage("user", "");

    useEffect(() => {
        setFormData({
            name: user.name,
            phoneNumber: user.phoneNumber,
        });
        setPreview(getImageUrl(user.userProfile));
    }, [user]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    };

    const handleRemoveImage = () => {
        setFile("DELETE");
        setPreview(getImageUrl("/uploads/users/default-userProfile.png"));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditProfile = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/users/${user.userId}`,
                {
                    name: formData.name,
                    phoneNumber: formData.phoneNumber,
                }
            );

            let finalUser = res.data.user;

            if (file) {
                const _formData = new FormData();
                _formData.append("image", file);
                _formData.append("userId", user.userId);

                const imageRes = await axios.put(
                    `${import.meta.env.VITE_BACKEND_URL}/api/users/update-userProfile`,
                    _formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                finalUser = imageRes.data.user;
            }

            setUser(finalUser);

            setIsEditing(false);
            setFile(null);
            alert(res.data.message);
        } catch (error) {
            console.error(error);
        }
    };

    const stats = [
        {
            icon: "👥",
            label: "참여 그룹",
            value: user?.group?.length || 0,
            color: "#ff6b6b",
        },
        {
            icon: "✅",
            label: "출석률",
            value: "95%",
            color: "#48bb78",
        },
        {
            icon: "📆",
            label: "활동 일수",
            value: "45일",
            color: "#4299e1",
        },
        {
            icon: "✏️",
            label: "완료 과제",
            value: "12",
            color: "#ed8936",
        },
    ];

    return (
        <div className="user-info">
            {isEditing ? (
                <form className="edit-profile" onSubmit={handleEditProfile}>
                    <div className="profile-image-section">
                        <input
                            ref={fileInputRef}
                            name="userProfile"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />
                        <img
                            className="user-image-preview"
                            alt={`${user.name}님의 프로필 사진`}
                            src={preview}
                        />
                        <h3>프로필 사진</h3>
                        <div className="profile-image-buttons">
                            <button
                                type="button"
                                className="btn-change"
                                onClick={() => fileInputRef.current.click()}
                            >
                                사진 변경
                            </button>
                            <button
                                type="button"
                                className="btn-remove"
                                onClick={handleRemoveImage}
                            >
                                사진 제거
                            </button>
                        </div>
                    </div>

                    <div className="edit-form-fields">
                        <label>
                            <span className="label-text">이메일</span>
                            <input
                                name="email"
                                type="email"
                                value={`${user.studentId}@st.yc.ac.kr`}
                                disabled
                            />
                        </label>

                        <label>
                            <span className="label-text">이름</span>
                            <input
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </label>

                        <label>
                            <span className="label-text">전화번호</span>
                            <input
                                name="phoneNumber"
                                type="text"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </label>
                    </div>

                    <div className="edit-form-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => setIsEditing(false)}
                        >
                            취소
                        </button>
                        <button type="submit" className="btn-save">
                            저장하기
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <div className="dashboard-user-profile">
                        <img
                            className="user-image"
                            alt={`${user.name} 프로필 사진`}
                            src={preview}
                        />
                        <div className="user-details">
                            <div className="user-name-section">
                                <h3>{user.name}</h3>
                                <div className="edit-icon" onClick={() => setIsEditing(true)}>
                                    <GoPencil />
                                </div>
                            </div>
                            <p className="user-email">{user.studentId}@st.yc.ac.kr</p>
                            <p className="user-department">{user.major || "학과 미등록"}</p>
                        </div>
                    </div>

                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-card">
                                <div
                                    className="stat-icon"
                                    style={{ background: `${stat.color}15` }}
                                >
                                    <span style={{ fontSize: "1.75rem" }}>{stat.icon}</span>
                                </div>
                                <div className="stat-content">
                                    <div className="stat-value" style={{ color: stat.color }}>
                                        {stat.value}
                                    </div>
                                    <div className="stat-label">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default UserInfo;
