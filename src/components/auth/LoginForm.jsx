import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { AuthContext } from "../../contexts/auth/AuthContext";

import "../../pages/AuthPage.css";

function LoginForm({ formData, setFormData, onChange }) {
    const navigate = useNavigate();

    const { setIsAuthenticated } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const { studentId, password, stayLogin } = formData;

            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
                studentId,
                password,
                stayLogin,
            });

            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("expiresToken", JSON.stringify(res.data.expiresToken));
            localStorage.setItem("expiresAt", JSON.stringify(res.data.expiresAt));

            alert(`환영합니다, ${res.data.user.name}님!`);
            setFormData({});
            setIsAuthenticated(true);
            navigate(-1, { replace: true });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="auth-right">
            <div className="auth-form-container">
                <div className="auth-header">
                    <h2 className="auth-title">로그인</h2>
                    <p className="auth-subtitle">계정에 로그인하여 스터디를 시작하세요</p>

                    <form className="auth-form" onSubmit={handleLogin}>
                        <div className="form-group">
                            <label className="form-label">
                                아이디
                                <input
                                    name="studentId"
                                    type="text"
                                    placeholder="학번 (이메일 앞 8자리)"
                                    onChange={onChange}
                                    className="form-input"
                                    required
                                />
                            </label>
                        </div>

                        <label className="form-label">
                            비밀번호
                            <input
                                name="password"
                                type="password"
                                placeholder="비밀번호"
                                onChange={onChange}
                                className="form-input"
                                required
                            />
                        </label>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input type="checkbox" name="stayLogin" onChange={onChange} />
                                <span>로그인 상태 유지</span>
                            </label>
                            <div
                                className="forgot-link"
                                onClick={() => navigate("/auth/forgot-password")}
                            >
                                비밀번호 찾기
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-full">
                            로그인
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            계정이 없으신가요?{" "}
                            <span className="auth-link" onClick={() => navigate("/auth/signup")}>
                                회원가입
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
