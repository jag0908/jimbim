import React, { useEffect, useState } from 'react';
import '../../style/StyleHotTags.css';
import { useNavigate } from 'react-router-dom';
import jaxios from '../../util/jwtutil';
import StylePostSlider from './StylePostSlider';

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
        <div key={`${tag.tagName}-${index}`} className="hot-tag-box">
          <h3 className="tag-title">{index + 1}. #{tag.tagName}</h3>

          <StylePostSlider
            posts={tag.posts || []}
            showButtons={true}
            renderItem={(post) => (
              <div
                className="style-hot-feed-card"
                onClick={() => navigate(`/style/${post.spost_id}`)}
              >
                {/* 이미지 래퍼 */}
                {post.s_images && post.s_images.length > 0 && (
                  <div className="style-hot-image-wrapper">
                    <img
                      src={post.s_images[0]}
                      alt="post"
                      className="style-hot-post-img"
                    />
                    {post.s_images.length > 1 && (
                      <span className="style-hot-multiple-count">
                        +{post.s_images.length}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="style-hot-feed-info">
                  <img
                    src={post.profileImg || "/default_profile.png"}
                    className="style-hot-profile-img"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/styleUser/${post.userid}`);
                    }}
                  />
                  <span className="style-hot-nickname">{post.userid}</span>
                  <button className={`style-hot-like-btn ${post.liked ? "liked" : ""}`}>
                    ❤️ {post.likeCount}
                  </button>
                </div>
              </div>
            )}
          />
        </div>
      ))}
    </div>
  );
}

export default StyleHotTags;
