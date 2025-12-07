import React, { useState } from "react";

import Modal from "../../Modal/Modal";

import { GoPlus, GoTrash } from "react-icons/go";
import { LuGripVertical } from "react-icons/lu";

import "./CreateFormModal.css";

const CreateFormModal = ({ isOpen, onClose, onSave, existingForm }) => {
    const [questions, setQuestions] = useState(existingForm?.questions || []);
    const [isSaving, setIsSaving] = useState(false);

    const questionTypes = [
        { value: "text", label: "단답형" },
        { value: "textarea", label: "장문형" },
        { value: "select", label: "드롭다운" },
        { value: "radio", label: "객관식" },
    ];

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: `q_${Date.now()}`,
                type: "text",
                question: "",
                description: "",
                required: true,
                options: [],
            },
        ]);
    };

    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const updateQuestion = (index, field, value) => {
        const updated = [...questions];
        updated[index] = {
            ...updated[index],
            [field]: value,
        };
        setQuestions(updated);
    };

    const addOption = (questionIndex) => {
        const updated = [...questions];
        if (!updated[questionIndex].options) {
            updated[questionIndex].options = [];
        }
        updated[questionIndex].options.push("");
        setQuestions(updated);
    };

    const updateOption = (questionIndex, optionIndex, value) => {
        const updated = [...questions];
        updated[questionIndex].options[optionIndex] = value;
        setQuestions(updated);
    };

    const removeOption = (questionIndex, optionIndex) => {
        const updated = [...questions];
        updated[questionIndex].options = updated[questionIndex].options.filter(
            (_, i) => i !== optionIndex
        );
        setQuestions(updated);
    };

    const handleSave = async () => {
        // 유효성 검사
        const invalidQuestions = questions.filter((q) => !q.question.trim());
        if (invalidQuestions.length > 0) {
            alert("모든 질문에 내용을 입력해주세요.");
            return;
        }

        // 객관식/드롭다운 질문의 옵션 검사
        const questionsNeedingOptions = questions.filter(
            (q) =>
                (q.type === "select" || q.type === "radio") &&
                (!q.options || q.options.length === 0)
        );
        if (questionsNeedingOptions.length > 0) {
            alert("객관식 및 드롭다운 질문에는 최소 1개의 옵션이 필요합니다.");
            return;
        }

        setIsSaving(true);
        try {
            await onSave({
                questions,
                createdAt: new Date().toISOString(),
            });
            onClose();
        } catch (error) {
            console.error("신청서 양식 저장 실패:", error);
            alert("신청서 양식 저장에 실패했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    const footer = (
        <>
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={isSaving}>
                취소
            </button>
            <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                disabled={isSaving}
            >
                {isSaving ? "저장 중..." : "저장"}
            </button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="그룹 신청서 양식 만들기"
            size="large"
            footer={footer}
        >
            <div className="create-form-container">
                <div className="form-builder-intro">
                    <p>그룹에 참여하려는 지원자들이 작성할 신청서 양식을 만들어주세요.</p>
                    <p>적절한 질문을 통해 그룹에 적합한 멤버를 선발할 수 있습니다.</p>
                </div>

                <div className="questions-builder">
                    {questions.length === 0 ? (
                        <div className="empty-state">
                            <p>아직 질문이 없습니다.</p>
                            <p className="empty-hint">아래 버튼을 눌러 질문을 추가하세요.</p>
                        </div>
                    ) : (
                        questions.map((question, index) => (
                            <div key={question.id} className="question-builder-card">
                                <div className="question-builder-header">
                                    <div className="question-drag-handle">
                                        <LuGripVertical size={20} />
                                    </div>
                                    <span className="question-number">질문 {index + 1}</span>
                                    <button
                                        type="button"
                                        className="btn-icon btn-danger"
                                        onClick={() => removeQuestion(index)}
                                        title="질문 삭제"
                                    >
                                        <GoTrash size={18} />
                                    </button>
                                </div>

                                <div className="question-builder-body">
                                    <div className="form-group">
                                        <label>질문 유형</label>
                                        <select
                                            className="form-select"
                                            value={question.type}
                                            onChange={(e) =>
                                                updateQuestion(index, "type", e.target.value)
                                            }
                                        >
                                            {questionTypes.map((type) => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>질문 내용 *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={question.question}
                                            onChange={(e) =>
                                                updateQuestion(index, "question", e.target.value)
                                            }
                                            placeholder="예: 이 스터디에 지원하는 이유는 무엇인가요?"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>설명 (선택사항)</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={question.description}
                                            onChange={(e) =>
                                                updateQuestion(index, "description", e.target.value)
                                            }
                                            placeholder="질문에 대한 추가 설명"
                                        />
                                    </div>

                                    {(question.type === "select" || question.type === "radio") && (
                                        <div className="form-group">
                                            <label>선택 옵션</label>
                                            <div className="options-list">
                                                {question.options?.map((option, optIdx) => (
                                                    <div key={optIdx} className="option-item">
                                                        <input
                                                            type="text"
                                                            className="form-input"
                                                            value={option}
                                                            onChange={(e) =>
                                                                updateOption(
                                                                    index,
                                                                    optIdx,
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder={`옵션 ${optIdx + 1}`}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn-icon btn-danger-outline"
                                                            onClick={() =>
                                                                removeOption(index, optIdx)
                                                            }
                                                        >
                                                            <GoTrash size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => addOption(index)}
                                                >
                                                    <GoPlus size={16} />
                                                    옵션 추가
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={question.required}
                                                onChange={(e) =>
                                                    updateQuestion(
                                                        index,
                                                        "required",
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                            <span>필수 질문</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <button type="button" className="btn btn-outline btn-full" onClick={addQuestion}>
                    <GoPlus size={20} />
                    질문 추가
                </button>
            </div>
        </Modal>
    );
};

export default CreateFormModal;
