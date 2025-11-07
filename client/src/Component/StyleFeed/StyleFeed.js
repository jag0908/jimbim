import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../style/StyleFeed.css';
import { useNavigate } from 'react-router-dom';


function StyleFeed() {
  // const baseURL = process.env.REACT_APP_BASE_URL;
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/style/posts').then(res => {
      setPosts(res.data);
    })
    .catch(err => console.error(err));
  }, []);

  const handleWriteClick = () => {
    navigate('/stylewrite');
  };


  return (
    <div className="feed-container">
      <div className="hashtag-bar">
        #오늘뭐입지 #트렌드스타일 #봄코디 #컬러룩 #유행잇템
      </div>

      <div className="write-button-area">
        <button className="write-btn" onClick={handleWriteClick}>
          ✍️ 글쓰기
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
              <img src={post.s_image} alt="post" className="post-img" />
              <div className="feed-info">
                <img src={post.profileImg} alt="profile" className="profile-img" />
                <span className="nickname">{post.userid}</span>
              </div>
              <div className="feed-actions">
                ❤️ {post.likeCount} 💬 {post.replyCount}
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