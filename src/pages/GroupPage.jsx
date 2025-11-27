import React from "react";
import { useParams } from "react-router-dom";

import Comment from "../components/comment/Comment";

function GroupPage() {
    const { groupId } = useParams();

    return (
        <div>
            GroupPage
            <Comment groupId={groupId} />
        </div>
    );
}

export default GroupPage;
