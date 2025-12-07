import React, { useState } from "react";

import Modal from "../../Modal/Modal";

import "./ApplicationFormModal.css";

const ApplicationFormModal = ({ isOpen, onClose, groupTitle, applicationForm, onSubmit }) => {
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // questions가 undefined일 경우를 대비해 빈 배열([])로 초기화
    // 데이터가 아직 로딩되지 않았거나, 질문이 없는 경우에도 안전합니다.
    const questions = applicationForm?.questions || [];

    const handleAnswerChange = (questionId, value) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 안전하게 정의된 questions 변수 사용
        const unansweredRequired = questions.filter((q) => q.required && !answers[q._id]);

        if (unansweredRequired.length > 0) {
            alert("모든 필수 질문에 답변해주세요.");
            return;
        }

        setIsSubmitting(true);

        try {
            await onSubmit({
                // answers가 { "질문ID": "답변" } 형태이므로 그대로 전달
                answers,
                submittedAt: new Date().toISOString(),
            });
            setAnswers({});
        } catch (error) {
            console.error("신청서 제출 실패:", error);
            alert("신청서 제출에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderQuestion = (question) => {
        switch (question.type) {
            case "text":
                return (
                    <input
                        type="text"
                        className="form-input"
                        value={answers[question._id] || ""}
                        onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                        placeholder="답변을 입력하세요"
                        required={question.required}
                    />
                );
            case "textarea":
                return (
                    <textarea
                        className="form-textarea"
                        value={answers[question._id] || ""}
                        onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                        placeholder="답변을 입력하세요"
                        rows="4"
                        required={question.required}
                    />
                );
            case "select":
                return (
                    <select
                        className="form-select"
                        value={answers[question._id] || ""}
                        onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                        required={question.required}
                    >
                        <option value="">선택하세요</option>
                        {question.options?.map((option, idx) => (
                            <option key={idx} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                );
            case "radio":
                return (
                    <div className="radio-group">
                        {question.options?.map((option, idx) => (
                            <label key={idx} className="radio-label">
                                <input
                                    type="radio"
                                    name={question._id}
                                    value={option}
                                    checked={answers[question._id] === option}
                                    onChange={(e) =>
                                        handleAnswerChange(question._id, e.target.value)
                                    }
                                    required={question.required}
                                />
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    const footer = (
        <>
            <button
                type="button"
                className="btn btn-outline"
                onClick={onClose}
                disabled={isSubmitting}
            >
                취소
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "제출 중..." : "신청서 제출"}
            </button>
        </>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${groupTitle} 참여 신청서`} size="large">
            <form onSubmit={handleSubmit} className="application-form">
                <div className="form-intro">
                    <p>그룹에 참여하기 위해 아래 질문에 답변해주세요.</p>
                    <p className="form-note">
                        <span className="required-mark">*</span> 표시는 필수 항목입니다.
                    </p>
                </div>

                <div className="form-questions">
                    {/* [수정 3] questions가 있을 때만 맵핑, 없으면 안내 문구 표시 */}
                    {questions.length > 0 ? (
                        questions.map((question, index) => (
                            <div key={question._id} className="form-question">
                                <label className="question-label">
                                    {index + 1}. {question.question}
                                    {question.required && <span className="required-mark">*</span>}
                                </label>
                                {question.description && (
                                    <p className="question-description">{question.description}</p>
                                )}
                                {renderQuestion(question)}
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: "center", padding: "2rem 0", color: "#666" }}>
                            <p>별도의 작성할 신청서 양식이 없습니다.</p>
                            <p>바로 '신청서 제출' 버튼을 눌러주세요.</p>
                        </div>
                    )}
                </div>

                <div className="modal-footer">{footer}</div>
            </form>
        </Modal>
    );
};

export default ApplicationFormModal;
