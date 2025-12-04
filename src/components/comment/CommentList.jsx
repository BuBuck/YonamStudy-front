import React, { useState } from "react";

import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");

import styles from "../../styles/components/Comment.module.css";

function CommentList({ user, group, comments, onEditComment, onDeleteComment }) {
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [newContent, setNewContent] = useState("");

    const handleEditClick = (commentId) => {
        setEditingCommentId(commentId);
    };

    const handleCancel = () => {
        setEditingCommentId(null);
    };

    return (
        <ul className={styles.commentUl}>
            {comments.map((comment) => (
                <li key={comment._id}>
                    {editingCommentId === comment._id ? (
                        // 수정 모드일 때
                        <div style={{ display: "flex", gap: "5px" }}>
                            <img
                                className={styles.commentImage}
                                src={`${import.meta.env.VITE_BACKEND_URL}${
                                    comment.commenter.userProfile
                                }`}
                            />
                            <input
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                            />
                            <button
                                onClick={() => {
                                    onEditComment(comment._id, newContent);
                                    handleCancel();
                                }}
                            >
                                저장
                            </button>
                            <button
                                onClick={() => {
                                    handleCancel();
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
                                <img
                                    className={styles.commentImage}
                                    src={`${import.meta.env.VITE_BACKEND_URL}${
                                        comment.commenter.userProfile
                                    }`}
                                />
                                <div>
                                    <h3>{comment.content}</h3>
                                    <div>
                                        {`${comment.commenter.major} ${
                                            user?.userId === comment.commenter?._id ||
                                            user?.userId === group.groupLeader
                                                ? comment.commenter.name
                                                : comment.commenter.name[0] +
                                                  "*".repeat(comment.commenter.name.length - 1)
                                        }`}
                                    </div>
                                    <div style={{ color: "lightgrey" }}>
                                        {`${
                                            comment.createdAt === comment.updatedAt
                                                ? dayjs(comment.createdAt).format(
                                                      "YYYY. MM. DD. HH:mm"
                                                  )
                                                : dayjs(comment.updatedAt).format(
                                                      "YYYY. MM. DD. HH:mm"
                                                  ) + " (수정됨)"
                                        }`}
                                    </div>
                                </div>

                                {user?.userId === comment.commenter?._id ? (
                                    <div>
                                        <button
                                            onClick={() => {
                                                handleEditClick(comment._id);
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
