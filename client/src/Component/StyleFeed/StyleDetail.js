import React, { useEffect, useState } from "react";
import jaxios from '../../util/jwtutil';
import { useParams } from "react-router-dom";
import "../../style/StyleDetail.css";
import { useSelector } from 'react-redux';

const baseURL = process.env.REACT_APP_BASE_URL;


const StyleDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState("");
  const [replies, setReplies] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const currentUser = useSelector((state) => state.user);
  const myUserid = currentUser?.userid;

  const fetchPost = async () => {
  try {
    const res = await jaxios.get(`${baseURL}/style/post/${id}`);
    const postData = res.data; // 데이터를 변수에 저장

    setPost(postData);
    setLikeCount(postData.likesCount || 0);
    setReplies(Array.isArray(postData.replies) ? postData.replies : []);
    // 서버에서 받아온 liked 상태 사용 (아래 서버 수정 필요)
    setLiked(postData.liked || false);

      // 팔로우 상태 확인 로직 추가
      const isMyPostCheck = postData.userid === myUserid;
      if (myUserid && !isMyPostCheck) { // 로그인 상태이고 내 게시글이 아닐 때만 팔로우 상태 확인
          const followRes = await jaxios.get(`${baseURL}/style/follow/${postData.userid}`);
          setIsFollowing(followRes.data.followed);
      }
    } catch (err) {
      console.error("게시글 로드 오류", err);
      if (err.response?.data?.error === 'REQUIRE_LOGIN') {
        alert("로그인이 필요합니다.");
      }
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id, myUserid]);

  if (!post) return <div>로딩 중...</div>;

  // 좋아요 토글
  const handleLike = async () => {
    try {
      const res = await jaxios.post(`${baseURL}/style/like/${id}`);
      setLiked(res.data.liked);
      setLikeCount(res.data.likeCount);
    } catch (err) {
      console.error("좋아요 오류", err);
      if (err.response?.data?.error === 'REQUIRE_LOGIN') {
        alert("로그인 후 이용 가능합니다");
      }
    }
  };

  // 팔로우 토글
  const handleFollow = async () => {
    try {
      const res = await jaxios.post(`${baseURL}/style/follow`, { targetUserid: post.userid });
      setIsFollowing(res.data.followed);
      alert(res.data.message);
    } catch (err) {
      console.error("팔로우 오류", err);
      if (err.response?.data?.error === 'REQUIRE_LOGIN') {
        alert("로그인 후 이용 가능합니다");
      }
    }
  };

  // 댓글 작성
  const handleCommentSubmit = async () => {
  if (!comment.trim()) return; // 빈 댓글 방지

  try {
    const res = await jaxios.post(`${baseURL}/style/reply/${id}`, { content: comment });
    const newReply = res.data; // 서버가 새 댓글만 반환
    setReplies(prev => [...prev, newReply]); // 기존 댓글 + 새 댓글
    setComment(""); // 입력창 초기화
  } catch (err) {
    console.error("댓글 작성 오류", err);
    if (err.response?.data?.error === 'REQUIRE_LOGIN') {
      alert("로그인 후 이용 가능합니다");
    }
  }
};

  // 공유 버튼
  const handleShare = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    alert("게시글 링크가 복사되었습니다!");
  };

  //댓글 삭제
  const handleDeleteReply = async (replyId) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await jaxios.delete(`${baseURL}/style/reply/${replyId}`);
      setReplies(replies.filter(r => r.reply_id !== replyId));
    } catch (err) {
      console.error("댓글 삭제 오류", err);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm("게시글을 삭제하시겠습니까?")) return;

    try {
      await jaxios.delete(`${baseURL}/style/post/${id}`);
      alert("게시글이 삭제되었습니다.");
      // 삭제 후 Feed 페이지 등으로 이동
      window.location.href = "/style"; 
    } catch (err) {
      console.error("게시글 삭제 오류", err);
      alert("게시글 삭제 중 오류가 발생했습니다.");
    }
  };

  const { title, content, profileImg, userid, s_images = [] } = post;
  const indate = post.indate ? new Date(post.indate.replace(' ', 'T').replace('.0', '')): null;
  const isMyPost = post ? post.userid === myUserid : false;

  // ⭐ ImageSlider를 내부 컴포넌트로 정의
  const ImageSlider = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) return <div>이미지가 없습니다.</div>;

    const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    const nextSlide = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

    return (
      <div className="image-slider" style={{ position: "relative", width: "100%", height: "auto" }}>
        <img
          src={images[currentIndex]}
          alt={`slide-${currentIndex}`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <button onClick={prevSlide} style={{ position: "absolute", top: "50%", left: 0 }}>◀</button>
        <button onClick={nextSlide} style={{ position: "absolute", top: "50%", right: 0 }}>▶</button>
      </div>
    );
  };


  return (
    <div className="style-detail">
      {/* 헤더 부분 */}
      <div className="header">
        <div className="user-info">
          <img
            src={profileImg || "/default_profile.png"}
            alt={userid}
            className="profile"
          />
          <div>
            <div className="userid">{userid}</div>
            <div className="time">{indate ? indate.toLocaleString() : "날짜 없음"}</div>
          </div>
        </div>

        {isMyPost ? (
          <button className="delete-post-btn" onClick={handleDeletePost}>
            게시글 삭제
          </button>
        ) : (
          <button
            className={`follow-btn ${isFollowing ? "following" : ""}`}
            onClick={handleFollow}
          >
            {isFollowing ? "팔로잉" : "팔로우"}
          </button>
        )}
      </div>

      {/* 이미지 */}
      {s_images.length > 0 && (
        <div className="image-slider">
          <ImageSlider images={s_images} />
        </div>
      )}

      {/* 본문 */}
      <div className="post-content">
        <h2>{title}</h2>
        <p>{content}</p>
      </div>

      {/* 좋아요/댓글/공유 */}
      <div className="actions">
        <div className="action-item" onClick={handleLike}>
          {liked ? "❤️" : "🤍"} 좋아요 {likeCount}
        </div>
        <div className="action-item">💬 댓글 {replies.length}</div>
        <div className="action-item" onClick={handleShare}>
          🔗 공유
        </div>
      </div>

      {/* 댓글 입력창 */}
      <div className="comment-section">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="댓글을 입력하세요..."
        ></textarea>
        <button onClick={handleCommentSubmit}>등록</button>
      </div>

      {/* 댓글 목록 */}
      <div className="replies">
        {replies.map((reply) => {
          const replyDate = reply.indate ? new Date(reply.indate).toLocaleString() : "시간 없음";
          const isMyComment = reply.userid === myUserid;   // 댓글 작성자와 비교

          return (
            <div key={reply.reply_id} className="reply">
              <div className="reply-header">
                <strong>{reply.userid}</strong>
                <span className="reply-date">{replyDate}</span>
                {isMyComment && (  // 내 댓글일 때만 삭제 버튼 표시
                  <button
                    className="delete-reply-btn"
                    onClick={() => handleDeleteReply(reply.reply_id)}
                  >
                    삭제
                  </button>
                )}
              </div>
              <div className="reply-content">{reply.content}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StyleDetail;
