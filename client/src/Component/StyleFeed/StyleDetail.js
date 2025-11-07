import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../style/StyleDetail.css';

function StyleDetail() {
  // const baseURL = process.env.REACT_APP_BASE_URL;
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.get(`/api/style/post/${id}`).then(res => {
      setPost(res.data);
    });
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return (
    <div className="detail-container">
      <header className="detail-header">
        <img src={post.profileImg} alt="profile" className="detail-profile" />
        <div>
          <div className="nickname">{post.userid}</div>
          <div className="time">{post.indate}</div>
        </div>
        <button className="follow-btn">팔로우</button>
      </header>

      <img src={post.s_image} alt="style" className="detail-photo" />

      <div className="detail-actions">
        ❤️ {post.likeCount}  💬 {post.replyCount}  ⭐ 관심
      </div>

      <div className="detail-products">
        {post.products?.map(p => (
          <div key={p.id} className="product-tag">
            <div>{p.name}</div>
            <div>{p.price}원</div>
          </div>
        ))}
      </div>

      <div className="detail-content">
        <h3>{post.title}</h3>
        <p>{post.content}</p>
      </div>
    </div>
  );
}

export default StyleDetail;
