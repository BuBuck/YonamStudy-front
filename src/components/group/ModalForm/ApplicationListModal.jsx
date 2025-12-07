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
    const [filter, setFilter] = useState("all"); // all, pending, approved, rejected

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

    const handleApprove = async (applicationId) => {
        try {
            await onApprove(applicationId);
            setSelectedApplication(null);
        } catch (error) {
            console.error("승인 실패:", error);
            alert("승인에 실패했습니다.");
        }
    };

    const handleReject = async (applicationId) => {
        try {
            await onReject(applicationId);
            setSelectedApplication(null);
        } catch (error) {
            console.error("거절 실패:", error);
            alert("거절에 실패했습니다.");
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { label: "대기중", className: "status-pending" },
            approved: { label: "승인", className: "status-approved" },
            rejected: { label: "거절", className: "status-rejected" },
        };
        return badges[status] || badges.pending;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={selectedApplication ? "신청서 상세보기" : "그룹 신청서 관리"}
            size="large"
        >
            {!selectedApplication ? (
                <div className="application-list-container">
                    {/* Filter Tabs */}
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

                    {/* Applications List */}
                    <div className="applications-list">
                        {filteredApplications.length === 0 ? (
                            <div className="empty-applications">
                                <p>신청서가 없습니다.</p>
                            </div>
                        ) : (
                            filteredApplications.map((application) => {
                                const statusBadge = getStatusBadge(application.status);
                                return (
                                    <div
                                        key={application._id}
                                        className="application-item"
                                        onClick={() => handleViewDetails(application)}
                                    >
                                        <div className="application-header">
                                            <div className="applicant-info">
                                                <div className="applicant-avatar">
                                                    <GoPeople size={24} />
                                                </div>
                                                <div>
                                                    <div className="applicant-name">
                                                        {application.applicantName}
                                                    </div>
                                                    <div className="application-date">
                                                        <GoCalendar size={14} />
                                                        {formatDate(application.submittedAt)}
                                                    </div>
                                                </div>
                                            </div>
                                            <span
                                                className={`status-badge ${statusBadge.className}`}
                                            >
                                                {statusBadge.label}
                                            </span>
                                        </div>
                                        <div className="application-preview">
                                            {Object.entries(application.answers)
                                                .slice(0, 2)
                                                .map(([qId, answer]) => {
                                                    const question = applicationForm.questions.find(
                                                        (q) => q._id === qId
                                                    );
                                                    return question ? (
                                                        <div key={qId} className="answer-preview">
                                                            <span className="answer-question">
                                                                {question.question}:
                                                            </span>
                                                            <span className="answer-text">
                                                                {answer.length > 50
                                                                    ? `${answer.substring(
                                                                          0,
                                                                          50
                                                                      )}...`
                                                                    : answer}
                                                            </span>
                                                        </div>
                                                    ) : null;
                                                })}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            ) : (
                <div className="application-detail-container">
                    {/* Back Button */}
                    <button className="btn btn-secondary btn-sm" onClick={handleBack}>
                        ← 목록으로
                    </button>

                    {/* Applicant Info */}
                    <div className="applicant-detail-card">
                        <div className="applicant-avatar-large">
                            <GoPeople size={48} />
                        </div>
                        <div>
                            <h3>{selectedApplication.applicantName}</h3>
                            <p className="applicant-email">{selectedApplication.applicantEmail}</p>
                            <div className="application-date">
                                <GoCalendar size={14} />
                                신청일: {formatDate(selectedApplication.submittedAt)}
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

                    {/* Answers */}
                    <div className="answers-section">
                        <h4>신청서 답변</h4>
                        {applicationForm.questions.map((question, index) => {
                            const answer = selectedApplication.answers[question._id];
                            return (
                                <div key={question._id} className="answer-item">
                                    <div className="answer-question-label">
                                        {index + 1}. {question.question}
                                        {question.required && (
                                            <span className="required-mark">*</span>
                                        )}
                                    </div>
                                    <div className="answer-content">
                                        {answer || <span className="no-answer">(답변 없음)</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    {selectedApplication.status === "pending" && (
                        <div className="application-actions">
                            <button
                                className="btn btn-outline btn-danger"
                                onClick={() => handleReject(selectedApplication._id)}
                            >
                                <RxCross2 size={20} />
                                거절
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => handleApprove(selectedApplication._id)}
                            >
                                <GoCheck size={20} />
                                승인
                            </button>
                        </div>
                    )}
                </div>
            )}
        </Modal>
    );
};

export default ApplicationListModal;
