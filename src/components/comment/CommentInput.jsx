import React, { useState } from "react";

// 댓글 입력 컴포넌트
function CommentInput({ user, onAddComment }) {
    // 입력창에 적은 글을 저장하는 상태
    const [content, setContent] = useState("");

    // 폼 제출(등록 버튼 클릭) 시 실행되는 함수
    const handleSubmit = (e) => {
        e.preventDefault(); // 새로고침 방지
        if (content.trim()) {
            // 입력값이 비어있지 않으면
            // 여기 백엔드 기능
            onAddComment(content); // 부모(Section)에게 댓글 추가 요청
            setContent(""); // 입력창 비우기
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* 댓글 입력창 */}
            <img
                src={`${import.meta.env.VITE_BACKEND_URL}${user.userProfile}`}
                style={{ width: "100px", height: "100px" }}
            />
            <input
                type="text"
                value={content} // 입력값을 상태와 연결
                onChange={(e) => setContent(e.target.value)} // 입력할 때마다 상태 업데이트
                placeholder="댓글을 입력하세요"
            />
            {/* 등록 버튼 */}
            <button type="submit">등록</button>
        </form>
    );
}

export default CommentInput;
