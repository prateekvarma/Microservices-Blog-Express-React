import React from "react";

const CommentList = ({ comments }) => {

  const renderedComments = comments.map((comment) => {
    let content;

    if(comment.status === 'approved') {
      content = comment.content;
    }
  
    if(comment.status === 'pending') {
      content = 'This comment is pending moderation!';
    }
  
    if(comment.status === 'rejected') {
      content = 'This comment had been rejected by moderation!'
    }
    return <li key={comment.id}>{content}</li>
  })

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
