import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

import StudyGroupCard from "../../components/StudyGroupCard/StudyGroupCard";

import "./SearchPage.css";

const difficulties = ["전체", "초급", "중급", "고급"];

const SearchPage = () => {
    const [searchParams] = useSearchParams();

    // 카테고리 State 삭제됨
    const [selectedDifficulty, setSelectedDifficulty] = useState("전체");
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

    const [groups, setGroups] = useState([]); // 초기값을 빈 배열로 설정

    useEffect(() => {
        const handleGetAllGroups = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/`
                );
                setGroups(res.data);
            } catch (error) {
                console.error("그룹 목록 불러오기 실패", error);
            }
        };

        handleGetAllGroups();
    }, []);

    // 필터링 로직
    const filteredGroups = groups.filter((group) => {
        // 1. 난이도 체크
        const matchesDifficulty =
            selectedDifficulty === "전체" || group.difficulty === selectedDifficulty;

        // 2. 검색어 체크 (제목, 설명, 태그)
        const lowerQuery = searchQuery.toLowerCase();
        const matchesSearch =
            !searchQuery ||
            group.group.toLowerCase().includes(lowerQuery) ||
            group.description.toLowerCase().includes(lowerQuery) ||
            group.tags.some((tag) => tag.toLowerCase().includes(lowerQuery));

        return matchesDifficulty && matchesSearch;
    });

    return (
        <div className="search-page">
            <div className="search-hero">
                <div className="container">
                    <h1>스터디 그룹 찾기</h1>
                    <p>총 {filteredGroups.length}개의 스터디 그룹</p>
                </div>
            </div>

            <div className="container">
                <div className="search-layout">
                    <aside className="search-sidebar">
                        {/* 난이도 필터 섹션 */}
                        <div className="filter-section">
                            <h3 className="filter-title">난이도</h3>
                            <div className="filter-options">
                                {difficulties.map((difficulty) => (
                                    <button
                                        key={difficulty}
                                        className={`filter-button ${
                                            selectedDifficulty === difficulty ? "active" : ""
                                        }`}
                                        onClick={() => setSelectedDifficulty(difficulty)}
                                    >
                                        {difficulty}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    <main className="search-content">
                        {filteredGroups.length > 0 ? (
                            <div className="results-grid">
                                {filteredGroups.map((group) => (
                                    <StudyGroupCard key={group._id} group={group} />
                                ))}
                            </div>
                        ) : (
                            <div className="no-results">
                                <div className="no-results-icon">🔍</div>
                                <h3>검색 결과가 없습니다</h3>
                                <p>다른 검색어나 난이도 필터를 변경해보세요</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
