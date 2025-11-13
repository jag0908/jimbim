import React, { useEffect, useState } from 'react';
import '../../style/StyleFeed.css';
import { useNavigate } from 'react-router-dom';
import jaxios from '../../util/jwtutil';

const baseURL = process.env.REACT_APP_BASE_URL;

function StyleFeed() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [category, setCategory] = useState("default");

  useEffect(() => {
    const fetchPosts = async () => {
      let url = "";
      if (category === "default") url = `${baseURL}/style/posts`;
      else if (category === "trending") url = `${baseURL}/style/trending`;
      else if (category === "views") url = `${baseURL}/style/views`;
      else if (category === "tags") url = `${baseURL}/style/hot-tags`;
      else if (category === "accounts") url = `${baseURL}/style/hot-users`;

      try {
        const res = await jaxios.get(url);
        setPosts(res.data);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
      }
    };

    fetchPosts();
  }, [category]); // 카테고리 변경 시마다 호출

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
    <div className="style-feed-container">
      <div className="style-category-bar">
        <button
          className={`style-category-btn ${category === "default" ? "active" : ""}`}
          onClick={() => setCategory("default")}
        >
          🏠 전체보기
        </button>
        <button
          className={`style-category-btn ${category === "trending" ? "active" : ""}`}
          onClick={() => setCategory("trending")}
        >
          🔥 요즘 트렌드
        </button>
        <button
          className={`style-category-btn ${category === "views" ? "active" : ""}`}
          onClick={() => setCategory("views")}
        >
          👀 인기 스타일
        </button>
        <button
          className={`style-category-btn ${category === "tags" ? "active" : ""}`}
          onClick={() => setCategory("tags")}
        >
          🏷️ HOT 태그
        </button>
        <button
          className={`style-category-btn ${category === "accounts" ? "active" : ""}`}
          onClick={() => setCategory("accounts")}
        >
          👤 HOT 계정
        </button>
      </div>

      <div className="style-write-button-area">
        <button className="style-write-btn" onClick={handleWriteClick}>
          글쓰기
        </button>
      </div>

      <div className="style-feed-grid">
        {!Array.isArray(posts) || posts.length === 0 ? (
          <div className="style-no-posts">
            😢 아직 등록된 스타일이 없습니다. 첫 번째 스타일을 공유해보세요!
          </div>
        ) : (
          posts.map(post => (
            <div key={post.spost_id} className="style-feed-card">
              <div className="style-image-wrapper" onClick={() => navigate(`/style/${post.spost_id}`)}>
                {/* 이미지 여러 장 처리 */}
                {Array.isArray(post.s_images) ? (
                  <>
                    <img src={post.s_images[0]} alt="post" className="style-post-img" />
                    {post.s_images.length > 1 && (
                      <div className="style-multiple-count">+{post.s_images.length}</div>
                    )}
                  </>
                ) : (
                  <img src={post.s_images} alt="post" className="style-post-img" />
                )}
              </div>

              <div className="style-feed-info">
                <img 
                  src={post.profileImg || '/default_profile.png'} // post.profileImg가 null이면 기본 이미지 사용
                  alt="profile" 
                  className="style-profile-img" onClick={() => navigate(`/styleUser/${post.userid}`)} 
                />
                <div className="style-user-info" onClick={() => navigate(`/styleUser/${post.userid}`)} style={{ cursor: "pointer" }}>
                  <span className="style-nickname">{post.userid}</span>
                </div>
                <button
                  className={`style-like-btn ${post.liked ? "liked" : ""}`}
                  onClick={() => toggleLike(post.spost_id)}
                  aria-label="좋아요 버튼"
                >
                  {post.liked ? "❤️" : "🤍"} {post.likeCount}
                </button>
              </div>

              <p className="style-post-content">{post.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default StyleFeed;