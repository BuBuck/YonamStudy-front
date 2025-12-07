import React, { useState } from "react";
import { GoCalendar, GoPeople, GoCheck } from "react-icons/go";
import { RxCross2 } from "react-icons/rx";
import Modal from "../../Modal/Modal";
import "./ApplicationListModal.css";

const ApplicationListModal = ({
    isOpen,
    onClose,
    applications,
    applicationForm,
    onApprove,
    onReject,
}) => {
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [filter, setFilter] = useState("all");

    // 필터링 로직 유지
    const filteredApplications = applications.filter((app) => {
        if (filter === "all") return true;
        return app.status === filter;
    });

    const handleViewDetails = (application) => {
        setSelectedApplication(application);
    };

    const handleBack = () => {
        setSelectedApplication(null);
    };

    // [수정 1] 날짜 포맷 함수 안전하게 변경
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // [수정 2] 답변 찾는 헬퍼 함수 추가 (배열에서 찾기)
    const findAnswer = (appAnswers, questionId) => {
        if (!appAnswers) return null;

        // 만약 백엔드가 객체 { "id": "val" }로 준다면:
        if (!Array.isArray(appAnswers)) {
            return appAnswers[questionId];
        }

        // 만약 백엔드가 배열 [{ questionId: "...", answer: "..." }]로 준다면:
        const found = appAnswers.find((a) => a.questionId === questionId);
        return found ? found.answer : null;
    };

    // [수정 3] 상태 뱃지 함수 유지
    const getStatusBadge = (status) => {
        const badges = {
            pending: { label: "대기중", className: "status-pending" },
            approved: { label: "승인", className: "status-approved" },
            rejected: { label: "거절", className: "status-rejected" },
        };
        return badges[status] || badges.pending;
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={selectedApplication ? "신청서 상세보기" : "그룹 신청서 관리"}
            size="large"
        >
            {!selectedApplication ? (
                /* === 목록 뷰 === */
                <div className="application-list-container">
                    {/* 탭 버튼들 (기존 코드 유지) */}
                    <div className="filter-tabs">
                        <button
                            className={`filter-tab ${filter === "all" ? "active" : ""}`}
                            onClick={() => setFilter("all")}
                        >
                            전체 ({applications.length})
                        </button>
                        <button
                            className={`filter-tab ${filter === "pending" ? "active" : ""}`}
                            onClick={() => setFilter("pending")}
                        >
                            대기중 ({applications.filter((a) => a.status === "pending").length})
                        </button>
                        <button
                            className={`filter-tab ${filter === "approved" ? "active" : ""}`}
                            onClick={() => setFilter("approved")}
                        >
                            승인 ({applications.filter((a) => a.status === "approved").length})
                        </button>
                        <button
                            className={`filter-tab ${filter === "rejected" ? "active" : ""}`}
                            onClick={() => setFilter("rejected")}
                        >
                            거절 ({applications.filter((a) => a.status === "rejected").length})
                        </button>
                    </div>

                    <div className="applications-list">
                        {filteredApplications.length === 0 ? (
                            <div className="empty-applications">
                                <p>신청서가 없습니다.</p>
                            </div>
                        ) : (
                            filteredApplications.map((application) => {
                                const statusBadge = getStatusBadge(application.status);

                                // [수정 4] 데이터 접근 경로 수정 (applicant.name, createdAt 등)
                                const applicantName = application.applicant?.name || "알 수 없음";
                                const submittedDate =
                                    application.createdAt || application.submittedAt;

                                return (
                                    <div
                                        key={application._id}
                                        className="application-item"
                                        onClick={() => handleViewDetails(application)}
                                    >
                                        <div className="application-header">
                                            <div className="applicant-info">
                                                <div className="applicant-avatar">
                                                    {/* 프로필 이미지가 있다면 표시, 없으면 아이콘 */}
                                                    {application.applicant?.userProfile ? (
                                                        <img
                                                            src={`${
                                                                import.meta.env.VITE_BACKEND_URL
                                                            }${application.applicant.userProfile}`}
                                                            alt="profile"
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                borderRadius: "50%",
                                                            }}
                                                        />
                                                    ) : (
                                                        <GoPeople size={24} />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="applicant-name">
                                                        {applicantName}
                                                    </div>
                                                    <div className="application-date">
                                                        <GoCalendar size={14} />
                                                        {formatDate(submittedDate)}
                                                    </div>
                                                </div>
                                            </div>
                                            <span
                                                className={`status-badge ${statusBadge.className}`}
                                            >
                                                {statusBadge.label}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            ) : (
                /* === 상세 뷰 === */
                <div className="application-detail-container">
                    <button className="btn btn-secondary btn-sm" onClick={handleBack}>
                        ← 목록으로
                    </button>

                    <div className="applicant-detail-card">
                        <div className="applicant-avatar-large">
                            {selectedApplication.applicant?.userProfile ? (
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}${
                                        selectedApplication.applicant.userProfile
                                    }`}
                                    alt="profile"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                    }}
                                />
                            ) : (
                                <GoPeople size={48} />
                            )}
                        </div>
                        <div>
                            {/* [수정 5] 상세 정보에서도 applicant 객체 내부 접근 */}
                            <h3>{selectedApplication.applicant?.name || "이름 없음"}</h3>
                            <p className="applicant-email">
                                {selectedApplication.applicant?.email || "이메일 없음"}
                            </p>
                            <div className="application-date">
                                <GoCalendar size={14} />
                                {/* [수정 6] 날짜 필드 createdAt 우선 사용 */}
                                신청일:{" "}
                                {formatDate(
                                    selectedApplication.createdAt || selectedApplication.submittedAt
                                )}
                            </div>
                        </div>
                        <span
                            className={`status-badge ${
                                getStatusBadge(selectedApplication.status).className
                            }`}
                        >
                            {getStatusBadge(selectedApplication.status).label}
                        </span>
                    </div>

                    <div className="answers-section">
                        <h4>신청서 답변</h4>
                        {applicationForm.questions.map((question, index) => {
                            // [수정 7] 답변 찾아오는 로직 변경 (배열 대응)
                            // 질문의 ID가 _id인지 id인지 확인
                            const qId = question._id || question.id;
                            const answerText = findAnswer(selectedApplication.answers, qId);

                            return (
                                <div key={qId} className="answer-item">
                                    <div className="answer-question-label">
                                        {index + 1}. {question.question}
                                        {question.required && (
                                            <span className="required-mark">*</span>
                                        )}
                                    </div>
                                    <div className="answer-content">
                                        {/* 답변이 있으면 출력, 없으면 안내 문구 */}
                                        {answerText ? (
                                            answerText
                                        ) : (
                                            <span className="no-answer">(답변 없음)</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {selectedApplication.status === "pending" && (
                        <div className="application-actions">
                            <button
                                className="btn btn-outline btn-danger"
                                onClick={() => onReject(selectedApplication._id)}
                            >
                                <RxCross2 size={20} /> 거절
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => onApprove(selectedApplication._id)}
                            >
                                <GoCheck size={20} /> 승인
                            </button>
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
};

export default ApplicationListModal;
