import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = ({ size = "medium", message = "로딩 중..." }) => {
    return (
        <div className="loading-spinner-container">
            <div className={`loading-spinner ${size}`}>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
            </div>
            {message && <p className="loading-message">{message}</p>}
        </div>
    );
};

export default LoadingSpinner;
