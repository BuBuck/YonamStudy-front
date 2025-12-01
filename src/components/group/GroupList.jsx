import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GroupList = () => {
    const [groups, setGroups] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const handleGetAllGroups = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/`
                );

                setGroups(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        handleGetAllGroups();
    });

    const onSelectGroup = (group) => {
        navigate(`/study-groups/${group._id}`);
    };

    return (
        <ul style={{ listStyle: "none", padding: 0, display: "grid" }}>
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

export default GroupList;
