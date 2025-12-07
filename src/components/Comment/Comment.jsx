import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

import { GoComment } from "react-icons/go";

import "./Comment.css";

function Comment({ groupId, user }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    const [activeMenuId, setActiveMenuId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!groupId) return;

        const fetchHistory = async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/${groupId}/comments`
            );
            setComments(res.data.comments);
        };

        fetchHistory();
    }, []);

    // 댓글 수정 함수
    const handleUpdateComment = async (commentId, content) => {
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/${groupId}/${commentId}`,
                { content: content, userId: user.userId }
            );

            setComments((prev) =>
                prev.map((comment) =>
                    comment._id === commentId ? res.data.updatedComment : comment
                )
            );

            alert(res.data.message);
        } catch (error) {
            console.error("댓글 수정 실패", error);
        }
    };

    // 댓글 삭제 함수
    const handleDeleteComment = async (commentId, userId) => {
        try {
            const res = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/${groupId}/${commentId}`,
                {
                    data: {
                        userId: userId,
                    },
                }
            );

            setComments((prev) =>
                prev.map((comment) =>
                    comment._id === commentId ? res.data.deletedComment : comment
                )
            );

            alert(res.data.message);
        } catch (error) {
            console.error("댓글 삭제 실패", error);
        }
    };

    const handlePostComment = async () => {
        if (!newComment.trim()) return;

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/${groupId}/comments`,
                { userId: user.userId, content: newComment }
            );

            alert(res.data.message);
            setComments([res.data.newComment, ...comments]);
            setNewComment("");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <section className="comment-section">
            <h2>댓글 ({comments.length})</h2>

            {/* 메인 댓글 작성 폼 */}
            {user ? (
                <CommentForm
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onSubmit={handlePostComment}
                    user={user}
                />
            ) : (
                <div className="comment-login-prompt">
                    <p>댓글을 작성하려면 로그인이 필요합니다.</p>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate("/auth/login")}
                    >
                        로그인하기
                    </button>
                </div>
            )}

            {/* 댓글 목록 */}
            <div className="comments-list">
                {comments.length === 0 ? (
                    <div className="no-comments">
                        <GoComment size={48} />
                        <p>아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            user={user}
                            onUpdate={handleUpdateComment}
                            onDelete={handleDeleteComment}
                            isOpen={activeMenuId === comment._id}
                            onToggleMenu={() =>
                                setActiveMenuId((prev) =>
                                    prev === comment._id ? null : comment._id
                                )
                            }
                        />
                    ))
                )}
            </div>
        </section>
    );
}

export default Comment;
