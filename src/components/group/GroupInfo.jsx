import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import useLocalStorage from "../../hooks/useLocalStorage";

import "../../style/group/GroupInfo.css";

function GroupInfo({ groupId, group, user, onUpdateGroup }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        group: group.group || "",
        description: group.description || "",
        groupImage: group.groupImage || "",
    });

    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);

    const getImageUrl = (path) => {
        if (!path) return null;
        return path.startsWith("http") ? path : `${import.meta.env.VITE_BACKEND_URL}${path}`;
    };

    const [preview, setPreview] = useState("");
    const [_, setUser] = useLocalStorage("user", "");

    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        const previewUrl = URL.createObjectURL(selectedFile);
        setPreview(previewUrl);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateGroup = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/${group._id}`,
                {
                    groupName: formData.group,
                    description: formData.description,
                    userId: user.userId,
                }
            );

            if (!res.data) throw new Error("수정 실패");

            let updatedGroupData = res.data.updatedGroup;

            if (file) {
                const _formData = new FormData();
                _formData.append("image", file);
                _formData.append("groupId", group._id);

                const res = await axios.put(
                    `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/update-groupImage`,
                    _formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (res.data.updatedGroup) {
                    updatedGroupData = res.data.updatedGroup;
                }
            }

            setIsEditing(false);
            setFile(null);
            onUpdateGroup(updatedGroupData);
            return alert(res.data.message);
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
        <div>
            {isEditing ? (
                <form onSubmit={handleUpdateGroup}>
                    <div className="group-info">
                        <div style={{ display: "flex", flexDirection: "row" }}>
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
                                style={{ cursor: "pointer", position: "relative" }}
                            >
                                <img
                                    className="group-image-preview"
                                    alt="스터디그룹 이미지 미리보기"
                                    src={preview}
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        objectFit: "cover",
                                        borderRadius: "10px",
                                    }}
                                />
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        right: 0,
                                        background: "rgba(0,0,0,0.5)",
                                        color: "white",
                                        fontSize: "10px",
                                        padding: "2px",
                                    }}
                                >
                                    변경
                                </div>
                            </div>

                            <div className="group-name-input">
                                <input
                                    name="group"
                                    value={formData.group || ""}
                                    onChange={handleChange}
                                    placeholder="그룹 이름"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <button type="submit">저장</button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setFormData({
                                        group: group.group,
                                        description: group.description,
                                        groupImage: group.groupImage,
                                    });
                                    setPreview(getImageUrl(group.groupImage));
                                    setFile(null);
                                }}
                            >
                                취소
                            </button>
                        </div>
                    </div>
                    <div style={{ margin: "10px 30px" }}>
                        <div style={{ marginBottom: "8px", fontWeight: 600 }}>그룹 설명</div>
                        <textarea
                            className="group-description"
                            name="description"
                            value={formData.description || ""}
                            onChange={handleChange}
                            style={{ width: "100%", minHeight: "100px" }}
                        />
                    </div>
                </form>
            ) : (
                <>
                    <div className="group-info">
                        <div
                            style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
                        >
                            <img
                                className="group-image"
                                alt="스터디 그룹 이미지"
                                src={getImageUrl(group.groupImage)}
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                    borderRadius: "10px",
                                }}
                            />
                            <h1 className="group-name" style={{ marginLeft: "15px" }}>
                                {group.group}
                            </h1>
                        </div>

                        {user && user.userId === group.groupLeader && (
                            <div>
                                <button
                                    onClick={() => {
                                        setIsEditing(true);
                                        setFormData({
                                            group: group.group,
                                            description: group.description,
                                            groupImage: group.groupImage,
                                        });
                                        setPreview(getImageUrl(group.groupImage));
                                    }}
                                >
                                    수정
                                </button>
                                <button onClick={handleDeleteGroup}>삭제</button>
                            </div>
                        )}
                    </div>
                    <div style={{ margin: "10px 30px" }}>
                        <div style={{ marginBottom: "8px", fontWeight: 600 }}>그룹 설명</div>
                        <div className="group-description" style={{ whiteSpace: "pre-wrap" }}>
                            {group.description}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default GroupInfo;
