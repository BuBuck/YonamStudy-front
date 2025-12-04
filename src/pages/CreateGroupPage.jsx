import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import useLocalStorage from "../hooks/useLocalStorage";
import { notifyGroupCreated } from "../utils/groupSignal";

const defaultGroupImage = `/uploads/study-groups/default-groupImage.png`;

const defaultFormData = {
    group: "",
    description: "",
    groupImage: defaultGroupImage,
};

function CreateGroupPage() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(
        `${import.meta.env.VITE_BACKEND_URL}${defaultGroupImage}`
    );

    const [formData, setFormData] = useState(defaultFormData);

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
        setFormData({
            ...formData,
            [name]: value,
        });
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) return alert("로그인이 필요합니다.");

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/study-groups/`, {
                groupName: formData.group,
                description: formData.description,
                groupImage: formData.groupImage,
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
        <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex" }}>
                    <div style={{ marginBottom: "10px" }}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            name="groupImage"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />
                        <img
                            src={preview}
                            alt="미리보기"
                            style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                border: "1px solid #ccc",
                                cursor: "pointer",
                            }}
                            onClick={() => fileInputRef.current.click()}
                        />
                    </div>

                    <label>
                        <h2>그룹 이름</h2>
                        <input
                            type="text"
                            name="group"
                            placeholder="그룹 이름을 입력해주세요."
                            value={formData.group}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <button type="submit">그룹 생성</button>
            </div>

            <label>
                <h2>그룹 소개</h2>
                <textarea
                    name="description"
                    placeholder="그룹에 대한 설명을 적어주세요."
                    value={formData.description}
                    onChange={handleChange}
                />
            </label>
        </form>
    );
}

export default CreateGroupPage;
