import "../../style/chat/ChatList.css";

const formatTime = (isoString) => {
    if (!isoString) return "";

    const date = new Date(isoString);
    const now = new Date();

    const diffSeconds = (now.getTime() - date.getTime()) / 1000;

    if (diffSeconds < 60) {
        return "1분";
    }

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) {
        return `${diffMinutes}분`;
    }

    const diffHours = Math.floor(diffSeconds / 3600);
    if (diffHours < 24) {
        return `${diffHours}시간`;
    }

    if (diffHours < 48) {
        return "어제";
    }

    return date.toLocaleDateString("ko-KR", {
        month: "2-digit",
        day: "2-digit",
    });
};

function ChatList({ onSelectGroup, groups, user, unreadMap, lastMessageMap, currentGroupId }) {
    return (
        <div className="chatList-body">
            {groups.length > 0
                ? groups.map((group) => {
                      const lastInfo = lastMessageMap[group._id] || {};

                      const isSelected = currentGroupId === group._id;

                      return user.group.length > 0
                          ? user.group.map(
                                (userGroup) =>
                                    userGroup === group._id && (
                                        <div
                                            className="chatList-main"
                                            role="button"
                                            tabIndex={0}
                                            key={group._id}
                                            onClick={() => {
                                                onSelectGroup(group);
                                            }}
                                            style={
                                                isSelected
                                                    ? {
                                                          backgroundColor: "#222",
                                                          pointerEvents: "none",
                                                          cursor: "default",
                                                      }
                                                    : {}
                                            }
                                        >
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <img
                                                    className="group-img"
                                                    src={`${import.meta.env.VITE_BACKEND_URL}${
                                                        group.groupImage
                                                    }`}
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
