import React, { useEffect, useState } from 'react';
import '../../style/StyleFeed.css';
import { useNavigate } from 'react-router-dom';
import jaxios from '../../util/jwtutil';
import StyleHotAccounts from "./StyleHotAccounts";
import StyleHotTags from "./StyleHotTags";
import Masonry from 'react-masonry-css';

const baseURL = process.env.REACT_APP_BASE_URL;

function StyleFeed() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [category, setCategory] = useState("default");

  useEffect(() => {
    if (category === "accounts" || category === "tags") return;

    const fetchPosts = async () => {
      let url = "";
      if (category === "default") url = `${baseURL}/style/posts`;
      else if (category === "trending") url = `${baseURL}/style/trending`;
      else if (category === "views") url = `${baseURL}/style/views`;

      try {
        const res = await jaxios.get(url);
        setPosts(res.data);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
      }
    };

    fetchPosts();
  }, [category]);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };


  const toggleLike = async (postId) => {
    try {
      const res = await jaxios.post(`${baseURL}/style/like/${postId}`);
      const { liked, likeCount } = res.data;

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

      <div className="style-feed-category-bar">
        <button className={`style-feed-category-btn ${category === "default" ? "active" : ""}`} onClick={() => setCategory("default")}>🏠 전체보기</button>
        <button className={`style-feed-category-btn ${category === "trending" ? "active" : ""}`} onClick={() => setCategory("trending")}>🔥 요즘 트렌드</button>
        <button className={`style-feed-category-btn ${category === "views" ? "active" : ""}`} onClick={() => setCategory("views")}>👀 관심 스타일</button>
        <button className={`style-feed-category-btn ${category === "tags" ? "active" : ""}`} onClick={() => setCategory("tags")}>🏷️ HOT 태그</button>
        <button className={`style-feed-category-btn ${category === "accounts" ? "active" : ""}`} onClick={() => setCategory("accounts")}>👤 HOT 계정</button>
      </div>

      <div className="style-feed-write-button-area">
        <button className="style-feed-write-btn" onClick={handleWriteClick}>
          글쓰기
        </button>
      </div>

      {/* 🔥 HOT 계정 */}
      {category === "accounts" && <StyleHotAccounts />}

      {/* 🔥 HOT 태그 */}
      {category === "tags" && <StyleHotTags />}


      {/* 🔥 기본 Feed */}
      {(category !== "tags" && category !== "accounts") && (

        
        <div className="style-feed-grid">
          {!Array.isArray(posts) || posts.length === 0 ? (
            <div className="style-feed-no-posts">
              😢 아직 등록된 스타일이 없습니다. 첫 번째 스타일을 공유해보세요!
            </div>
          ) : (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {posts.map(post => (
                <div key={post.spost_id} className="style-feed-card">
                  <div
                    className="style-feed-image-wrapper"
                    onClick={() => navigate(`/style/${post.spost_id}`)}
                  >
                    {Array.isArray(post.s_images) ? (
                      <>
                        <img src={post.s_images[0]} alt="post" className="style-feed-post-img" />
                        {post.s_images.length > 1 && (
                          <div className="style-feed-multiple-count">+{post.s_images.length}</div>
                        )}
                      </>
                    ) : (
                      <img src={post.s_images} alt="post" className="style-feed-post-img" />
                    )}
                  </div>

                  <div className="style-feed-info">
                    <img
                      src={post.profileImg || '/default_profile.png'}
                      alt="profile"
                      className="style-feed-profile-img"
                      onClick={() => navigate(`/styleUser/${post.userid}`)}
                    />
                    <div
                      className="style-feed-user-info"
                      onClick={() => navigate(`/styleUser/${post.userid}`)}
                    >
                      <span className="style-feed-nickname">{post.userid}</span>
                    </div>

                    <button
                      className={`style-feed-like-btn ${post.liked ? "liked" : ""}`}
                      onClick={() => toggleLike(post.spost_id)}
                    >
                      {post.liked ? "❤️" : "🤍"} {post.likeCount}
                    </button>
                  </div>

                  <p className="style-feed-post-title">{post.title}</p>
                </div>
              ))}
            </Masonry>
          )
        }
        </div>
      )}
    </div>
  );
}

export default StyleFeed;