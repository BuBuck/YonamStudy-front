import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { GoLock } from "react-icons/go";
import { MdOutlineShield } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import { LiaExclamationCircleSolid } from "react-icons/lia";
import { GoCheck } from "react-icons/go";
import { GoArrowLeft } from "react-icons/go";
import { GoX } from "react-icons/go";

import "../../pages/AuthPage/AuthPage.css";

function ResetPasswordForm({ formData, setFormData, onChange, token }) {
    const [isLoading, setIsLoading] = useState(false);
    const [tokenValid, setTokenValid] = useState(true);
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setTokenValid(false);
        }
    }, [token]);

    const [showPassword, setShowPassword] = useState({
        new: false,
        confirm: false,
    });

    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        text: "",
        color: "",
    });

    useEffect(() => {
        // 토큰 유효성 검사 시뮬레이션
        if (!token) {
            setTokenValid(false);
        }
    }, [token]);

    useEffect(() => {
        // 비밀번호 강도 체크
        const password = formData.newPassword;
        if (!password) {
            setPasswordStrength({ score: 0, text: "", color: "" });
            return;
        }

        let score = 0;
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;

        let text = "";
        let color = "";

        if (score <= 2) {
            text = "약함";
            color = "#ff6b6b";
        } else if (score <= 3) {
            text = "보통";
            color = "#ed8936";
        } else {
            text = "강함";
            color = "#48bb78";
        }

        setPasswordStrength({ score, text, color });
    }, [formData.newPassword]);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");

        // 유효성 검사
        if (formData.newPassword.length < 8) {
            setError("비밀번호는 최소 8자 이상이어야 합니다.");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        if (passwordStrength.score < 3) {
            setError("더 강력한 비밀번호를 사용해주세요.");
            return;
        }

        setIsLoading(true);

        try {
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password?token=${token}`,
                { newPassword: formData.newPassword }
            );

            setIsLoading(false);
            navigate("/auth/login", {
                replace: true,
                state: {
                    message: "비밀번호가 성공적으로 변경되었습니다. 새 비밀번호로 로그인하세요.",
                },
            });
            setFormData({});
        } catch (error) {
            console.error(error);
        }
    };

    if (!tokenValid) {
        return (
            <div className="reset-password-page">
                <div className="reset-password-container">
                    <div className="error-card">
                        <div className="error-icon">
                            <svg
                                width="64"
                                height="64"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                        </div>
                        <h1>유효하지 않은 링크</h1>
                        <p className="error-description">
                            비밀번호 재설정 링크가 만료되었거나 유효하지 않습니다.
                            <br />
                            다시 시도해주세요.
                        </p>
                        <div className="error-actions">
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate("auth/forgot-password", { replace: true })}
                            >
                                비밀번호 찾기
                            </button>
                            <button
                                className="btn btn-outline"
                                onClick={() => navigate("/auth/login", { replace: true })}
                            >
                                로그인
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="reset-password-page">
            <div className="reset-password-container">
                <div className="reset-password-card">
                    <div className="card-header">
                        <div className="icon-wrapper">
                            <MdOutlineShield size={48} stroke="currentColor" />
                        </div>
                        <h1>새 비밀번호 설정</h1>
                        <p className="subtitle">
                            안전한 비밀번호를 설정하여
                            <br />
                            계정을 보호하세요.
                        </p>
                    </div>

                    <form onSubmit={handleResetPassword} className="reset-password-form">
                        {error && (
                            <div className="error-message">
                                <LiaExclamationCircleSolid size={20} stroke="currentColor" />
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="newPassword" className="form-label">
                                새 비밀번호
                            </label>
                            <div className="input-wrapper">
                                <GoLock className="input-icon" size={20} stroke="currentColor" />
                                <input
                                    type={showPassword.new ? "text" : "password"}
                                    id="newPassword"
                                    name="newPassword"
                                    className="form-input"
                                    placeholder="새 비밀번호 입력"
                                    value={formData.newPassword}
                                    onChange={onChange}
                                    style={{ paddingLeft: "3rem" }}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() =>
                                        setShowPassword({ ...showPassword, new: !showPassword.new })
                                    }
                                >
                                    {showPassword.new ? (
                                        <FiEyeOff size={20} stroke="currentColor" />
                                    ) : (
                                        <FiEye size={20} stroke="currentColor" />
                                    )}
                                </button>
                            </div>

                            {formData.newPassword && (
                                <div className="password-strength">
                                    <div className="strength-bars">
                                        {[1, 2, 3, 4, 5].map((bar) => (
                                            <div
                                                key={bar}
                                                className="strength-bar"
                                                style={{
                                                    backgroundColor:
                                                        bar <= passwordStrength.score
                                                            ? passwordStrength.color
                                                            : "#e8f0f0",
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <span
                                        className="strength-text"
                                        style={{ color: passwordStrength.color }}
                                    >
                                        {passwordStrength.text}
                                    </span>
                                </div>
                            )}

                            <div className="password-requirements">
                                <div
                                    className={`requirement ${
                                        formData.newPassword?.length >= 8 ? "met" : ""
                                    }`}
                                >
                                    <GoCheck size={16} stroke="currentColor" />
                                    <span>최소 8자 이상</span>
                                </div>

                                <div
                                    className={`requirement ${
                                        /[A-Z]/.test(formData.newPassword) ? "met" : ""
                                    }`}
                                >
                                    <GoCheck size={16} stroke="currentColor" />
                                    <span>대문자 포함</span>
                                </div>

                                <div
                                    className={`requirement ${
                                        /[0-9]/.test(formData.newPassword) ? "met" : ""
                                    }`}
                                >
                                    <GoCheck size={16} stroke="currentColor" />
                                    <span>숫자 포함</span>
                                </div>

                                <div
                                    className={`requirement ${
                                        /[^a-zA-Z0-9]/.test(formData.newPassword) ? "met" : ""
                                    }`}
                                >
                                    <GoCheck size={16} stroke="currentColor" />
                                    <span>특수문자 포함</span>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">
                                비밀번호 확인
                            </label>
                            <div className="input-wrapper">
                                <GoLock className="input-icon" size={20} stroke="currentColor" />
                                <input
                                    type={showPassword.confirm ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className="form-input"
                                    placeholder="비밀번호 다시 입력"
                                    value={formData.confirmPassword}
                                    onChange={onChange}
                                    style={{ paddingLeft: "3rem" }}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() =>
                                        setShowPassword({
                                            ...showPassword,
                                            confirm: !showPassword.confirm,
                                        })
                                    }
                                >
                                    {showPassword.confirm ? (
                                        <FiEyeOff size={20} stroke="currentColor" />
                                    ) : (
                                        <FiEye size={20} stroke="currentColor" />
                                    )}
                                </button>
                            </div>

                            {formData.confirmPassword && (
                                <div
                                    className={`password-match ${
                                        formData.newPassword === formData.confirmPassword
                                            ? "match"
                                            : "mismatch"
                                    }`}
                                >
                                    {formData.newPassword === formData.confirmPassword ? (
                                        <GoCheck size={16} stroke="currentColor" />
                                    ) : (
                                        <GoX size={16} stroke="currentColor" />
                                    )}
                                    <span>
                                        {formData.newPassword === formData.confirmPassword
                                            ? "비밀번호가 일치합니다"
                                            : "비밀번호가 일치하지 않습니다"}
                                    </span>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    비밀번호 변경 중...
                                </>
                            ) : (
                                "비밀번호 변경하기"
                            )}
                        </button>
                    </form>

                    <div className="card-footer">
                        <button
                            className="back-link"
                            onClick={() => navigate("/auth/login", { replace: true })}
                        >
                            <GoArrowLeft size={20} stroke="currentColor" />
                            로그인으로 돌아가기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordForm;
