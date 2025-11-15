import React, { useEffect, useState } from 'react';
import '../../style/StyleHotTags.css';
import { useNavigate } from 'react-router-dom';
import jaxios from '../../util/jwtutil';

const baseURL = process.env.REACT_APP_BASE_URL;

function StyleHotTags() {
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHotTags = async () => {
      try {
        const res = await jaxios.get(`${baseURL}/style/hot-tags`);
        setTags(res.data);
      } catch (err) {
        console.error("HOT 태그 불러오기 오류", err);
      }
    };
    loadHotTags();
  }, []);

  return (
    <div className="hot-tags-container">
      {tags.map((tag, index) => (
        <div key={tag.tagName} className="hot-tag-box">

          {/* 태그 제목 유지 */}
          <h3 className="tag-title">{index + 1}. #{tag.tagName}</h3>

          {/* 게시물 영역을 Feed 카드 UI로 */}
          <div className="style-hot-feed-grid">
            {tag.posts.slice(0, 4).map(post => (
              <div key={post.spost_id} className="style-feed-card">

                {/* 이미지 */}
                <div
                  className="style-hot-image-wrapper"
                  onClick={() => navigate(`/style/${post.spost_id}`)}
                >
                  <img src={post.s_images[0]} className="style-hot-post-img" />
                  {post.s_images.length > 1 && (
                    <div className="style-hot-multiple-count">
                      +{post.s_images.length}
                    </div>
                  )}
                </div>

                {/* 유저 정보 */}
                <div className="style-hot-feed-info">
                  <img
                    src={post.profileImg || "/default_profile.png"}
                    className="style-hot-profile-img"
                    onClick={() => navigate(`/styleUser/${post.userid}`)}
                  />
                  <span className="style-hot-nickname">{post.userid}</span>
                  

                  {/* 좋아요(원래 Feed에 있던 그대로) */}
                  <div className="style-hot-like-btn">
                    ❤️ {post.likeCount}
                  </div>
                </div>

                {/* 내용 */}
                <p className="style-hot-post-content">{post.content}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default StyleHotTags;
