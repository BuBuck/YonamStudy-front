import React from "react";
import axios from "axios";

import ResetPwForm from "./ResetPwForm";

function ChangePwForm({ formData, setFormData, onChange }) {
    const handleForgotPassword = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`,
                {
                    email: formData.email,
                }
            );

            alert(res.data.message);
            setFormData({});
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form className="change-password-form" onSubmit={handleForgotPassword}>
            <h3>비밀번호 변경</h3>
            <label>
                가입시 사용한 이메일을 입력하세요
                <input
                    type="email"
                    name="email"
                    placeholder="학교 이메일"
                    onChange={onChange}
                    required
                />
            </label>
            <button type="submit">재설정 메일 받기</button>
        </form>
    );
}

export default ChangePwForm;
