import React from "react";

function CommentForm({ value, onChange, onSubmit, placeholder = "댓글을 입력하세요...", user }) {
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
                    placeholder={placeholder}
                    rows="3"
                    value={value}
                    onChange={onChange}
                />
                <button className="btn btn-primary comment-submit" onClick={onSubmit}>
                    댓글 작성
                </button>
            </div>
        </div>
    );
}

export default CommentForm;
