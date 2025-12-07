import React from "react";
import { Link } from "react-router-dom";

import { GoPeople } from "react-icons/go";
import { GoCalendar } from "react-icons/go";

import "./StudyGroupCard.css";

const StudyGroupCard = ({ group }) => {
    const memberPercentage =
        ((group.groupMembers.length < 1 ? 1 : group.groupMembers.length) / group.maxMembers) * 100;

    return (
        <Link to={`/study-groups/${group._id}`} className="study-group-card">
            <div className="card-badge-container">
                <span className={`difficulty-badge difficulty-${group.difficulty}`}>
                    {group.difficulty}
                </span>
            </div>

            <h3 className="card-title">{group.group}</h3>
            <p className="card-description">{group.description}</p>

            <div className="card-tags">
                {group.tags.map((tag, index) => (
                    <span key={index} className="tag">
                        #{tag}
                    </span>
                ))}
            </div>

            <div className="card-info">
                <div className="info-item">
                    <GoPeople size={16} stroke="currentColor" />
                    <span>
                        {group.groupMembers.length < 1 ? 1 : group.groupMembers.length} /{" "}
                        {group.maxMembers} 명
                    </span>
                </div>
                <div className="info-item">
                    <GoCalendar size={16} stroke="currentColor" />
                    <span>
                        {`주 ${group.schedule?.weeks.length}회 (${group.schedule?.weeks
                            .toString()
                            .replaceAll(",", "/")} 
                                            ${group.schedule?.time})`}
                    </span>
                </div>
            </div>

            <div className="members-progress">
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${memberPercentage}%` }}></div>
                </div>
                <p className="progress-text">{memberPercentage >= 80 ? "곧 마감" : "모집 중"}</p>
            </div>
        </Link>
    );
};

export default StudyGroupCard;
