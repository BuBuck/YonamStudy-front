import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { AuthContext } from "../../contexts/auth/AuthContext";

function LoginForm({ formData, setFormData, onChange }) {
    const navigate = useNavigate();

    const { setIsAuthenticated } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const { studentId, password } = formData;

            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
                studentId,
                password,
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
        <div>
            <form className="login-form" onSubmit={handleLogin}>
                <h3>로그인</h3>

                <label>
                    아이디
                    <input
                        name="studentId"
                        type="text"
                        placeholder="학번 (이메일 앞 8자리)"
                        onChange={onChange}
                        required
                    />
                </label>

                <label>
                    비밀번호
                    <input
                        name="password"
                        type="password"
                        placeholder="비밀번호"
                        onChange={onChange}
                        required
                    />
                </label>

                <button type="submit">로그인</button>
            </form>
            <div>
                <div onClick={() => navigate("/auth/signup")}>
                    아직 계정이 없으신가요? (회원가입)
                </div>
                <div onClick={() => navigate("/auth/forgot-password")}>
                    비밀번호를 잊어버리셨나요?
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
