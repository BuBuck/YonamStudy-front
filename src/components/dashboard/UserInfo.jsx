import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import useLocalStorage from "../../hooks/useLocalStorage";

import { GoPencil } from "react-icons/go";

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
    return (
        <div>
            {isEditing ? (
                <form className="edit-profile" onSubmit={handleEditProfile}>
                    <div className="profile-image">
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
                        <h2>프로필 사진</h2>
                        <div>
                            <button type="button" onClick={() => fileInputRef.current.click()}>
                                사진 변경
                            </button>
                            <button type="button" onClick={handleRemoveImage}>
                                사진 제거
                            </button>
                        </div>
                    </div>

                    <label>
                        이메일
                        <input
                            name="email"
                            type="email"
                            value={`${user.studentId}@st.yc.ac.kr`}
                            disabled
                        />
                    </label>

                    <label>
                        이름
                        <input
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </label>

                    <label>
                        전화번호
                        <input
                            name="phoneNumber"
                            type="text"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                    </label>
                    <button type="submit">저장하기</button>
                    <button type="button" onClick={() => setIsEditing(false)}>
                        취소
                    </button>
                </form>
            ) : (
                <div className="dashboard-user-profile">
                    <img className="user-image" alt={`${user.name} 프로필 사진`} src={preview} />
                    <div className="user-info">
                        <div>
                            <h1>{user.name}</h1>
                            <div onClick={() => setIsEditing(true)} style={{ cursor: "pointer" }}>
                                <GoPencil />
                            </div>
                        </div>
                        <h3>{user.studentId}</h3>
                        <h3>{user.major}</h3>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserInfo;
