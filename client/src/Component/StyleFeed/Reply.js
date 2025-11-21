import React from "react";
import { useNavigate } from "react-router-dom";

const Reply = ({
  reply,
  myUserid,
  toggleReplyVisibility,
  isOpen = false, // undefined 방지
  openReplies,
  setReplyParent,
  handleDeleteReply
}) => {
  const navigate = useNavigate();
  const replyDate = reply.indate ? new Date(reply.indate).toLocaleString() : "시간 없음";
  const isMyComment = reply.userid === myUserid;

  const handleToggle = () => {
    toggleReplyVisibility(reply.reply_id);
  };

  return (
    <div className="style-detail-reply">
      {/* 댓글 헤더 */}
      <div className="style-detail-reply-header">
        <div className="style-detail-reply-left" onClick={() => navigate(`/styleUser/${reply.userid}`)}>
          <img
            src={reply.profileImg || "/default_profile.png"}
            alt={reply.userid}
            className="style-detail-reply-profile"
          />
          <strong>{reply.userid}</strong>
        </div>

        <div className="style-detail-reply-right">
          <span className="style-detail-reply-date">{replyDate}</span>
          {isMyComment && (
            <button
              className="style-detail-delete-reply-btn"
              onClick={() => handleDeleteReply(reply.reply_id)}
            >
              삭제
            </button>
          )}
          <button onClick={() => setReplyParent(reply.reply_id)}>답글</button>
        </div>
      </div>

      {/* 댓글 내용 */}
      <div className="style-detail-reply-content">{reply.content}</div>

      {/* 대댓글 토글 버튼 */}
      {reply.children?.length > 0 && (
        <button className="reply-toggle-btn" onClick={handleToggle}>
          {isOpen ? "답글 숨기기" : `답글 ${reply.children.length}개`}
        </button>
      )}

      {/* 대댓글 렌더링 */}
      {isOpen && reply.children?.length > 0 && (
        <div className="style-detail-reply-children">
          {reply.children.map((child) => (
            <Reply
              key={child.reply_id}
              reply={child}
              myUserid={myUserid}
              toggleReplyVisibility={toggleReplyVisibility}
              isOpen={openReplies[child.reply_id] || false} // undefined 방지
              openReplies={openReplies}
              setReplyParent={setReplyParent}
              handleDeleteReply={handleDeleteReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Reply;
