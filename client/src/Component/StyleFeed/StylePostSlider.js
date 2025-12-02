import React, { useRef, useState, useEffect } from "react";
import "../../style/StylePostSlider.css";

export default function StylePostSlider({ posts, renderItem, showButtons = true }) {
  const sliderRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);
  const [hasOverflow, setHasOverflow] = useState(false);

  const VISIBLE_COUNT = 4;

  // renderItem 기본값
  const defaultRenderItem = (post) => (
    <div className="style-hot-feed-card">
      <div className="style-hot-image-wrapper">
        <img src={post.s_images[0]} alt="post" className="style-hot-post-img" />
        {post.s_images.length > 1 && (
          <div className="style-hot-multiple-count">+{post.s_images.length}</div>
        )}
      </div>
      <p className="style-hot-post-content">{post.content}</p>
    </div>
  );

  const itemRenderer = renderItem || defaultRenderItem;

  useEffect(() => {
    const updateItemWidth = () => {
      if (posts.length > 0 && sliderRef.current?.firstChild) {
        const width = sliderRef.current.firstChild.offsetWidth;
        const fullWidth = width + 10; // gap
        setItemWidth(fullWidth);

        const totalWidth = fullWidth * posts.length;
        const visibleWidth = fullWidth * VISIBLE_COUNT;

        // overflow 여부 계산
        setHasOverflow(totalWidth > visibleWidth);
      }
    };

    const timer = setTimeout(updateItemWidth, 50);
    window.addEventListener("resize", updateItemWidth);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateItemWidth);
    };
  }, [posts]);

  const slide = (dir) => {
    if (itemWidth === 0) return;
    let newIndex = index + dir;

    const maxIndex = Math.max(posts.length - VISIBLE_COUNT, 0);
    if (newIndex < 0) newIndex = 0;
    if (newIndex > maxIndex) newIndex = maxIndex;

    setIndex(newIndex);
  };

  const transformStyle = {
    transform: `translateX(-${index * itemWidth}px)`,
  };

  return (
    <div className="style-post-slider-wrapper">
      {/* 왼쪽 버튼 */}
      {showButtons && hasOverflow && (
        <button className="style-post-slider-btn left" onClick={() => slide(-1)}>
          ‹
        </button>
      )}

      <div className="style-post-slider-viewport">
        <div className="style-post-slider-list" ref={sliderRef} style={transformStyle}>
          {posts.map((post, idx) => (
            <div className="style-post-slider-item" key={idx}>
              {itemRenderer(post)}
            </div>
          ))}
        </div>
      </div>

      {/* 오른쪽 버튼 */}
      {showButtons && hasOverflow && (
        <button className="style-post-slider-btn right" onClick={() => slide(1)}>
          ›
        </button>
      )}
    </div>
  );
}
