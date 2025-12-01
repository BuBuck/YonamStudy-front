import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Comment from "../components/comment/Comment";

function GroupPage() {
    const { groupId } = useParams();

    const [group, setGroup] = useState({});

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const handleGetGroupData = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/study-groups/${groupId}`,
                    { userId: user.userId || user._id }
                );

                setGroup(res.data);
                console.log(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        handleGetGroupData();
    }, []);

    return (
        <div>
            <div>
                <div>{group?.group}</div>
                <button>그룹 제거</button>
            </div>

            <hr />
            <Comment groupId={groupId} />
        </div>
    );
}

export default GroupPage;
