import React, { useEffect, useState } from "react";
import axios from "axios";

import CommentInput from "./CommentInput"; // 댓글 입력 컴포넌트
import CommentList from "./CommentList"; // 댓글 목록 컴포넌트

function Comment({ groupId }) {
    // 댓글들을 저장하는 상태 (배열)
    const [comments, setComments] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!groupId) return;

        const fetchHistory = async () => {
            const res = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/group/${groupId}/comments`
            );
            setComments(res.data);
        };

        fetchHistory();
    }, []);

    // 댓글 추가 함수
    const handleAddComment = async (content) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/group/${groupId}/comments`,
                { content: content, userId: user.userId }
            );
            setComments([...comments, res.data]);

            alert("댓글이 등록되었습니다.");
        } catch (error) {
            console.error("댓글 등록 실패", error);
        }
    };

    // 댓글 수정 함수
    const handleEditComment = async (commentId, content) => {
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/group/${groupId}/${commentId}`,
                { content: content },
                {
                    params: {
                        userId: user.userId,
                    },
                }
            );
            setComments((prevComments) =>
                prevComments.map((comment) => (comment._id === commentId ? res.data : comment))
            );
        } catch (error) {
            console.error("댓글 수정 실패", error);
        }
    };

    // 댓글 삭제 함수
    const handleDeleteComment = async (commentId) => {
        try {
            const res = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/group/${groupId}/${commentId}`,
                {
                    params: {
                        userId: user.userId,
                    },
                }
            );

            setComments((prevComments) =>
                prevComments.filter((comment) => comment._id !== commentId)
            );

            alert(res.data.message);
        } catch (error) {
            console.error("댓글 삭제 실패", error);
        }
    };

    return (
        <div>
            {/* 댓글 입력창 */}
            <CommentInput onAddComment={handleAddComment} />
            {/* 댓글 목록 (수정/삭제 기능 포함) */}
            <CommentList
                comments={comments}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
            />
        </div>
    );
}

export default Comment;
