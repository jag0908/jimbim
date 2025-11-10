import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../style/StyleFeed.css';
import { useNavigate } from 'react-router-dom';

const baseURL = process.env.REACT_APP_BASE_URL;

function StyleFeed() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${baseURL}/style/posts`).then(res => {
      // 좋아요 상태와 개수 분리
      const postsWithLikeState = res.data.map(post => ({
        ...post,
        liked: false,  // 기본 좋아요 안한 상태
      }));
      setPosts(postsWithLikeState);
    })
    .catch(err => console.error(err));
  }, []);

  const handleWriteClick = () => {
    navigate('/stylewrite');
  };

  // 좋아요 토글 함수
  const toggleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.spost_id === postId) {
        const isLiked = !post.liked;
        return {
          ...post,
          liked: isLiked,
          likeCount: isLiked ? post.likeCount + 1 : post.likeCount - 1,
        };
      }
      return post;
    }));
  };

  return (
    <div className="feed-container">
      <div className="hashtag-bar">
        #오늘뭐입지 #트렌드스타일 #봄코디 #컬러룩 #유행잇템
      </div>

      <div className="write-button-area">
        <button className="write-btn" onClick={handleWriteClick}>
          글쓰기
        </button>
      </div>

      <div className="feed-grid">
        {!Array.isArray(posts) || posts.length === 0 ? (
          <div className="no-posts">
            😢 아직 등록된 스타일이 없습니다. 첫 번째 스타일을 공유해보세요!
          </div>
        ) : (
          posts.map(post => (
            <div key={post.spost_id} className="feed-card">
              <div className="image-wrapper" onClick={() => navigate(`/style/${post.spost_id}`)}>
                {/* 이미지 여러 장 처리 */}
                {Array.isArray(post.s_images) ? (
                  <>
                    <img src={post.s_images[0]} alt="post" className="post-img" />
                    {post.s_images.length > 1 && (
                      <div className="multiple-count">+{post.s_images.length}</div>
                    )}
                  </>
                ) : (
                  <img src={post.s_images} alt="post" className="post-img" />
                )}
              </div>

              <div className="feed-info">
                <img 
                  src={post.profileImg || '/default_profile.png'} // post.profileImg가 null이면 기본 이미지 사용
                  alt="profile" 
                  className="profile-img" 
                />
                <div className="user-info">
                  <span className="nickname">{post.userid}</span>
                </div>
                <button
                  className={`like-btn ${post.liked ? "liked" : ""}`}
                  onClick={() => toggleLike(post.spost_id)}
                  aria-label="좋아요 버튼"
                >
                  {post.liked ? "❤️" : "🤍"} {post.likeCount}
                </button>
              </div>

              <p className="post-content">{post.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default StyleFeed;
