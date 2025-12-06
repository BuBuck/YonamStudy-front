import React, { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import SignupFrom from "../components/auth/SignupForm";
import LoginForm from "../components/auth/LoginForm";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import ResetPasswordForm from "../components/auth/ResetPasswordForm";
import Not from "./Not";

import "./AuthPage.css";

function AuthPage() {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    const { category } = useParams();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const renderForm = () => {
        switch (category) {
            case "login":
                return (
                    <LoginForm
                        formData={formData}
                        setFormData={(data) => setFormData(data)}
                        errors={errors}
                        setErrors={setErrors}
                        onChange={handleChange}
                    />
                );
            case "signup":
                return (
                    <SignupFrom
                        formData={formData}
                        setFormData={(data) => setFormData(data)}
                        errors={errors}
                        setErrors={setErrors}
                        onChange={handleChange}
                    />
                );
            case "forgot-password":
                return (
                    <ForgotPasswordForm
                        formData={formData}
                        setFormData={(data) => setFormData(data)}
                        onChange={handleChange}
                    />
                );
            case "reset-password":
                return (
                    <ResetPasswordForm
                        formData={formData}
                        setFormData={(data) => setFormData(data)}
                        onChange={handleChange}
                        token={token}
                    />
                );
            default:
                return <Not />;
        }
    };

    if (category === "forgot-password" || category === "reset-password") {
        return renderForm();
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-left">
                    <div className="auth-branding">
                        <div className="logo-large">
                            <div className="logo-icon-large">Y</div>
                        </div>
                        <h1 className="auth-brand-title">YonamStudy</h1>
                        <p className="auth-brand-description">
                            연암공과대학교 학생들을 위한 스터디 그룹 매칭 플랫폼
                        </p>
                        <div className="auth-features">
                            <div className="feature-item">
                                <div className="feature-icon">✓</div>
                                <span>다양한 스터디 그룹</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">✓</div>
                                <span>실시간 채팅</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">✓</div>
                                <span>효율적인 일정 관리</span>
                            </div>
                        </div>
                    </div>
                </div>

                {renderForm()}
            </div>
        </div>
    );
}

export default AuthPage;
