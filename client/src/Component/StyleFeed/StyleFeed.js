import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../style/StyleFeed.css';

function StyleFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('/api/style/posts').then(res => {
      setPosts(res.data);
    });
  }, []);

  return (
    <div className="feed-container">
      <header className="feed-header">
        <button>로그인</button>
        <div>
          <a href="/mypage">마이페이지</a> | <a href="/help">고객센터</a>
        </div>
      </header>

      <div className="hashtag-bar">
        #오늘뭐입지 #트렌드스타일 #봄코디 #컬러룩 #유행잇템
      </div>

      <div className="feed-grid">
        {posts.map(post => (
          <div key={post.spost_id} className="feed-card">
            <img src={post.s_image} alt="post" className="post-img" />
            <div className="feed-info">
              <img src={post.profileImg} alt="profile" className="profile-img" />
              <span className="nickname">{post.userid}</span>
            </div>
            <div className="feed-actions">
              ❤️ {post.likeCount}  💬 {post.replyCount}
            </div>
            <p className="post-content">{post.content}</p>
          </div>
        ))}
      </div>

      <footer className="feed-footer">© Style Platform</footer>
    </div>
  );
}

export default StyleFeed;