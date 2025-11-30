import React from "react";

const DEFAULT_IMAGE = "/default.png"; // public 폴더에 기본 이미지 파일을 넣어주세요

const GroupList = ({ groups, onSelectGroup }) => {
    return (
        <ul style={{ listStyle: "none", padding: 0 }}>
            {groups.map((group) => {
                const imageSrc = group.imageUrl || DEFAULT_IMAGE;

                return (
                    <li
                        key={group.id}
                        onClick={() => onSelectGroup(group)}
                        style={{
                            cursor: "pointer",
                            marginBottom: "10px",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <img
                            src={`${import.meta.env.VITE_BACKEND_URL}${imageSrc}`}
                            alt={`${group.name} 썸네일`}
                            style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "4px",
                                marginRight: "8px",
                                border: "1px solid #ccc",
                            }}
                        />
                        <span>{group.name}</span>
                    </li>
                );
            })}
        </ul>
    );
};

export default GroupList;
