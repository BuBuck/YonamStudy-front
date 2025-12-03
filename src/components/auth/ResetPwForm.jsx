import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Not from "../../pages/Not";

function ResetPwForm({ formData, setFormData, onChange, token }) {
    const [isHovered, setIsHovered] = useState(null);
    const [isCheckToken, setIsCheckToken] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            const handleCheckToken = async () => {
                try {
                    const res = await axios.get(
                        `${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password/${token}`
                    );

                    setIsCheckToken(res.data.success);
                } catch (error) {
                    console.error(error);
                }
            };
            handleCheckToken();
        }
    }, [token]);

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!isCheckToken) return <Not />;

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password?token=${token}`,
                { newPassword: formData.newPassword }
            );

            alert(res.data.message);
            navigate("/auth/login", { replace: true });
            setFormData({});
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleResetPassword}>
            <h3>비밀번호 재설정</h3>
            <label>
                새 비밀번호
                <input
                    type={isHovered === "newPassword" ? "text" : "password"}
                    name="newPassword"
                    placeholder="새로운 비밀번호를 입력해 주세요."
                    onChange={onChange}
                    onMouseEnter={() => setIsHovered("newPassword")}
                    onMouseLeave={() => setIsHovered(null)}
                    required
                />
            </label>
            <label>
                비밀번호 확인
                <input
                    type={isHovered === "checknewPassword" ? "text" : "password"}
                    name="checknewPassword"
                    placeholder="비밀번호를 다시 입력해 주세요."
                    onChange={onChange}
                    onMouseEnter={() => setIsHovered("checknewPassword")}
                    onMouseLeave={() => setIsHovered(null)}
                    required
                />
            </label>
            <button type="submit">비밀번호 변경</button>
        </form>
    );
}

export default ResetPwForm;
