import React from "react";
import { useNavigate } from "react-router-dom";

const MyGroupList = ({ groups }) => {
    const navigate = useNavigate();

    const onSelectGroup = (group) => {
        navigate(`/study-groups/${group._id}`);
    };

    return (
        <ul style={{ listStyle: "none", padding: 0 }}>
            {groups.map((group) => {
                return (
                    <li
                        key={group._id}
                        onClick={() => onSelectGroup(group)}
                        style={{
                            cursor: "pointer",
                            marginBottom: "10px",
                            display: "inline-flex",
                            flexDirection: "column",
                        }}
                    >
                        <img
                            src={`${import.meta.env.VITE_BACKEND_URL}${group.groupImage}`}
                            alt={`${group.group} 썸네일`}
                            style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "50%",
                                border: "1px solid #ccc",
                            }}
                        />
                        <span>{group.group}</span>
                    </li>
                );
            })}
        </ul>
    );
};

export default MyGroupList;
