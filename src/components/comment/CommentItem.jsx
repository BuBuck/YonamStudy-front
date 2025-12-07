import React, { useState } from "react";

import { formatTime } from "../../utils/timeUtils";
import CommentUpdateForm from "./CommentUpdateForm";

import { IoEllipsisVertical } from "react-icons/io5";

function CommentItem({ comment, user = null, onUpdate, onDelete, isOpen, onToggleMenu }) {
    const [editContent, setEditContent] = useState(comment.content);
    const [isEditing, setIsEditing] = useState(false);

    if (comment.isDeleted) {
        return (
            <div className="comment-item">
                <div className="comment-avatar">
                    <img
                        src={`${
                            import.meta.env.VITE_BACKEND_URL
                        }/uploads/study-groups/default-groupIgame`}
                        className="comment-avatar"
                    />
                </div>
                <div className="comment-content-wrapper">
                    <div className="comment-header">
                        <div className="comment-author">
                            <span className="author-name">(삭제)</span>
                        </div>
                    </div>
                    <div className="comment-content">삭제된 댓글입니다.</div>
                </div>
            </div>
        );
    }

    return !isEditing ? (
        <div className="comment-item">
            <div className="comment-avatar">
                <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${comment.commenter?.userProfile}`}
                    className="comment-avatar"
                />
            </div>
            <div className="comment-content-wrapper">
                <div className="comment-header">
                    <div className="comment-author">
                        <span className="author-name">{comment.commenter?.name}</span>
                        <span className="author-department">{comment.commenter?.major}</span>
                    </div>
                    <span className="comment-timestamp">{`${
                        comment.createdAt === comment.updatedAt
                            ? formatTime(comment.createdAt)
                            : formatTime(comment.createdAt) + " (수정됨)"
                    }`}</span>
                </div>
                <div className="comment-content">{comment.content}</div>
            </div>

            <div className="comment-actions">
                <div
                    className="toggle-menu"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleMenu();
                    }}
                >
                    <IoEllipsisVertical style={{ cursor: "pointer" }} />
                    {isOpen &&
                        (comment.commenter?._id === user?.userId ||
                        comment.group?.groupLeader === user?.userId ? (
                            <div className="toggle-menu-list">
                                {comment.commenter?._id === user?.userId && (
                                    <div
                                        className="toggle-item update"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsEditing(true);
                                            setEditContent(comment.content);
                                            onToggleMenu(false);
                                        }}
                                    >
                                        수정
                                    </div>
                                )}
                                <div
                                    className="toggle-item delete"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm("정말 삭제하시겠습니까?")) {
                                            onDelete(comment._id, user?.userId);
                                        }
                                        onToggleMenu(false);
                                    }}
                                >
                                    삭제
                                </div>
                            </div>
                        ) : (
                            <div className="toggle-menu-list">
                                <div
                                    title="그런게 있겠냐?"
                                    className="toggle-item"
                                    onClick={() => onToggleMenu(false)}
                                >
                                    신고
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    ) : (
        <CommentUpdateForm
            onSubmit={() => {
                onUpdate(comment._id, editContent);
                setIsEditing(false);
            }}
            onCancel={() => {
                setIsEditing(false);
                setEditContent(comment.content);
            }}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            user={user}
        />
    );
}

export default CommentItem;
