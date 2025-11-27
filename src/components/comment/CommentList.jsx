import React from "react";

import CommentItem from "./CommentItem";

function CommentList({ comments, onEdit, onDelete }) {
    return (
        <ul>
            {comments.map((comment) => (
                <CommentItem
                    key={comment._id}
                    comment={comment}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
}

export default CommentList;
