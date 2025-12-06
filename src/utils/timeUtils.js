export const formatTime = (isoString) => {
    if (!isoString) return "";

    const date = new Date(isoString);
    const now = new Date();

    const diffSeconds = (now.getTime() - date.getTime()) / 1000;

    if (diffSeconds < 60) {
        return "방금 전";
    }

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) {
        return `${diffMinutes}분 전`;
    }

    const diffHours = Math.floor(diffSeconds / 3600);
    if (diffHours < 24) {
        return `${diffHours}시간 전`;
    }

    if (diffHours < 48) {
        return "어제";
    }

    return date.toLocaleDateString("ko-KR", {
        month: "2-digit",
        day: "2-digit",
    });
};
