import React, { useEffect, useState } from 'react';
import '../../style/StyleHotAccounts.css';
import { useNavigate } from 'react-router-dom';
import jaxios from '../../util/jwtutil';
import { useSelector } from "react-redux";
import StylePostSlider from './StylePostSlider';

const baseURL = process.env.REACT_APP_BASE_URL;

function StyleHotAccounts() {
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user);
  const myUserid = currentUser?.userid;
  const [message, setMessage] = useState("");

  const [followStatus, setFollowStatus] = useState({});

  useEffect(() => {
    const loadHotUsers = async () => {
      try {
        const res = await jaxios.get(`${baseURL}/style/hot-users`);
        setAccounts(res.data);

        // 로그인 안 했으면 종료
        if (!myUserid) return;

        // 서버에서 이미 isFollowing 제공함 → 여기서 바로 followStatus 채워주면 됨
        const temp = {};
        res.data.forEach(u => {
          temp[u.userid] = u.isFollowing;   // 🔥 추가 API 호출 없음
        });
        setFollowStatus(temp);

      } catch (err) {
        console.error("HOT 계정 불러오기 오류", err);
      }
    };

    loadHotUsers();
  }, [myUserid]);

  const toggleFollow = async (userid) => {
    try {
    const res = await jaxios.post(`${baseURL}/style/follow`, { targetUserid: userid });

    setFollowStatus(prev => ({
      ...prev,
      [userid]: res.data.followed
    }));

    // 🔥 팔로워 수 UI도 즉시 갱신
    setAccounts(prev =>
      prev.map(acc =>
        acc.userid === userid
          ? {
              ...acc,
              followerCount: res.data.followed
                ? acc.followerCount + 1
                : acc.followerCount - 1
            }
          : acc
      )
    );

    alert(res.data.message);    
    } catch (err) {
      console.error("팔로우 토글 실패", err);
    }
  };

  return (
    <>
    {message && (
      <div className="follow-message">
        {message}
      </div>
    )}

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

            {myUserid && myUserid !== user.userid && (
              <button
                className={`follow-btn ${followStatus[user.userid] ? "following" : ""}`}
                onClick={() => toggleFollow(user.userid)}
              >
                {followStatus[user.userid] ? "팔로잉" : "팔로우"}
              </button>
            )}
          </div>

          {/* 게시물 영역 = Feed 카드 UI */}
            {user.posts && user.posts.length > 0 && (
              user.posts.length <= 4 ? (
                <div className="style-hot-feed-grid">
                  {user.posts.map((post) => (
                    <div key={post.spost_id} className="style-hot-feed-card">
                      <div className="style-hot-image-wrapper" onClick={() => navigate(`/style/${post.spost_id}`)}>
                        <img src={post.s_images[0]} className="style-hot-post-img" />
                        {post.s_images.length > 1 && (
                          <div className="style-hot-multiple-count">+{post.s_images.length}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <StylePostSlider posts={user.posts} />
              )
            )}
        </div>
      ))}
    </div>
  </>
  );
}

export default StyleHotAccounts;
