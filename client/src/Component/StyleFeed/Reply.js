import React from "react";
import { useNavigate } from "react-router-dom";
import jaxios from '../../util/jwtutil';

const baseURL = process.env.REACT_APP_BASE_URL;

const Reply = ({
    reply,
    myUserid,
    toggleReplyVisibility,
    isOpen = false, // undefined 방지
    openReplies,
    setReplyParent,
    handleDeleteReply,
    setReplies
  }) => {
    const navigate = useNavigate();
    const replyDate = reply.indate ? new Date(reply.indate).toLocaleString() : "시간 없음";
    const isMyComment = reply.userid === myUserid;

    const handleToggle = () => {
      toggleReplyVisibility(reply.reply_id);
    };

  const handleReplyLike = async (replyId) => {
    try {
      const res = await jaxios.post(`${baseURL}/style/reply/like/${replyId}`);
      const { liked, likeCount } = res.data;

      // 트리에서 댓글 찾아서 갱신
      const updateLike = (list) => {
        return list.map(r => {
          if (r.reply_id === replyId) return { ...r, liked, likeCount };
          if (r.children && r.children.length > 0) {
            return { ...r, children: updateLike(r.children) };
          }
          return r;
        });
      };

      setReplies(prev => updateLike(prev));
    } catch (err) {
      console.error(err);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
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
          <div className="style-detail-reply-actions">
            <button onClick={() => handleReplyLike(reply.reply_id)}>
              {reply.liked ? "❤️" : "🤍"} {reply.likeCount || 0}
            </button>
          </div>
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
              setReplies={setReplies}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Reply;
