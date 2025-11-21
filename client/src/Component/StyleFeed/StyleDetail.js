import React, { useEffect, useState } from "react";
import jaxios from '../../util/jwtutil';
import { useParams } from "react-router-dom";
import "../../style/StyleDetail.css";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import Reply from "./Reply";

const baseURL = process.env.REACT_APP_BASE_URL;
const getOpenRepliesKey = (postId) => `style_post_${postId}_openReplies`;

const StyleDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState("");
  const [replies, setReplies] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [commentParent, setCommentParent] = useState(null);
  const [openReplies, setOpenReplies] = useState({});

  const navigate = useNavigate();
  const myUserid = useSelector(state => state.user?.userid);

  const buildReplyTree = (list) => {
    const map = {};
    const roots = [];

    list.forEach(r => {
      map[r.reply_id] = { ...r, children: [] };
    });

    list.forEach(r => {
      if (r.parent_id) {
        map[r.parent_id].children.push(map[r.reply_id]);
      } else {
        roots.push(map[r.reply_id]);
      }
    });

    return roots;
  };

  const toggleReplyVisibility = (replyId) => {
    setOpenReplies(prev => {
      const updated = { ...prev, [replyId]: !prev[replyId] };
      // localStorage에 저장
      localStorage.setItem(getOpenRepliesKey(id), JSON.stringify(updated));
      return updated;
    });
  };

  // 모든 댓글(대댓글 포함)에 isOpen:false를 심는 함수
  const addIsOpenRecursive = (list) => {
    return list.map(r => ({
      ...r,
      isOpen: false
    }));
  };


  const fetchPost = async () => {
  const res = await jaxios.get(`${baseURL}/style/post/${id}`);
  const postData = res.data;

  setPost(postData);

  // 댓글 트리 생성
  const replyTree = buildReplyTree(postData.replies);
  setReplies(replyTree);

  // openReplies 복원
  const savedOpen = JSON.parse(localStorage.getItem(getOpenRepliesKey(id))) || {};
  
  const initialOpen = {};
  postData.replies.forEach(r => {
    initialOpen[r.reply_id] = savedOpen[r.reply_id] || false;
  });
  
  setOpenReplies(initialOpen);
};

  useEffect(() => { fetchPost(); }, [id]);

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

  const getCommentCount = (repliesArray) => {
    let count = repliesArray.length;
    repliesArray.forEach(r => {
      if (r.children && r.children.length > 0) {
        count += getCommentCount(r.children); // 재귀로 대댓글까지 포함
      }
    });
    return count;
  };

  // 트리 전체에서 특정 reply_id를 찾는 재귀 함수
  const findReplyById = (list, replyId) => {
    for (let r of list) {
      if (r.reply_id === replyId) return r;
      if (r.children && r.children.length > 0) {
        const found = findReplyById(r.children, replyId);
        if (found) return found;
      }
    }
    return null;
  };

  // 댓글 작성
  const handleCommentSubmit = async (parentId = null) => {
    if (!comment.trim()) return;

    try {
      let contentToSend = comment;

      if (parentId) {
        // 부모 댓글을 트리 전체에서 검색
        const parent = findReplyById(replies, parentId);
        if (parent) {
          contentToSend = `@${parent.userid} ${comment}`;
        }
      }

      const res = await jaxios.post(`${baseURL}/style/reply/${id}`, {
        content: contentToSend,
        parentId
      });

      const newReply = {
        ...res.data.reply,
        children: []
      };

      const addChildReply = (list) => {
        return list.map(r => {
          if (r.reply_id === parentId) {
            return { ...r, children: [...r.children, newReply] };
          }
          return { ...r, children: addChildReply(r.children) };
        });
      };

      if (parentId) {
        setReplies(prev => addChildReply(prev));
      } else {
        setReplies(prev => [...prev, newReply]);
      }

      setComment("");
      setCommentParent(null);

    } catch (err) {
      console.error("댓글 작성 오류", err);
    }
  };


  // 공유 버튼
  const handleShare = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    alert("게시글 링크가 복사되었습니다!");
  };

  //재귀 삭제 함수
  const removeReplyById = (repliesArray, replyId) =>{
    return repliesArray
      .filter(r=>r.reply_id !== replyId)
      .map(r => ({
        ...r,
        children: r.children ? removeReplyById(r.children, replyId) : []
      }));
  };

  //댓글 삭제
  const handleDeleteReply = async (replyId) => {
  if (!replyId) return alert("댓글 ID가 없습니다.");
  if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

  try {
    await jaxios.delete(`${baseURL}/style/reply/${replyId}`, { data: { userid: myUserid } });
    setReplies(prev => removeReplyById(prev, replyId));
  } catch (err) {
    console.error("댓글 삭제 오류", err.response?.data || err);
    alert(err.response?.data?.message || "댓글 삭제 중 오류가 발생했습니다.");
  }
};



  const handleDeletePost = async () => {
    if (!window.confirm("게시글을 삭제하시겠습니까?")) return;
    try {
      await jaxios.delete(`${baseURL}/style/post/${id}`);
      alert("게시글이 삭제되었습니다.");
      navigate("/style");
    } catch (err) {
      console.error("게시글 삭제 오류", err);
      if (err.response?.status === 401) {
        alert("로그인이 필요합니다. 다시 로그인 해주세요.");
      } else {
        alert("게시글 삭제 중 오류가 발생했습니다.");
      }
    }
  };
  const { title, content, profileImg, userid, s_images = [] } = post;
  const indate = post.indate ? new Date(post.indate.replace(' ', 'T').replace(/\.\d+$/, '')): null;
  const isMyPost = post ? post.userid === myUserid : false;

  // ⭐ ImageSlider를 내부 컴포넌트로 정의
  const ImageSlider = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    if (!images || images.length === 0) return <div>이미지가 없습니다.</div>;

    // 이미지가 하나면 그냥 <img> 표시
    if (images.length === 1) {
      return (
        <img
          src={images[0]}
          alt="post-image"
          style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "10px" }}
        />
      );
    }

    
    const prevSlide = () => setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    const nextSlide = () => setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));

    return (
      <div className="image-slider" style={{ position: "relative", width: "100%", height: "auto" }}>
        <img
          src={images[currentIndex]}
          alt={`slide-${currentIndex}`}
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}
        />
        <button onClick={prevSlide} style={{ position: "absolute", top: "50%", left: 0 }}>◀</button>
        <button onClick={nextSlide} style={{ position: "absolute", top: "50%", right: 0 }}>▶</button>
      </div>
    );
  };


  return (
    <div className="style-detail-detail">
      {/* 헤더 */}
      <div className="style-detail-header">
        <div className="style-detail-user-left" onClick={() => navigate(`/styleUser/${userid}`)}>
          <img
            src={profileImg || "/default_profile.png"}
            alt={userid}
            className="style-detail-profile-large"
          />
          <div className="style-detail-user-text-area">
            <div className="style-detail-userid">
              {userid}

              {isMyPost ? (
                <div className="style-detail-my-post-actions">
                  <button
                    className="style-detail-edit-post-btn"
                    onClick={(e) => {e.stopPropagation(); navigate(`/style/edit/${id}`)}}
                  >
                    수정
                  </button>
                  <button
                    className="style-detail-delete-post-btn"
                    onClick={(e)=>{e.stopPropagation(); handleDeletePost();}}
                  >
                    삭제
                  </button>
                </div>
              ) : (
                <button
                className={`style-detail-follow-btn ${isFollowing ? "following" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();   // ← 부모 클릭 이벤트 막기
                  handleFollow();
                }}
              >
                {isFollowing ? "팔로잉" : "팔로우"}
              </button>
              )}
              </div>
            <div className="style-detail-time">{indate ? indate.toLocaleString() : "날짜 없음"}</div>
          </div>
        </div>
      </div>

      {/* 이미지 */}
      {s_images.length > 0 && (
        <div className="image-slider">
          <ImageSlider images={s_images} />
        </div>
      )}

      {/* 본문 */}
      <div className="style-post-content">
        <h2>{title}</h2>
        <p>{content}</p>

        <br/>
        {/* 해시태그 표시 */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="style-detail-hashtags">
            {post.hashtags.map((tag, index) => (
              <span key={index} className="style-detail-hashtag">
                #{tag}&nbsp;
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 좋아요/댓글/공유 */}
      <div className="style-detail-actions">
        <div className="style-detail-action-item" onClick={handleLike}>
          {liked ? "❤️" : "🤍"} 좋아요 {likeCount}
        </div>
        <div className="style-detail-action-item">💬 댓글 {getCommentCount(replies)}</div>
        <div className="style-detail-action-item" onClick={handleShare}>
          🔗 공유
        </div>
      </div>

      {/* 댓글 입력창 */}
      <div className="style-detail-comment-section">
        {commentParent && (
          <div style={{ marginBottom: "8px", color: "#555" }}>
            @{replies.find(r => r.reply_id === commentParent)?.userid || "사용자"} 에게 답글
            <button onClick={() => setCommentParent(null)} style={{ marginLeft: "8px" }}>취소</button>
          </div>
        )}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={commentParent ? "답글을 입력하세요..." : "댓글을 입력하세요..."}
        />
        <button onClick={() => handleCommentSubmit(commentParent)}>등록</button>

      </div>

      {/* 댓글 목록 */}
      <div className="style-detail-replies">
        {replies.map(reply => (
          <Reply
            key={reply.reply_id}
            reply={reply}
            myUserid={myUserid}
            toggleReplyVisibility={toggleReplyVisibility}
            isOpen={openReplies[reply.reply_id] || false}
            openReplies={openReplies}
            setReplyParent={setCommentParent}
            handleDeleteReply={handleDeleteReply}
          />
        ))}

      </div>
    </div>
  );
};

export default StyleDetail;
