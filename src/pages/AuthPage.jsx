import React, { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import SignupFrom from "../components/auth/SignupForm";
import LoginForm from "../components/auth/LoginForm";
import ChangePwForm from "../components/auth/ChangePwForm";
import ResetPwForm from "../components/auth/ResetPwForm";
import Not from "./Not";

function AuthPage() {
    const [formData, setFormData] = useState({});

    const { category } = useParams();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const renderForm = () => {
        switch (category) {
            case "login":
                return (
                    <LoginForm
                        formData={formData}
                        setFormData={(data) => setFormData(data)}
                        onChange={handleChange}
                    />
                );
            case "signup":
                return (
                    <SignupFrom
                        formData={formData}
                        setFormData={(data) => setFormData(data)}
                        onChange={handleChange}
                    />
                );
            case "forgot-password":
                return (
                    <ChangePwForm
                        formData={formData}
                        setFormData={(data) => setFormData(data)}
                        onChange={handleChange}
                    />
                );
            case "reset-password":
                return (
                    <ResetPwForm
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

    return <div>{renderForm()}</div>;
}

export default AuthPage;
