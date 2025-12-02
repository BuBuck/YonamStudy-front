import React, { useState } from "react";
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

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));
    const [_, setUser] = useLocalStorage("user", "");

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile)
            return setFile(`${import.meta.env.VITE_BACKEND_URL}${defaultGroupImage}`);

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
        const _formData = new FormData();
        _formData.append("image", file);
        _formData.append("groupId", group._id);

        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/upload-groupImage`,
                _formData,
                {
                    // 지금 전송 중인 데이터 안에는 파일이 섞여있다고 알려주는 헤더이다.
                    // (없어도 axios가 자동으로 해주지만 명시해 줌으로써 오류 발생 감소)
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/study-groups/`, {
                groupName: formData.group,
                description: formData.description,
                groupImage: formData.groupImage,
                userId: user.userId,
            });

            await handleUploadImage(res.data.group);

            user.group = [...user.group, res.data.group._id];
            setUser(user);

            notifyGroupCreated(res.data.group);

            alert(res.data.message);
            navigate("/");
        } catch (error) {
            if (error.status === 409) return alert(error.response.data.message);
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="group"
                placeholder="그룹 이름"
                value={formData.group}
                onChange={handleChange}
                required
            />
            <textarea
                name="description"
                placeholder="그룹 설명"
                value={formData.description}
                onChange={handleChange}
            />
            <div style={{ marginBottom: "10px" }}>
                <img
                    src={preview}
                    alt="미리보기"
                    style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        border: "1px solid #ccc",
                    }}
                />
            </div>
            <input type="file" name="groupImage" accept="image/*" onChange={handleFileChange} />
            <button type="submit">그룹 생성</button>
        </form>
    );
}

export default CreateGroupPage;
