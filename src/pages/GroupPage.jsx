import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Comment from "../components/comment/Comment";
import GroupInfo from "../components/group/GroupInfo";

function GroupPage() {
    const { groupId } = useParams();

    const [group, setGroup] = useState({});

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const handleGetGroupData = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/${groupId}`
                );

                setGroup(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        handleGetGroupData();
    }, []);

    return (
        <div>
            <GroupInfo
                groupId={groupId}
                group={group}
                user={user}
                onUpdateGroup={(group) => setGroup(group)}
            />
            <hr />
            <div>
                <Comment groupId={groupId} group={group} user={user} />
            </div>
        </div>
    );
}

export default GroupPage;
