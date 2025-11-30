import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { AuthContext } from "../contexts/auth/AuthContext";

// 백엔드 서버 주소 (Express 서버를 5001번 포트에서 실행 중이라고 가정)
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth`;

// 간단한 스타일 객체 (styles 객체는 동일하게 유지)
const styles = {
    container: {
        // ... (styles.container, .form, .input, .button, ... 등 기존 스타일은 동일) ...
        fontFamily: "Arial, sans-serif",
        width: "400px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    input: {
        padding: "10px",
        fontSize: "16px",
        borderRadius: "4px",
        border: "1px solid #ccc",
    },
    button: {
        padding: "12px",
        fontSize: "16px",
        borderRadius: "4px",
        border: "none",
        backgroundColor: "#007bff",
        color: "white",
        cursor: "pointer",
    },
    navButton: {
        backgroundColor: "#6c757d",
        margin: "0 5px",
    },
    message: {
        padding: "10px",
        borderRadius: "4px",
        marginTop: "15px",
        textAlign: "center",
        whiteSpace: "pre-wrap", // 줄바꿈을 위해
    },
    success: {
        backgroundColor: "#d4edda",
        color: "#155724",
    },
    error: {
        backgroundColor: "#f8d7da",
        color: "#721c24",
    },
    nav: {
        marginBottom: "20px",
        textAlign: "center",
    },
    // [추가] 폼 그룹핑을 위한 스타일
    inputGroup: {
        display: "flex",
        gap: "10px",
        alignItems: "center",
    },
    // [추가] 폼 그룹 내 버튼을 위한 스타일
    groupButton: {
        padding: "10px",
        fontSize: "14px",
        borderRadius: "4px",
        border: "none",
        backgroundColor: "#28a745",
        color: "white",
        cursor: "pointer",
    },
};

function AuthTestPage() {
    // 'register', 'login', 'forgot', 'reset' 모드를 관리
    const [mode, setMode] = useState("login"); // 기본 모드를 register로 변경
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState({ type: "", text: "" });

    const navigate = useNavigate();

    const { setIsAuthenticated } = useContext(AuthContext);

    // --- [수정] 회원가입 로직 상태 ---
    // [제거] emailForVerification (formData.email을 직접 사용)
    // [추가] 코드가 전송되었는지 여부
    const [isCodeSent, setIsCodeSent] = useState(false);
    // [추가] 이메일 인증이 최종 완료되었는지 여부
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    // ---

    // 폼 입력값 변경 핸들러
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // 메시지 초기화
    const clearMessage = () => setMessage({ type: "", text: "" });

    // 폼 모드 변경
    const changeMode = (newMode) => {
        setMode(newMode);
        setFormData({});
        clearMessage();
        // [추가] 모드 변경 시 인증 상태 초기화
        setIsCodeSent(false);
        setIsEmailVerified(false);
    };

    // --- [수정] 1. (1단계) 인증 코드 전송 ---
    const handleSendCode = async () => {
        clearMessage();
        if (!formData.email) {
            setMessage({ type: "error", text: "이메일을 먼저 입력해주세요." });
            return;
        }
        try {
            // [수정] /send-verification API를 사용하여 코드 전송
            const res = await axios.post(`${API_BASE_URL}/send-verification`, {
                email: formData.email,
            });
            setMessage({ type: "success", text: res.data.message });
            setIsCodeSent(true); // 코드 입력창 보이기
            setIsEmailVerified(false); // (재전송일 경우를 대비해) 인증 상태 초기화
        } catch (err) {
            setMessage({
                type: "error",
                text: err.response?.data?.message || "코드 전송 실패",
            });
        }
    };

    // --- [수정] 2. (2단계) 인증 코드 확인 ---
    const handleCheckCode = async () => {
        clearMessage();
        try {
            const res = await axios.post(`${API_BASE_URL}/verify-code`, {
                email: formData.email, // 현재 폼에 입력된 이메일
                code: formData.code,
            });

            setMessage({ type: "success", text: res.data.message });
            setIsEmailVerified(true); // [성공] 이메일 인증됨
            setIsCodeSent(false); // 코드 입력창 숨기기
        } catch (err) {
            setMessage({
                type: "error",
                text: err.response?.data?.message || "인증 실패",
            });
            setIsEmailVerified(false);
        }
    };

    // --- [수정] 3. (3단계) 최종 회원가입 ---
    // (기존 handleRegister의 역할)
    const handleFinalRegister = async (e) => {
        e.preventDefault();
        clearMessage();

        // [추가] 이메일 인증 여부 최종 확인
        if (!isEmailVerified) {
            setMessage({
                type: "error",
                text: "이메일 인증을 먼저 완료해주세요.",
            });
            return;
        }

        try {
            const { name, major, email, phoneNumber, birthdate, password } = formData;
            const res = await axios.post(`${API_BASE_URL}/sign-up`, {
                name,
                major,
                email,
                phoneNumber,
                birthdate,
                password,
            });

            setMessage({ type: "success", text: res.data.message });
            setMode("login"); // 가입 완료 후 로그인 모드로 변경
            setFormData({});
            setIsEmailVerified(false); // 상태 초기화
        } catch (err) {
            setMessage({
                type: "error",
                text: err.response?.data?.message || "회원가입 실패",
            });
        }
    };

    // --- 3. 로그인 (변경 없음) ---
    const handleLogin = async (e) => {
        // ... (기존 handleLogin 로직은 동일) ...
        e.preventDefault();
        clearMessage();

        try {
            const { studentId, password } = formData;

            const res = await axios.post(`${API_BASE_URL}/login`, {
                studentId,
                password,
            });

            // 로그인 성공 시 토큰을 localStorage에 저장
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("expiresToken", JSON.stringify(res.data.expiresToken));
            localStorage.setItem("expiresAt", JSON.stringify(res.data.expiresAt));
            setMessage({
                type: "success",
                text: `로그인 성공! ${res.data.user.name}님 환영합니다.\n(토큰이 localStorage에 저장되었습니다.)`,
            });

            setIsAuthenticated(true);
            navigate("/");
            alert("로그인 성공!");
        } catch (err) {
            // (이메일 미인증 에러 401 포함)
            setMessage({
                type: "error",
                text: err.response?.data?.message || "로그인 실패",
            });
        }
    };

    // --- 4. 비밀번호 찾기 (변경 없음) ---
    const handleForgotPassword = async (e) => {
        // ... (기존 handleForgotPassword 로직은 동일) ...
        e.preventDefault();
        clearMessage();
        try {
            const res = await axios.post(`${API_BASE_URL}/forgot-password`, {
                email: formData.email,
            });
            setMessage({ type: "success", text: res.data.message });
            // (실제로는 이메일을 확인하라고 안내)
            // 테스트를 위해 바로 리셋 모드로 전환
            setMode("reset");
        } catch (err) {
            setMessage({
                type: "error",
                text: err.response?.data?.message || "요청 실패",
            });
        }
    };

    // --- 5. 비밀번호 재설정 (변경 없음) ---
    const handleResetPassword = async (e) => {
        // ... (기존 handleResetPassword 로직은 동일) ...
        e.preventDefault();
        clearMessage();
        try {
            // (주의: 실제 앱에서는 이메일 링크의 URL 쿼리에서 토큰을 가져옵니다)
            // 여기서는 테스트를 위해 폼에서 직접 토큰을 입력받습니다.
            const res = await axios.post(
                `${API_BASE_URL}/reset-password?token=${formData.token}`, // URL 쿼리로 토큰 전송
                { newPassword: formData.newPassword } // 바디로 새 비밀번호 전송
            );

            setMessage({ type: "success", text: res.data.message });
            setMode("login");
            setFormData({});
        } catch (err) {
            setMessage({
                type: "error",
                text: err.response?.data?.message || "재설정 실패",
            });
        }
    };

    // --- 폼 렌더링 ---
    const renderForm = () => {
        switch (mode) {
            // --- [수정] 회원가입 폼 (중간 인증 로직 포함) ---
            case "register":
                return (
                    <form style={styles.form} onSubmit={handleFinalRegister}>
                        <h3>회원가입</h3>

                        {/* 1. 이메일 입력 그룹 */}
                        <div style={styles.inputGroup}>
                            <input
                                style={{ ...styles.input, flex: 1 }}
                                type="email"
                                name="email"
                                placeholder="학교 이메일 (예: 12345678@st.yc.ac.kr)"
                                onChange={handleChange}
                                required
                                // [수정] 인증이 완료되면 이메일 수정 불가
                                disabled={isEmailVerified}
                            />
                            <button
                                type="button"
                                style={styles.groupButton}
                                // [수정] 인증 완료 시 버튼 비활성화
                                onClick={handleSendCode}
                                disabled={isEmailVerified}
                            >
                                {isCodeSent ? "재전송" : "인증번호 받기"}
                            </button>
                        </div>

                        {/* 2. 인증 코드 입력 그룹 (코드가 전송되었고, 아직 인증 안됐을 때) */}
                        {isCodeSent && !isEmailVerified && (
                            <div style={styles.inputGroup}>
                                <input
                                    style={{ ...styles.input, flex: 1 }}
                                    type="text"
                                    name="code"
                                    placeholder="인증 코드 6자리"
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    style={styles.groupButton}
                                    onClick={handleCheckCode}
                                >
                                    코드 확인
                                </button>
                            </div>
                        )}

                        {/* 3. 나머지 정보 (이메일 인증이 완료되어야 활성화) */}
                        <input
                            style={styles.input}
                            type="text"
                            name="name"
                            placeholder="이름 (예: 홍길동)"
                            onChange={handleChange}
                            required
                            // [수정] 인증 완료 시에만 활성화
                            disabled={!isEmailVerified}
                        />
                        <input
                            style={styles.input}
                            type="text"
                            name="major"
                            placeholder="학과 (예: 스마트소프트웨어학과)"
                            onChange={handleChange}
                            required
                            disabled={!isEmailVerified}
                        />
                        <input
                            style={styles.input}
                            type="tel"
                            name="phoneNumber"
                            placeholder="전화번호 (예: 010-1234-5678)"
                            onChange={handleChange}
                            required
                            disabled={!isEmailVerified}
                        />
                        <input
                            style={styles.input}
                            type="date"
                            name="birthdate"
                            placeholder="생년월일"
                            onChange={handleChange}
                            required
                            disabled={!isEmailVerified}
                        />
                        <input
                            style={styles.input}
                            type="password"
                            name="password"
                            placeholder="비밀번호 (8자 이상)"
                            onChange={handleChange}
                            required
                            disabled={!isEmailVerified}
                        />
                        <button
                            style={styles.button}
                            type="submit"
                            // [수정] 인증 완료 시에만 활성화
                            disabled={!isEmailVerified}
                        >
                            회원가입 완료
                        </button>
                    </form>
                );

            // --- [제거] 'verify' 모드 ---
            // 'register' 모드에 통합되었으므로 case 'verify'는 삭제합니다.

            // --- 로그인 폼 (변경 없음) ---
            case "login":
                return (
                    // ... (기존 case 'login' JSX는 동일) ...

                    <form style={styles.form} onSubmit={handleLogin}>
                        <h3>로그인</h3>
                        <input
                            style={styles.input}
                            type="text"
                            name="studentId"
                            placeholder="학번 (이메일 앞 8자리)"
                            onChange={handleChange}
                            required
                        />
                        <input
                            style={styles.input}
                            type="password"
                            name="password"
                            placeholder="비밀번호"
                            onChange={handleChange}
                            required
                        />
                        <button style={styles.button} type="submit">
                            로그인
                        </button>
                    </form>
                );

            // --- 비밀번호 찾기 폼 (변경 없음) ---
            case "forgot":
                return (
                    // ... (기존 case 'forgot' JSX는 동일) ...
                    <form style={styles.form} onSubmit={handleForgotPassword}>
                        <h3>비밀번호 찾기</h3>
                        <p style={{ textAlign: "center", fontSize: "14px" }}>
                            가입 시 사용한 이메일을 입력하세요.
                        </p>
                        <input
                            style={styles.input}
                            type="email"
                            name="email"
                            placeholder="학교 이메일"
                            onChange={handleChange}
                            required
                        />
                        <button style={styles.button} type="submit">
                            재설정 메일 받기
                        </button>
                    </form>
                );

            // --- 비밀번호 재설정 폼 (변경 없음) ---
            case "reset":
                return (
                    // ... (기존 case 'reset' JSX는 동일) ...
                    <form style={styles.form} onSubmit={handleResetPassword}>
                        <h3>비밀번호 재설정</h3>
                        <p style={{ textAlign: "center", fontSize: "14px" }}>
                            이메일로 받은 토큰을 입력하세요.
                            <br />
                            (테스트용: 실제로는 링크에 포함됨)
                        </p>
                        <input
                            style={styles.input}
                            type="text"
                            name="token"
                            placeholder="이메일로 받은 토큰"
                            onChange={handleChange}
                            required
                        />
                        <input
                            style={styles.input}
                            type="password"
                            name="newPassword"
                            placeholder="새 비밀번호"
                            onChange={handleChange}
                            required
                        />
                        <button style={styles.button} type="submit">
                            비밀번호 변경
                        </button>
                    </form>
                );

            default:
                return null;
        }
    };

    return (
        <div style={styles.container}>
            {/* --- 모드 전환 내비게이션 (변경 없음) --- */}
            <div style={styles.nav}>
                <button
                    style={{ ...styles.button, ...styles.navButton }}
                    onClick={() => changeMode("register")}
                >
                    회원가입
                </button>
                <button
                    style={{ ...styles.button, ...styles.navButton }}
                    onClick={() => changeMode("login")}
                >
                    로그인
                </button>
                <button
                    style={{
                        ...styles.button,
                        ...styles.navButton,
                        fontSize: "14px",
                    }}
                    onClick={() => changeMode("forgot")}
                >
                    비밀번호 찾기
                </button>
            </div>

            {/* --- 현재 모드에 맞는 폼 렌더링 --- */}
            {renderForm()}

            {/* --- 서버 응답 메시지 표시 (변경 없음) --- */}
            {message.text && (
                // ... (기존 메시지 JSX는 동일) ...
                <div
                    style={{
                        ...styles.message,
                        ...(message.type === "success" ? styles.success : styles.error),
                    }}
                >
                    {message.text}
                </div>
            )}
        </div>
    );
}

export default AuthTestPage;
