import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import Comment from "../components/comment/Comment";
import GroupList from "../components/group/GroupList";

function GroupPage() {
    const { groupId } = useParams();

    useEffect(() => {}, []);

    return (
        <div>
            <h1>GroupPage</h1>
            {/* <GroupList /> */}
            <hr />
            <Comment groupId={groupId} />
        </div>
    );
}

export default GroupPage;
