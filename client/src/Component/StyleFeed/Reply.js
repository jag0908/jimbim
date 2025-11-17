import React from "react";
import { useNavigate } from "react-router-dom";

const Reply = ({ reply, myUserid, handleDeleteReply, setReplyParent }) => {
  const navigate = useNavigate();
  const replyDate = reply.indate ? new Date(reply.indate).toLocaleString() : "시간 없음";
  const isMyComment = reply.userid === myUserid;

  return (
    <div className="style-reply">
      <div className="style-reply-header">
        <div className="style-reply-left" onClick={() => navigate(`/styleUser/${reply.userid}`)}>
          <img src={reply.profileImg || "/default_profile.png"} alt={reply.userid} className="style-reply-profile" />
          <strong>{reply.userid}</strong>
        </div>
        <div className="style-reply-right">
          <span className="style-reply-date">{replyDate}</span>
          {isMyComment && <button onClick={() => handleDeleteReply(reply.reply_id)}>삭제</button>}
          <button onClick={() => setReplyParent(reply.reply_id)}>답글</button>
        </div>
      </div>
      <div className="style-reply-content">{reply.content}</div>

      {/* 대댓글 렌더링 */}
      <div className="style-reply-children">
        {reply.children?.map(child => (
          <Reply
            key={child.reply_id}
            reply={child}
            myUserid={myUserid}
            handleDeleteReply={handleDeleteReply}
            setReplyParent={setReplyParent}
          />
        ))}
      </div>
    </div>
  );
};

export default Reply;