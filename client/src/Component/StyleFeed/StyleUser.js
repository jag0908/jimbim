import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jaxios from "../../util/jwtutil";
import "../../style/StyleUser.css";
import Masonry from "react-masonry-css";
import { Cookies } from "react-cookie";
import StyleFollowList from "./StyleFollowList";

const baseURL = process.env.REACT_APP_BASE_URL;

function StyleUser() {
  const { userid } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]);                  // Style 게시글
  const [sellPosts, setSellPosts] = useState([]);          // 판매 목록
  const [zzimPosts, setZzimPosts] = useState([]);          // 찜 목록
  const [myCommunityPosts, setMyCommunityPosts] = useState([]); // 작성한 커뮤니티 게시글
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("style");
  const [openFollowModal, setOpenFollowModal] = useState(false);
  const [followType, setFollowType] = useState("followers");

  const cookies = new Cookies();
  const currentUser = cookies.get("user");
  const myUserid = currentUser?.userid;
  const navigate = useNavigate();

  const isMyProfile = myUserid === userid;

  // --- 유저 정보 불러오기 ---
  const fetchUserInfo = async () => {
    try {
      const res = await jaxios.get(`${baseURL}/style/userinfo/${userid}`);
      setUserInfo(res.data);
      if (res.data.sellPosts) setSellPosts(res.data.sellPosts);
      return res.data?.memberId;
    } catch (err) {
      console.error("유저 정보 불러오기 실패", err);
    }
  };

  // --- Style 게시글 ---
  const fetchUserPosts = async () => {
    try {
      const res = await jaxios.get(`${baseURL}/style/posts/${userid}`);
      setPosts(res.data);
    } catch (err) {
      console.error("게시글 불러오기 실패", err);
    }
  };

  // --- 판매 목록 ---
  const fetchUserSellPosts = async (memberId) => {
    if (!memberId) return;
    try {
      const res = await jaxios.get(`${baseURL}/sh-page/user-sell-list/${memberId}`);
      setSellPosts(res.data.sellPosts);
    } catch (err) {
      console.error("판매 목록 불러오기 실패", err);
    }
  };

  // --- 찜 목록 ---
  const fetchZzimPosts = async () => {
    if (!userInfo?.memberId) return;
    try {
      const res = await jaxios.get(`${baseURL}/style/zzim-list/${userInfo.memberId}`);
      setZzimPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("찜 목록 불러오기 실패", err);
    }
  };

  // --- 커뮤니티 게시글 (본인만) ---
  const fetchMyCommunityPosts = async () => {
    if (!isMyProfile) return;
    try {
      const res = await jaxios.get(`${baseURL}/communityList/myPosts/${myUserid}`);
      setMyCommunityPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("커뮤니티 게시글 불러오기 실패", err);
    }
  };

  // --- 팔로우 상태 확인 ---
  const checkFollowStatus = async () => {
    if (!myUserid || isMyProfile) return;
    try {
      const res = await jaxios.get(`${baseURL}/style/follow/${userid}`);
      setIsFollowing(res.data.followed);
    } catch (err) {
      console.error("팔로우 상태 확인 실패", err);
    }
  };

  // --- 팔로우 토글 ---
  const handleFollowToggle = async () => {
    try {
      const res = await jaxios.post(`${baseURL}/style/follow`, { targetUserid: userid });
      setIsFollowing(res.data.followed);
      checkFollowStatus();
      fetchUserInfo();
      alert(res.data.message);
    } catch (err) {
      console.error("팔로우 토글 실패", err);
    }
  };

  const openFollowers = () => { setFollowType("followers"); setOpenFollowModal(true); };
  const openFollowing = () => { setFollowType("following"); setOpenFollowModal(true); };

  // --- 초기 로드 ---
  useEffect(() => {
    const loadData = async () => {
      const memberId = await fetchUserInfo();
      fetchUserPosts();
      checkFollowStatus();
      fetchMyCommunityPosts();
    };
    loadData();
  }, [userid, myUserid]);

  // --- 탭 변경 시 데이터 로드 ---
  useEffect(() => {
    if (!userInfo?.memberId) return;
    if (activeTab === "sell") fetchUserSellPosts(userInfo.memberId);
    if (activeTab === "zzim") fetchZzimPosts();
    if (activeTab === "myPosts") fetchMyCommunityPosts();
  }, [activeTab, userInfo]);

  if (!userInfo) return <div>로딩 중...</div>;

  const breakpointColumns = { default: 4, 1200: 3, 768: 2, 480: 1 };

  return (
    <div className="style-user-page">
      {/* 프로필 헤더 */}
      <div className="style-profile-header">
        <div className="style-profile-left">
          <img src={userInfo.profileImg || "/default_profile.png"} alt="프로필" className="style-profile-img-large"/>
        </div>
        <div className="style-profile-right">
          <div className="style-nickname-row">
            <h2>{userInfo.nickname || userid}</h2>
            {!isMyProfile && (
              <button className={`style-follow-btn ${isFollowing ? "following" : ""}`} onClick={handleFollowToggle}>
                {isFollowing ? "팔로잉" : "팔로우"}
              </button>
            )}
          </div>
          <div className="style-follow-info">
            <span onClick={openFollowers} className="clickable">팔로워 {userInfo.followers ?? 0}</span>
            <span onClick={openFollowing} className="clickable">팔로잉 {userInfo.following ?? 0}</span>
          </div>
          {userInfo.intro && <p className="style-intro-text">{userInfo.intro}</p>}
        </div>
      </div>

      {/* 팔로우 모달 */}
      {openFollowModal && (
        <StyleFollowList open={openFollowModal} onClose={() => setOpenFollowModal(false)} memberId={userInfo.memberId} type={followType}/>
      )}

      {/* 탭 */}
      <div className="style-user-tabs">
        <button className={activeTab === "style" ? "tab active" : "tab"} onClick={() => setActiveTab("style")}>Style</button>
        <button className={activeTab === "sell" ? "tab active" : "tab"} onClick={() => setActiveTab("sell")}>판매 목록</button>
        <button className={activeTab === "zzim" ? "tab active" : "tab"} onClick={() => setActiveTab("zzim")}>찜 목록</button>
        {isMyProfile && <button className={activeTab === "myPosts" ? "tab active" : "tab"} onClick={() => setActiveTab("myPosts")}>작성한 게시글</button>}
      </div>

      {/* Style 게시글 */}
      {activeTab === "style" && (
        <div className="style-user-posts">
          {posts.length === 0 ? (
            <div className="style-no-posts">아직 게시글이 없습니다.</div>
          ) : (
            <Masonry breakpointCols={breakpointColumns} className="style-masonry-grid" columnClassName="style-masonry-grid-column">
              {posts.map((post, index) => (
                <div key={post.spost_id ?? index} className="style-post-card" onClick={() => navigate(`/style/${post.spost_id}`)}>
                  <div className="style-post-image">
                    <img src={Array.isArray(post.s_images) ? post.s_images[0] : post.s_images} alt="post" />
                    <div className="style-likes">❤️ {post.likeCount}</div>
                  </div>
                </div>
              ))}
            </Masonry>
          )}
        </div>
      )}

      {/* 판매 목록 */}
      {activeTab === "sell" && (
        <div className="style-user-posts">
          {sellPosts.length === 0 ? (
            <div className="style-no-posts">등록된 판매 상품이 없습니다.</div>
          ) : (
            <Masonry breakpointCols={breakpointColumns} className="style-masonry-grid" columnClassName="style-masonry-grid-column">
              {sellPosts.map((item, index) => (
                <div key={item.postId ?? index} className="style-post-card" onClick={() => navigate(`/sh-page/sh-view/${item.postId}`)}>
                  <div className="style-post-image">
                    <img src={item.firstFilePath} alt="상품" />
                    <div className="style-sell-info">
                    <div className="sell-title">{item.title}</div>
                    <div className="sell-price">{item.price.toLocaleString()}원</div>
                  </div>
                  </div>
                </div>
              ))}
            </Masonry>
          )}
        </div>
      )}

      {/* 찜 목록 */}
      {activeTab === "zzim" && (
        <div className="style-user-posts">
          {(!Array.isArray(zzimPosts) || zzimPosts.length === 0) ? (
            <div className="style-no-posts">찜한 게시물이 없습니다.</div>
          ) : (
            <Masonry breakpointCols={breakpointColumns} className="style-masonry-grid" columnClassName="style-masonry-grid-column">
              {zzimPosts.map((item, index) => (
                <div key={item.postId ?? index} className="style-post-card" onClick={() => navigate(`/sh-page/sh-view/${item.postId}`)}>
                  <div className="style-post-image">
                    <img src={item.firstFilePath} alt="찜 상품" />
                  </div>
                  <div className="style-sell-info">
                    <div className="sell-title">{item.title}</div>
                    <div className="sell-price">{item.price.toLocaleString()}원</div>
                  </div>
                </div>
              ))}
            </Masonry>
          )}
        </div>
      )}

      {/* 작성한 커뮤니티 게시글 */}
      {isMyProfile && activeTab === "myPosts" && (
        <div className="community">
          <div className='communityList'>
            {myCommunityPosts.length === 0 ? (
              <div className='noPosts'>작성한 커뮤니티 게시글이 없습니다.</div>
            ) : myCommunityPosts.map(post => (
              <div className='row' key={post.cpostId}>
                <div className='col title' onClick={() => navigate(`/communityView/${post.cpostId}`)}>
                  {post.title}
                </div>
                <div className='col author'>
                  {post.isAnonymous === 'Y' ? "익명" : post.member?.userid || post.userid || "알수없음"}
                </div>
                <div className='col date'>{post.indate?.substring(0,10)}</div>
                <div className='col actions'>
                  <button onClick={async () => {
                    if (!window.confirm("정말 삭제하시겠습니까?")) return;
                    try {
                      await jaxios.delete(`${baseURL}/communityList/deleteCommunity/${post.cpostId}`);
                      alert("삭제되었습니다.");
                      fetchMyCommunityPosts();
                    } catch (err) {
                      console.error(err);
                      alert("삭제 실패");
                    }
                  }}>삭제</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StyleUser;
