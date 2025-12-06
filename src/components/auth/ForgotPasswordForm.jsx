import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { LiaExclamationCircleSolid } from "react-icons/lia";
import { GoCheck } from "react-icons/go";
import { GoClock } from "react-icons/go";
import { GoMail } from "react-icons/go";
import { GoLock } from "react-icons/go";
import { GoArrowLeft } from "react-icons/go";

import "../../pages/AuthPage.css";

function ForgotPasswordForm({ formData, setFormData, onChange }) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError("");

        const emailRegex = /^[0-9]{8}@st\.yc\.ac\.kr$/;
        if (!emailRegex.test(formData.email)) {
            setError("올바른 이메일 주소를 입력해주세요.");
            return;
        }

        setIsLoading(true);

        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`, {
                email: formData.email,
            });

            setIsLoading(false);
            setIsSubmitted(true);
            setFormData({});
        } catch (error) {
            console.error(error);
        }
    };

    if (isSubmitted) {
        return (
            <div className="forgot-password-page">
                <div className="forgot-password-container">
                    <div className="success-card">
                        <div className="success-icon">
                            <GoCheck size={64} stroke="currentColor" />
                        </div>

                        <h1>이메일을 확인해주세요</h1>

                        <p className="success-description">
                            <strong>{formData.email}</strong>로 비밀번호 재설정 링크를 보냈습니다.
                            <br />
                            이메일을 확인하고 링크를 클릭하여 비밀번호를 재설정하세요.
                        </p>

                        <div className="success-info">
                            <div className="info-item">
                                <GoClock size={20} stroke="currentColor" />
                                <span>링크는 10분 동안 유효합니다.</span>
                            </div>

                            <div className="info-item">
                                <GoMail size={20} stroke="currentColor" />
                                <span>이메일이 오지 않으면 스팸 폴더를 확인하세요.</span>
                            </div>
                        </div>

                        <div className="success-actions">
                            <button
                                className="btn btn-outline"
                                onClick={() => {
                                    setIsSubmitted(false);
                                }}
                            >
                                다시 보내기
                            </button>
                            <div
                                className="btn btn-primary"
                                onClick={() => navigate("/auth/login")}
                            >
                                로그인 하러가기
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="forgot-password-page">
            <div className="forgot-password-container">
                <div className="forgot-password-card">
                    <div className="card-header">
                        <div className="icon-wrapper">
                            <GoLock size={48} stroke="currentColor" />
                        </div>

                        <h1>비밀번호 찾기</h1>
                        <p className="subtitle">
                            가입하신 이메일 주소를 입력하시면
                            <br />
                            비밀번호 재설정 링크를 보내드립니다.
                        </p>
                    </div>

                    <form onSubmit={handleForgotPassword} className="forgot-password-form">
                        {error && (
                            <div className="error-message">
                                <LiaExclamationCircleSolid size={20} stroke="currentColor" />
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                이메일 주소
                            </label>
                            <div className="input-wrapper">
                                <GoMail
                                    className="input-icon"
                                    size={20}
                                    stroke="currentColor"
                                    strokeWidth={1}
                                />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-input"
                                    placeholder="예: 22560001(학번)@st.yc.ac.kr"
                                    value={formData.email}
                                    onChange={onChange}
                                    style={{ paddingLeft: "3rem" }}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    전송 중...
                                </>
                            ) : (
                                "재설정 링크 보내기"
                            )}
                        </button>
                    </form>

                    <div className="card-footer">
                        <div onClick={() => navigate("/auth/login")} className="back-link">
                            <GoArrowLeft size={20} stroke="currentColor" />
                            로그인으로 돌아가기
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordForm;
