import React from "react";

import "../../style/chat/MessageContainer.css";

const MessageContainer = ({ messageList, user }) => {
    return (
        <div>
            {messageList.map((message, index) => {
                return (
                    <div key={message._id} className="message-container">
                        {message.sender.name === "system" ? (
                            <div className="system-message-container">
                                <p className="system-message">{message.message}</p>
                            </div>
                        ) : message.sender.name === user.name ? (
                            <div className="my-message-container">
                                <div
                                    className="my-message"
                                    style={{
                                        borderBottomRightRadius: "4px",
                                    }}
                                >
                                    <div>{message.message}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="your-message-container">
                                <div className="profile-image">
                                    <img
                                        src="/profile.png"
                                        style={
                                            (index === 0
                                                ? { visibility: "visible" }
                                                : messageList[index - 1].sender.name ===
                                                  user.name) ||
                                            messageList[index - 1].sender.name === "system"
                                                ? { visibility: "visible" }
                                                : { visibility: "hidden" }
                                        }
                                    />
                                </div>
                                <div
                                    className="your-message"
                                    style={{ borderBottomLeftRadius: "4px" }}
                                >
                                    <div>{message.message}</div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default MessageContainer;
