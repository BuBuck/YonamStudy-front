import "../../style/chat/ChatList.css";

const formatTime = (isoString) => {
    if (!isoString) return "";

    const date = new Date(isoString);
    const now = new Date();

    // 시간 차이 계산 (밀리초 -> 초 단위로 변환)
    const diffSeconds = (now.getTime() - date.getTime()) / 1000;

    // 1. 1분 미만일 때
    if (diffSeconds < 60) {
        return "1분";
    }

    // 2. 1시간 미만일 때 (분 단위 표시)
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) {
        return `${diffMinutes}분`;
    }

    // 3. 하루(24시간) 미만일 때 (시간 단위 표시)
    const diffHours = Math.floor(diffSeconds / 3600);
    if (diffHours < 24) {
        return `${diffHours}시간`;
    }

    // 4. 하루(24시간) 이상 지났을 때 (날짜 표시)
    // 48시간(2일) 미만이면 "어제"라고 띄우고 싶다면 조건 추가 가능
    if (diffHours < 48) {
        return "어제";
    }

    // 그 외는 날짜로 표시 (11-25)
    return date.toLocaleDateString("ko-KR", {
        month: "2-digit",
        day: "2-digit",
    });
};

function ChatList({ onSelectGroup, groups, user, unreadMap, lastMessageMap }) {
    return (
        <div className="chatList-body">
            {groups.length > 0
                ? groups.map((group) => {
                      const lastInfo = lastMessageMap[group._id] || {};

                      return user.group.length > 0
                          ? user.group.map(
                                (userGroup) =>
                                    userGroup === group._id && (
                                        <div
                                            className="chatList-main"
                                            role="button"
                                            tabIndex={0}
                                            key={group._id}
                                            onClick={() => onSelectGroup(group)}
                                        >
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <img
                                                    className="group-img"
                                                    src={
                                                        group.groupImage
                                                            ? group.groupImage
                                                            : "/profile.png"
                                                    }
                                                    alt="그룹 이미지"
                                                />
                                                <div className="group-title">
                                                    <div
                                                        style={{
                                                            margin: "0px 0px 8px 0px",
                                                            color: "#F5F5F5",
                                                            fontSize: "14px",
                                                            fontWeight:
                                                                unreadMap[group._id] > 0
                                                                    ? 600
                                                                    : 400,
                                                        }}
                                                    >
                                                        {group.group}
                                                    </div>

                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "row",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                margin: "0px 0px 4px 0px",
                                                                color:
                                                                    unreadMap[group._id] > 0
                                                                        ? "#F5F5F5"
                                                                        : "#A8A8A8",
                                                                fontSize: "12px",
                                                                fontWeight:
                                                                    unreadMap[group._id] > 0
                                                                        ? 700
                                                                        : 400,
                                                            }}
                                                        >
                                                            {(lastInfo.isMe && "나: ",
                                                            lastInfo.message) ||
                                                                "대화 내용이 없습니다."}
                                                        </div>
                                                        <div
                                                            style={{
                                                                width: "2px",
                                                                height: "2px",

                                                                margin: "0px 4px 4px 4px",

                                                                fontSize: "14px",

                                                                borderRadius: "50%",
                                                                backgroundColor: "#A8A8A8",
                                                            }}
                                                        />
                                                        <div
                                                            style={{
                                                                margin: "0px 0px 4px 0px",
                                                                color: "#A8A8A8",
                                                                fontSize: "12px",
                                                                fontWeight: 400,
                                                            }}
                                                        >
                                                            {formatTime(lastInfo.time)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {unreadMap[group._id] > 0 && (
                                                <div className="unreadDot">
                                                    <div
                                                        style={{
                                                            marginRight: "8px",
                                                            width: "8px",
                                                            height: "8px",
                                                            backgroundColor: "rgb(0, 149, 246)",
                                                            borderRadius: "50%",
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )
                            )
                          : null;
                  })
                : null}
        </div>
    );
}

export default ChatList;
