// import React, { useEffect, useState, useRef } from 'react';
// import '../../style/StyleHotTags.css';
// import { useNavigate } from 'react-router-dom';
// import jaxios from '../../util/jwtutil';

// const baseURL = process.env.REACT_APP_BASE_URL;

// function StyleHotTags() {
//   const [tags, setTags] = useState([]);
//   const navigate = useNavigate();
  
//   useEffect(() => {
//     const loadHotTags = async () => {
//       try {
//         const res = await jaxios.get(`${baseURL}/style/hot-tags`);
//         setTags(res.data);
//       } catch (err) {
//         console.error("HOT 태그 불러오기 오류", err);
//       }
//     };
//     loadHotTags();
//   }, []);

//   return (
//     <div className="hot-tags-container">
//       {tags.map((tag, index) => {
//         const tagListRef = useRef(null);
//         const [slideIndex, setSlideIndex] = useState(0);

//         const slide = (dir) => {
//           const container = tagListRef.current;
//           if (!container) return;

//           const itemWidth = container.firstChild.offsetWidth + 10; // gap 포함
//           const visibleItems = Math.floor(container.offsetWidth / itemWidth);

//           let newIndex = slideIndex + dir;
//           const maxIndex = tag.posts.length - visibleItems;
//           if (newIndex < 0) newIndex = 0;
//           if (newIndex > maxIndex) newIndex = maxIndex;

//           setSlideIndex(newIndex);
//           container.style.transform = `translateX(-${newIndex * itemWidth}px)`;
//         };

//         return (
//           <div key={tag.tagName} className="hot-tag-box">
//             {/* 태그 제목 */}
//             <h3 className="tag-title">{index + 1}. #{tag.tagName}</h3>

//             {/* 슬라이더 */}
//             <div className="tag-slider-wrapper">
//               <button className="tag-slider-btn left" onClick={() => slide(-1)}>‹</button>
//               <div className="tag-list" ref={tagListRef}>
//                 {tag.posts.map((post, idx) => (
//                   <div
//                     key={idx}
//                     className="tag-item"
//                     onClick={() => navigate(`/style/${post.spost_id}`)}
//                   >
//                     {post.title || "게시글 " + (idx + 1)}
//                   </div>
//                 ))}
//               </div>
//               <button className="tag-slider-btn right" onClick={() => slide(1)}>›</button>
//             </div>

//             {/* 게시물 카드 */}
//             <div className="style-hot-feed-grid">
//               {tag.posts.slice(0, 4).map(post => (
//                 <div key={post.spost_id} className="style-feed-card">
//                   {/* 이미지 */}
//                   <div
//                     className="style-hot-image-wrapper"
//                     onClick={() => navigate(`/style/${post.spost_id}`)}
//                   >
//                     <img src={post.s_images[0]} className="style-hot-post-img" />
//                     {post.s_images.length > 1 && (
//                       <div className="style-hot-multiple-count">
//                         +{post.s_images.length}
//                       </div>
//                     )}
//                   </div>

//                   {/* 유저 정보 + 좋아요 */}
//                   <div
//                     className="style-hot-feed-info"
//                     onClick={() => navigate(`/style/${post.spost_id}`)}
//                   >
//                     <img
//                       src={post.profileImg || "/default_profile.png"}
//                       className="style-hot-profile-img"
//                       onClick={() => navigate(`/styleUser/${post.userid}`)}
//                     />
//                     <span className="style-hot-nickname">{post.userid}</span>
//                     <div className="style-hot-like-btn">
//                       ❤️ {post.likeCount}
//                     </div>
//                   </div>

//                   {/* 내용 */}
//                   <p className="style-hot-post-content">{post.content}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// export default StyleHotTags;
