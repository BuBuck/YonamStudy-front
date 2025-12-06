import React from "react";

function CommentUpdateForm({ value, onChange, onSubmit, onCancel, user }) {
    return (
        <div className="comment-write">
            <div className="comment-avatar">
                <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${user.userProfile}`}
                    className="comment-avatar"
                />
            </div>
            <div className="comment-input-wrapper">
                <textarea
                    className="comment-input"
                    placeholder="댓글을 입력하세요..."
                    rows="3"
                    value={value}
                    onChange={onChange}
                />
                <button className="btn btn-outline comment-submit" onClick={onCancel}>
                    취소
                </button>
                <button className="btn btn-primary comment-submit" onClick={onSubmit}>
                    저장
                </button>
            </div>
        </div>
    );
}

export default CommentUpdateForm;
