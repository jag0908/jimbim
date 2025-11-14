import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jaxios from "../../util/jwtutil";
import "../../style/StyleUser.css";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';


const baseURL = process.env.REACT_APP_BASE_URL;

function StyleUser() {
  const { userid } = useParams(); // URL에서 유저 아이디 가져오기
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const currentUser = useSelector((state) => state.user);
  const myUserid = currentUser?.userid;
  const navigate = useNavigate();

  // ✅ 유저 정보 + 팔로워/팔로잉 수 불러오기
  const fetchUserInfo = async () => {
    try {
      const res = await jaxios.get(`${baseURL}/style/userinfo/${userid}`);
      setUserInfo(res.data);
    } catch (err) {
      console.error("유저 정보 불러오기 실패", err);
    }
  };

  // ✅ 해당 유저의 게시글만 가져오기
  const fetchUserPosts = async () => {
    try {
      const res = await jaxios.get(`${baseURL}/style/posts/${userid}`);
      setPosts(res.data);
    } catch (err) {
      console.error("게시글 불러오기 실패", err);
    }
  };

  // ✅ 팔로우 상태 확인
  const checkFollowStatus = async () => {
    if (!myUserid || myUserid === userid) return;
    try {
      const res = await jaxios.get(`${baseURL}/style/follow/${userid}`);
      setIsFollowing(res.data.followed);
    } catch (err) {
      console.error("팔로우 상태 확인 실패", err);
    }
  };

  // ✅ 팔로우 토글
  const handleFollowToggle = async () => {
    try {
      const res = await jaxios.post(`${baseURL}/style/follow`, { targetUserid: userid });
      setIsFollowing(res.data.followed);
      checkFollowStatus();   // 팔로우 상태 갱신
      fetchUserInfo();       // 유저 정보 갱신 (팔로워 수 포함)
      alert(res.data.message);
    } catch (err) {
      console.error("팔로우 토글 실패", err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchUserPosts();
    checkFollowStatus();
  }, [userid, myUserid]);

  if (!userInfo) return <div>로딩 중...</div>;

  const isMyProfile = myUserid === userid;

  return (
    <div className="style-user-page">
      {/* ✅ 헤더 */}
      <div className="style-profile-header">
        <div className="style-profile-left">
          <img
            src={userInfo.profileImg || "/default_profile.png"}
            alt="프로필"
            className="style-profile-img-large"
          />
        </div>

        <div className="style-profile-right">
          <div className="style-nickname-row">
            <h2>{userInfo.nickname || userid}</h2>
            {!isMyProfile && (
              <button
                className={`style-follow-btn ${isFollowing ? "following" : ""}`}
                onClick={handleFollowToggle}
              >
                {isFollowing ? "팔로잉" : "팔로우"}
              </button>
            )}
          </div>

        <div className="style-follow-info">
            <span>팔로워 {userInfo.followers ?? 0}</span>
            <span>팔로잉 {userInfo.following ?? 0}</span>
        </div>

          {userInfo.intro && <p className="style-intro-text">{userInfo.intro}</p>}
        </div>
      </div>

      {/* ✅ 게시글 그리드 */}
      <div className="style-user-posts">
        {posts.length === 0 ? (
          <div className="style-no-posts">아직 게시글이 없습니다.</div>
        ) : (
          <div className="style-post-grid">
            {posts.map((post) => (
              <div key={post.spost_id} className="style-post-card">
                <div className="style-post-image" onClick={() => navigate(`/style/${post.spost_id}`)}>
                  <img
                        src={Array.isArray(post.s_images) ? post.s_images[0] : post.s_images}
                        alt="post"
                    />
                  <div className="style-view-count">👁 {post.viewCount ?? 0}</div>  {/* 👈 조회수 표시 */}
                </div>
                <div className="style-post-info" >
                  <div className="style-user-mini">
                    <img
                      src={post.profileImg || "/default_profile.png"}
                      alt="프로필"
                      className="style-mini-profile"
                    />
                    <span className="style-userid">{post.userid}</span>
                  </div>
                  <div className="style-likes">❤️ {post.likeCount}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StyleUser;
