import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../../pages/AuthPage/AuthPage.css";

function SignupForm({ formData, setFormData, onChange, errors, setErrors }) {
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    const navigate = useNavigate();

    const validateForm = (type) => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = "이메일을 입력해주세요.";
        } else if (!/^[0-9]{8}@st\.yc\.ac\.kr$/.test(formData.email)) {
            newErrors.email = "올바른 이메일 형식이 아닙니다.";
        }
        if (type !== "sendCode") {
            if (!formData.code) {
                newErrors.code = "6자리 인증코드를 입력해주세요.";
            }
        }

        if (type === "signup") {
            if (!formData.name) newErrors.name = "이름을 입력해주세요.";
            if (!formData.major) newErrors.major = "학과를 선택해주세요.";
            if (!formData.phoneNumber) newErrors.phoneNumber = "전화번호를 입력해주세요.";
            if (!formData.birthdate) newErrors.birthdate = "생년월일을 입력해주세요.";

            if (!formData.password) {
                newErrors.password = "비밀번호를 입력해주세요.";
            } else if (formData.password.length < 8) {
                newErrors.password = "비밀번호는 최소 8자 이상이어야 합니다.";
            }

            // 추가: 회원가입 버튼 눌렀을 때 이메일 인증 완료 여부도 체크하고 싶다면
            if (!isEmailVerified) {
                alert("이메일 인증을 완료해주세요.");
                return false;
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendCode = async () => {
        if (validateForm("sendCode")) {
            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/auth/send-verification`,
                    {
                        email: formData.email,
                    }
                );
                alert(res.data.message);
                setIsCodeSent(true);
                setIsEmailVerified(false);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleCheckCode = async () => {
        if (validateForm("verifyCode")) {
            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-code`,
                    {
                        email: formData.email,
                        code: formData.code,
                    }
                );
                alert(res.data.message);
                setIsEmailVerified(true);
                setIsCodeSent(false);
            } catch (error) {
                console.error(error);
                setIsEmailVerified(false);
                alert("인증 코드가 올바르지 않습니다.");
            }
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (validateForm("signup")) {
            try {
                const { name, major, email, phoneNumber, birthdate, password } = formData;

                const res = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/auth/sign-up`,
                    {
                        name,
                        major,
                        email,
                        phoneNumber,
                        birthdate,
                        password,
                    }
                );

                alert(res.data.message);
                navigate("/auth/login");
                setFormData({});
                setIsEmailVerified(false);
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="auth-right">
            <div className="auth-form-container">
                <div className="auth-header">
                    <h2 className="auth-title">회원가입</h2>
                    <p className="auth-subtitle">새 계정을 만들어서 스터디를 시작하세요</p>
                </div>

                <form className="auth-form" onSubmit={handleSignup}>
                    <div className="form-group">
                        <label className="form-label">
                            이메일
                            <input
                                name="email"
                                type="email"
                                className={isEmailVerified ? "input-soft" : "form-input"}
                                placeholder="학교 이메일 (예:12345678@st.yc.ac.kr)"
                                onChange={onChange}
                                disabled={isEmailVerified}
                                required
                            />
                        </label>
                        {errors.email && <p className="form-error">{errors.email}</p>}
                        <button
                            type="button"
                            className={isEmailVerified ? "input-soft" : "btn btn-primary btn-full"}
                            style={isEmailVerified ? { display: "none" } : null}
                            onClick={handleSendCode}
                            disabled={isEmailVerified}
                        >
                            {isCodeSent ? "재전송" : "인증번호 받기"}
                        </button>
                    </div>

                    {isCodeSent && !isEmailVerified && (
                        <div className="form-group">
                            <label className="form-label">
                                인증번호
                                <input
                                    name="code"
                                    type="text"
                                    className={isEmailVerified ? "input-soft" : "form-input"}
                                    placeholder="인증 코드 6자리"
                                    onChange={onChange}
                                    required
                                />
                                {errors.code && <p className="form-error">{errors.code}</p>}
                                <button
                                    type="button"
                                    className="btn btn-primary btn-full"
                                    onClick={handleCheckCode}
                                >
                                    코드 확인
                                </button>
                            </label>
                        </div>
                    )}

                    <label className="form-label">
                        이름
                        <input
                            name="name"
                            type="text"
                            className={!isEmailVerified ? "input-soft" : "form-input"}
                            placeholder="이름 (예: 김연암)"
                            onChange={onChange}
                            disabled={!isEmailVerified}
                            required
                        />
                        {errors.name && <p className="form-error">{errors.name}</p>}
                    </label>

                    <label className="form-label">
                        학과
                        <select
                            name="major"
                            className={!isEmailVerified ? "input-soft" : "form-input"}
                            value={formData.major}
                            onChange={onChange}
                            disabled={!isEmailVerified}
                            required
                        >
                            <option value="" disabled={formData.major}>
                                학과를 선택하세요
                            </option>
                            <option value="전기전자공학과">전기전자공학과</option>
                            <option value="스마트전기전자공학과">스마트전기전자공학과</option>
                            <option value="기계공학과">기계공학과</option>
                            <option value="스마트기계공학과">스마트기계공학과</option>
                            <option value="스마트소프트웨어학과">스마트소프트웨어학과</option>
                        </select>
                        {errors.major && <p className="form-error">{errors.major}</p>}
                    </label>

                    <label className="form-label">
                        전화번호
                        <input
                            name="phoneNumber"
                            type="text"
                            className={!isEmailVerified ? "input-soft" : "form-input"}
                            placeholder="전화번호"
                            onChange={onChange}
                            required
                            disabled={!isEmailVerified}
                        />
                        {errors.phoneNumber && <p className="form-error">{errors.phoneNumber}</p>}
                    </label>

                    <label className="form-label">
                        생년월일
                        <input
                            name="birthdate"
                            type="date"
                            className={!isEmailVerified ? "input-soft" : "form-input"}
                            placeholder="생년월일"
                            onChange={onChange}
                            required
                            disabled={!isEmailVerified}
                        />
                        {errors.birthdate && <p className="form-error">{errors.birthdate}</p>}
                    </label>

                    <label className="form-label">
                        비밀번호
                        <input
                            name="password"
                            type="password"
                            className={!isEmailVerified ? "input-soft" : "form-input"}
                            placeholder="비밀번호 (8자 이상)"
                            onChange={onChange}
                            required
                            disabled={!isEmailVerified}
                        />
                        {errors.password && <p className="form-error">{errors.password}</p>}
                    </label>

                    <button
                        type="submit"
                        className={!isEmailVerified ? "input-soft" : "btn btn-primary btn-full"}
                        style={!isEmailVerified ? { cursor: "default" } : { cursor: "pointer" }}
                        disabled={!isEmailVerified}
                    >
                        회원가입 완료
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SignupForm;
