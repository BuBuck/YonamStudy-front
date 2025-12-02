import React, { useRef, useState } from "react";
import axios from "axios";

import "../../style/group/GroupInfo.css";

function GroupInfo({ group, user }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");

    const handleUpdateImage = async (group) => {
        const _formData = new FormData();
        _formData.append("image", file);
        _formData.append("groupId", group._id);
        _formData.append("groupImage", group.groupImage);

        try {
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/update-groupImage`,
                _formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) return setFile(`${import.meta.env.VITE_BACKEND_URL}${group.groupImage}`);

        setFile(selectedFile);

        const previewUrl = URL.createObjectURL(selectedFile);
        setPreview(previewUrl);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleUpdateGroup = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/${group._id}`,
                {
                    groupName: formData.group,
                    description: formData.description,
                    groupImage: formData.groupImage,
                    userId: user.userId,
                }
            );

            await handleUpdateImage(res.data.updatedGroup);

            if (res.data) {
                setIsEditing(false);
                return alert(res.data.message);
            }
        } catch (error) {
            if (error.status === 409) return alert(error.response.data.message);
            console.error(error);
        }
    };

    const handleDeleteGroup = async () => {
        if (confirm("정말 삭제하시겠습니까?")) {
            try {
                const res = await axios.delete(
                    `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/${group._id}`
                );

                if (res.data) return alert(res.data.message);
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
                                style={{
                                    display: "none",
                                }}
                            />
                            <img
                                className="group-image-preview"
                                alt="스터디 그룹 이미지"
                                src={preview}
                                onClick={() => fileInputRef.current.click()}
                            />
                            <div className="group-name-input">
                                <input
                                    name="group"
                                    value={formData.group}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <button type="submit">저장</button>
                            <button type="button" onClick={() => setIsEditing(false)}>
                                취소
                            </button>
                        </div>
                    </div>
                    <div style={{ margin: "10px 30px" }}>
                        <div style={{ marginBottom: "8px", fontWeight: 600 }}>그룹 설명</div>
                        <textarea
                            className="group-description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                </form>
            ) : (
                <>
                    <div className="group-info">
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <img
                                className="group-image"
                                alt="스터디 그룹 이미지"
                                src={`${import.meta.env.VITE_BACKEND_URL}${group.groupImage}`}
                            />
                            <h1 className="group-name">{group.group}</h1>
                        </div>

                        {user && user.userId === group.groupLeader && (
                            <div>
                                <button
                                    onClick={() => {
                                        setIsEditing(true);
                                        setPreview(
                                            `${import.meta.env.VITE_BACKEND_URL}${group.groupImage}`
                                        );
                                        setFormData({
                                            group: group.group,
                                            description: group.description,
                                            groupImage: group.groupImage,
                                        });
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
                        <div className="group-description">{group.description}</div>
                    </div>
                </>
            )}
        </div>
    );
}

export default GroupInfo;
