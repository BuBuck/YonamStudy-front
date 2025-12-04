import React from "react";
import "./Loading.css";

const Loading = ({ message = "잠시만 기다려주세요..." }) => {
    return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">{message}</p>
        </div>
    );
};

export default Loading;
