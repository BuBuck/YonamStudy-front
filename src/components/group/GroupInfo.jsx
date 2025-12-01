import React, { useState } from "react";
import axios from "axios";

import "../../style/group/GroupInfo.css";

function GroupInfo({ group, user }) {
    const [isEditing, setIsEditing] = useState(false);
    const [newGroupName, setNewGroupName] = useState(group.group || "");

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(
        `${import.meta.env.VITE_BACKEND_URL}${group.groupImage}`
    );

    const handleUpdateImage = async (group) => {
        const _formData = new FormData();
        _formData.append("image", file);
        _formData.append("groupId", group._id);
        _formData.append("groupName", group.group);

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

    const handleUpdateGroup = async () => {
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/${group._id}`
            );

            await handleUpdateImage(res.data);

            if (res.data) return alert(res.data.message);
        } catch (error) {
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
                <div className="group-info">
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <img
                            className="group-image"
                            src={`${import.meta.env.VITE_BACKEND_URL}${group.groupImage}`}
                        />
                        <div className="group-name-input">
                            <input
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="group-description">{group.description}</div>
                    <div>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                handleUpdateGroup();
                            }}
                        >
                            저장
                        </button>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setNewGroupName(group.group);
                            }}
                        >
                            취소
                        </button>
                    </div>
                </div>
            ) : (
                <div className="group-info">
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <img
                            className="group-image"
                            src={`${import.meta.env.VITE_BACKEND_URL}${group.groupImage}`}
                        />
                        <h1 className="group-name">{group.group}</h1>
                    </div>
                    <div className="group-description">{group.description}</div>
                    {user && user.userId === group.groupLeader && (
                        <div>
                            <button
                                onClick={() => {
                                    setIsEditing(true);
                                    setNewGroupName(group.group);
                                }}
                            >
                                수정
                            </button>
                            <button onClick={handleDeleteGroup}>삭제</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default GroupInfo;
