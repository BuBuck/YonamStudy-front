import React, { useState, useEffect, useCallback } from "react";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import "./HeroCarousel.css";

const HeroCarousel = () => {
    const images = [
        {
            url: "https://images.unsplash.com/photo-1589872880544-76e896b0592c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwdG9nZXRoZXIlMjBsaWJyYXJ5fGVufDF8fHx8MTc2NTEyNDU1OXww&ixlib=rb-4.1.0&q=80&w=1080",
            alt: "도서관에서 함께 공부하는 학생들",
        },
        {
            url: "https://images.unsplash.com/photo-1758270705482-cee87ea98738?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwc3R1ZHklMjBncm91cCUyMGNvbGxhYm9yYXRpb258ZW58MXx8fHwxNzY1MTI0NTU5fDA&ixlib=rb-4.1.0&q=80&w=1080",
            alt: "협업하는 대학생 그룹",
        },
        {
            url: "https://images.unsplash.com/photo-1758270705518-b61b40527e76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtd29yayUyMGxlYXJuaW5nJTIwdW5pdmVyc2l0eXxlbnwxfHx8fDE3NjUxMjQ1NjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
            alt: "대학에서 함께 학습하는 팀",
        },
        {
            url: "https://images.unsplash.com/photo-1695066964145-245927509533?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGxhcHRvcCUyMGNvZGluZyUyMHRvZ2V0aGVyfGVufDF8fHx8MTc2NTEyNDU2MHww&ixlib=rb-4.1.0&q=80&w=1080",
            alt: "노트북으로 코딩하는 학생들",
        },
        {
            url: "https://images.unsplash.com/photo-1758270704247-632bd4f7301e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc3Jvb20lMjBzdHVkeSUyMHNlc3Npb258ZW58MXx8fHwxNzY1MTI0NTYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
            alt: "교실에서의 스터디 세션",
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // 다음 슬라이드로 이동
    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, [images.length]);

    // 이전 슬라이드로 이동
    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    // 특정 슬라이드로 이동
    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    // 자동 재생
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 5000); // 5초마다 자동 전환

        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide]);

    // 마우스 호버 시 자동 재생 일시정지
    const handleMouseEnter = () => {
        setIsAutoPlaying(false);
    };

    const handleMouseLeave = () => {
        setIsAutoPlaying(true);
    };

    return (
        <div
            className="hero-carousel"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* 이미지 슬라이드 */}
            <div className="carousel-slides">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`carousel-slide ${index === currentIndex ? "active" : ""}`}
                        style={{
                            backgroundImage: `url(${image.url})`,
                        }}
                    >
                        <img src={image.url} alt={image.alt} style={{ display: "none" }} />
                    </div>
                ))}
            </div>

            {/* 이전 버튼 */}
            <button
                className="carousel-button carousel-button-prev"
                onClick={prevSlide}
                aria-label="이전 슬라이드"
            >
                <GoChevronLeft size={28} />
            </button>

            {/* 다음 버튼 */}
            <button
                className="carousel-button carousel-button-next"
                onClick={nextSlide}
                aria-label="다음 슬라이드"
            >
                <GoChevronRight size={28} />
            </button>

            {/* 인디케이터 (점) */}
            <div className="carousel-indicators">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`carousel-indicator ${index === currentIndex ? "active" : ""}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`슬라이드 ${index + 1}로 이동`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;
