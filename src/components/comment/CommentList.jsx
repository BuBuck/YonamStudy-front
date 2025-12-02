import React, { useState } from "react";

import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");

function CommentList({ user, group, comments, onEditComment, onDeleteComment }) {
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
