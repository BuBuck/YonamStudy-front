import React, { useState } from "react";

function CommentItem({ comment, onEdit, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [newContent, setNewContent] = useState(comment.content || "");

    const user = JSON.parse(localStorage.getItem("user"));

    const handleSave = () => {
        onEdit(comment._id, newContent);
        setIsEditing(false);
    };

    const writerId = comment.commenter?._id || comment.commenter;

    return (
        <li>
            {isEditing ? (
                // 수정 모드일 때
                <div style={{ display: "flex", gap: "5px" }}>
                    <input value={newContent} onChange={(e) => setNewContent(e.target.value)} />
                    <button onClick={handleSave}>저장</button>
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setNewContent(comment.content);
                        }}
                    >
                        취소
                    </button>
                </div>
            ) : (
                // 일반 모드일 때
                <div style={{ display: "flex", gap: "5px" }}>
                    <span>{comment.content}</span>
                    {user?.userId === writerId ? (
                        <div>
                            <button
                                onClick={() => {
                                    setIsEditing(true);
                                }}
                            >
                                수정
                            </button>
                            <button onClick={() => onDelete(comment._id)}>삭제</button>
                        </div>
                    ) : null}
                </div>
            )}
            <hr />
        </li>
    );
}

export default CommentItem;
