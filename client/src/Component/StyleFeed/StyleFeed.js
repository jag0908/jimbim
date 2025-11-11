import React, { useEffect, useState } from 'react';
import '../../style/StyleFeed.css';
import { useNavigate } from 'react-router-dom';
import jaxios from '../../util/jwtutil';

const baseURL = process.env.REACT_APP_BASE_URL;

function StyleFeed() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await jaxios.get(`${baseURL}/style/posts`);
      setPosts(res.data);
    };
    fetchPosts();
  }, []); // ← []를 [location]으로 바꾸면 페이지 이동마다 새로 불러옴

  // 좋아요 토글 함수
  const toggleLike = async (postId) => {
    try {
      const res = await jaxios.post(`${baseURL}/style/like/${postId}`);
      const { liked, likeCount } = res.data;

      // 서버 응답값으로 UI 업데이트
      setPosts(posts.map(post => 
        post.spost_id === postId 
          ? { ...post, liked, likeCount }
          : post
      ));
    } catch (err) {
      console.error("좋아요 오류", err);
      if (err.response?.data?.error === 'REQUIRE_LOGIN') {
        alert("로그인 후 이용 가능합니다");
      }
    }
  };

  const handleWriteClick = () => {
    navigate('/styleWrite');
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