import React, { useEffect, useState } from 'react';
import '../../style/StyleHotAccounts.css';
import { useNavigate } from 'react-router-dom';
import jaxios from '../../util/jwtutil';

const baseURL = process.env.REACT_APP_BASE_URL;

function StyleHotAccounts() {
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();

  const [followStatus, setFollowStatus] = useState({});

  useEffect(() => {
    const loadHotUsers = async () => {
      try {
        const res = await jaxios.get(`${baseURL}/style/hot-users`);
        setAccounts(res.data);

        // 팔로우 상태도 불러오기
        const temp = {};
        for (let u of res.data) {
          const r = await jaxios.get(`${baseURL}/style/follow/${u.userid}`);
          temp[u.userid] = r.data.followed;
        }
        setFollowStatus(temp);

      } catch (err) {
        console.error("HOT 계정 불러오기 오류", err);
      }
    };
    loadHotUsers();
  }, []);

  const toggleFollow = async (userid) => {
    try {
      const res = await jaxios.post(`${baseURL}/style/follow`, { targetUserid: userid });
      setFollowStatus(prev => ({ ...prev, [userid]: res.data.followed }));
    } catch (err) {
      alert("로그인이 필요합니다.");
    }
  };

  return (
    <div className="hot-accounts-container">
      {accounts.map((user, index) => (
        <div key={user.userid} className="hot-account-box">

          {/* 헤더 영역(순위 + 프로필 + 닉네임 + 팔로우수 + 버튼) 그대로 유지 */}
          <div className="hot-account-header">
            <span className="rank">{index + 1}.</span>

            <img
              src={user.profileImg || "/default_profile.png"}
              className="account-profile"
              onClick={() => navigate(`/styleUser/${user.userid}`)}
            />

            <span
              className="account-name"
              onClick={() => navigate(`/styleUser/${user.userid}`)}
            >
              {user.userid}
            </span>

            <span className="follow-count">팔로워 {user.followerCount}</span>

            <button
              className={`follow-btn ${followStatus[user.userid] ? "following" : ""}`}
              onClick={() => toggleFollow(user.userid)}
            >
              {followStatus[user.userid] ? "팔로잉" : "팔로우"}
            </button>
          </div>

          {/* 게시물 영역 = Feed 카드 UI */}
          <div className="style-hot-feed-grid">
            {user.posts?.slice(0, 4).map(post => (
              <div key={post.spost_id} className="style-hot-feed-card">

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

                <p className="style-hot-post-content">{post.content}</p>
              </div>
            ))}
          </div>

        </div>
      ))}
    </div>
  );
}

export default StyleHotAccounts;
