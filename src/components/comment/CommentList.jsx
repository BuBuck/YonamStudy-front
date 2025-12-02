import React, { useState } from "react";

function CommentList({ user, comments, onEditComment, onDeleteComment }) {
    const [isEditing, setIsEditing] = useState(false);
    const [newContent, setNewContent] = useState("");

    return (
        <ul>
            {comments.map((comment) => (
                <li key={comment._id}>
                    {isEditing ? (
                        // 수정 모드일 때
                        <div style={{ display: "flex", gap: "5px" }}>
                            <input
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                            />
                            <button
                                onClick={() => {
                                    onEditComment(comment._id, newContent);
                                    setIsEditing(false);
                                }}
                            >
                                저장
                            </button>
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
                        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div>
                                    {comment.content}
                                    <div>
                                        {`${comment.commenter.major} ${comment.commenter.name}`}
                                    </div>
                                </div>
                                {user?.userId === comment.commenter?._id ? (
                                    <div>
                                        <button
                                            onClick={() => {
                                                setIsEditing(true);
                                                setNewContent(comment.content);
                                            }}
                                        >
                                            수정
                                        </button>
                                        <button onClick={() => onDeleteComment(comment._id)}>
                                            삭제
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
}

export default CommentList;
