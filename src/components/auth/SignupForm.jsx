import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const getMajorFromEmail = (email) => {
    const majorCode = Number(email.substring(3, 4));

    switch (majorCode) {
        case 1:
            return "전기전자공학과";
        case 2:
            return "스마트전기전자공학과";
        case 3:
            return "기계공학과";
        case 4:
            return "스마트기계공학과";
        case 6:
            return "스마트소프트웨어학과";
        default:
            return null;
    }
};

function SignupForm({ formData, setFormData, onChange }) {
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    const navigate = useNavigate();

    const handleSendCode = async () => {
        if (!formData.email) {
            return alert("폼에 이메일을 입력해주세요.");
        }
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
    };

    const handleCheckCode = async () => {
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

            if (isEmailVerified) {
                const autoGetMajor = getMajorFromEmail(formData.email);

                setFormData((prev) => ({
                    ...prev,
                    major: autoGetMajor,
                }));
            }
        } catch (error) {
            console.error(error);
            setIsEmailVerified(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!isEmailVerified) {
            return alert("이메일 인증을 먼저 완료해주세요.");
        }

        try {
            const { name, major, email, phoneNumber, birthdate, password } = formData;
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/sign-up`, {
                name,
                major,
                email,
                phoneNumber,
                birthdate,
                password,
            });

            alert(res.data.message);
            navigate("/auth/login");
            setFormData({});
            setIsEmailVerified(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <form className="signup-form" onSubmit={handleSignup}>
                <h3>회원가입</h3>

                <div style={{ display: "flex" }}>
                    <label>
                        이메일
                        <input
                            name="email"
                            type="email"
                            placeholder="학교 이메일 (예:12345678@st.yc.ac.kr)"
                            onChange={onChange}
                            disabled={isEmailVerified}
                            required
                        />
                    </label>
                    <button type="button" onClick={handleSendCode} disabled={isEmailVerified}>
                        {isCodeSent ? "재전송" : "인증번호 받기"}
                    </button>
                </div>

                {isCodeSent && !isEmailVerified && (
                    <div>
                        <label>
                            인증번호
                            <input
                                name="code"
                                type="text"
                                placeholder="인증 코드 6자리"
                                onChange={onChange}
                                required
                            />
                        </label>
                        <button type="button" onClick={handleCheckCode}>
                            코드 확인
                        </button>
                    </div>
                )}

                <label>
                    이름
                    <input
                        name="name"
                        type="text"
                        placeholder="이름 (예: 김연암)"
                        onChange={onChange}
                        disabled={!isEmailVerified}
                        required
                    />
                </label>

                <label>
                    학과
                    <input
                        name="major"
                        type="text"
                        list="major"
                        placeholder="학과 (예: 스마트소프트웨어학과)"
                        value={formData.major}
                        onChange={onChange}
                        required
                        disabled={!isEmailVerified}
                    />
                    <datalist id="major">
                        <option value="전기전자공학과" />
                        <option value="스마트전기전자공학과" />
                        <option value="기계공학과" />
                        <option value="스마트기계공학과" />
                        <option value="스마트소프트웨어학과" />
                    </datalist>
                </label>

                <label>
                    전화번호
                    <input
                        name="phoneNumber"
                        type="text"
                        placeholder="전화번호"
                        onChange={onChange}
                        required
                        disabled={!isEmailVerified}
                    />
                </label>
                <label>
                    생년월일
                    <input
                        name="birthdate"
                        type="date"
                        placeholder="생년월일"
                        onChange={onChange}
                        required
                        disabled={!isEmailVerified}
                    />
                </label>
                <label>
                    비밀번호
                    <input
                        name="password"
                        type="password"
                        placeholder="비밀번호 (8자 이상)"
                        onChange={onChange}
                        required
                        disabled={!isEmailVerified}
                    />
                </label>

                <button type="submit" disabled={!isEmailVerified}>
                    회원가입 완료
                </button>
            </form>
        </div>
    );
}

export default SignupForm;
