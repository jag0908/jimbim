import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jaxios from "../../util/jwtutil";
import "../../style/StyleUser.css";
import { useNavigate } from "react-router-dom";
import Masonry from "react-masonry-css";
import { Cookies } from "react-cookie";
import StyleFollowList from "./StyleFollowList";

const baseURL = process.env.REACT_APP_BASE_URL;

function StyleUser() {
  const { userid } = useParams(); // URL에서 유저 아이디 가져오기
  const [userInfo, setUserInfo] = useState(null);
  const [followType, setFollowType] = useState("followers");
  const [openFollowModal, setOpenFollowModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("style");
  const [sellPosts, setSellPosts] = useState([]);
  const [zzimPosts, setZzimPosts] = useState([]);
 
  const cookies = new Cookies();
  const currentUser = cookies.get("user");
  const myUserid = currentUser?.userid; 
  const navigate = useNavigate();

  // ✅ 유저 정보 + 팔로워/팔로잉 수 불러오기
  const fetchUserInfo = async () => {
    try {
      const res = await jaxios.get(`${baseURL}/style/userinfo/${userid}`);
      setUserInfo(res.data);

      // 판매 목록도 바로 세팅
      if (res.data.sellPosts) {
        setSellPosts(res.data.sellPosts);
      }

      return res.data?.memberId;
    } catch (err) {
      console.error("유저 정보 불러오기 실패", err);
    }
  };


  // ✅ 판매 목록 불러오기
  const fetchUserSellPosts = async (memberId) => {
    if (!memberId) return;
    try {
      const res = await jaxios.get(`${baseURL}/sh-page/user-sell-list/${memberId}`);
      setSellPosts(res.data.sellPosts);
    } catch (err) {
      console.error("판매 목록 불러오기 실패", err);
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

  // 찜 목록 
  const fetchZzimPosts = async () => {
    if (!userInfo?.memberId) return;
    try {
      const res = await jaxios.get(`${baseURL}/style/zzim-list/${userInfo.memberId}`);
      // res.data 자체가 배열이면 그대로 set
      setZzimPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("찜 목록 불러오기 실패", err);
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

  // 팔로워 클릭
  const openFollowers = () => {
    setFollowType("followers");
    setOpenFollowModal(true);
  };

  // 팔로잉 클릭
  const openFollowing = () => {
    setFollowType("following");
    setOpenFollowModal(true);
  };

  // 초기 로드
  useEffect(() => {
    const loadData = async () => {
      const memberId = await fetchUserInfo(); // memberId를 받아옴
      fetchUserPosts();
      checkFollowStatus();
    };
    loadData();
  }, [userid, myUserid]);

  // activeTab 변경 시 판매 목록 가져오기
  useEffect(() => {
    if (userInfo?.memberId && activeTab === "sell") { 
      fetchUserSellPosts(userInfo.memberId);
    }
    if (activeTab === "zzim" && userInfo?.memberId) {
      fetchZzimPosts();
    }

  }, [userInfo, activeTab]);

  if (!userInfo) return <div>로딩 중...</div>;

  const isMyProfile = myUserid === userid;

  const breakpointColumns = {
    default: 4,
    1200: 3,
    768: 2,
    480: 1
  };

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
            <span onClick={openFollowers} className="clickable">
              팔로워 {userInfo.followers ?? 0}
            </span>
            <span onClick={openFollowing} className="clickable">
              팔로잉 {userInfo.following ?? 0}
            </span>
          </div>

          {userInfo.intro && <p className="style-intro-text">{userInfo.intro}</p>}
        </div>
      </div>

      {/* 팔로우/팔로잉 모달 */}
      {openFollowModal && (
        <StyleFollowList
          open={openFollowModal}
          onClose={() => setOpenFollowModal(false)}
          memberId={userInfo.memberId}
          type={followType}
        />
      )}

      {/* ✅ 카테고리 탭 */}
      <div className="style-user-tabs">
        <button
          className={activeTab === "style" ? "tab active" : "tab"}
          onClick={() => setActiveTab("style")}
        >
          Style
        </button>

        <button
          className={activeTab === "sell" ? "tab active" : "tab"}
          onClick={() => {
            setActiveTab("sell");
            setOpenFollowModal(false);   // ← 추가!!!
          }}
        >
          판매 목록
        </button>

        <button
          className={activeTab === "zzim" ? "tab active" : "tab"}
          onClick={() => setActiveTab("zzim")}
        >
          찜 목록
        </button>
      </div>

      {/* ⭐ Style 탭 */}
      {activeTab === "style" && (
        <div className="style-user-posts">
          {posts.length === 0 ? (
            <div className="style-no-posts">아직 게시글이 없습니다.</div>
          ) : (
            <Masonry
              breakpointCols={breakpointColumns}
              className="style-masonry-grid"
              columnClassName="style-masonry-grid-column"
            >
              {posts.map((post, index) => (
                <div 
                  key={post.spost_id ?? `post-${index}`}
                  className="style-post-card"
                >
                  <div className="style-post-image" onClick={() => navigate(`/style/${post.spost_id}`)}>
                    <img
                      src={Array.isArray(post.s_images) ? post.s_images[0] : post.s_images}
                      alt="post"
                    />
                    <div className="style-view-count">👁 {post.viewCount ?? 0}</div>
                  </div>
                  <div className="style-post-info">
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
            </Masonry>
          )}
        </div>
      )}

      {/* ⭐ 판매 목록 탭 */}
      {activeTab === "sell" && (
        <div className="style-user-posts">
          {sellPosts.length === 0 ? (
            <div className="style-no-posts">등록된 판매 상품이 없습니다.</div>
          ) : (
            <Masonry
              breakpointCols={breakpointColumns}
              className="style-masonry-grid"
              columnClassName="style-masonry-grid-column"
            >
              {sellPosts.map((item, index) => (
                <div
                  key={item.postId ?? `sell-${index}`}
                  className="style-post-card"
                  onClick={() => {
                    if(item.postId){
                      navigate(`/sh-page/sh-view/${item.postId}`);
                    } else {
                      alert("잘못된 상품입니다.");
                    }
                  }}

                >
                  <div className="style-post-image">
                    <img src={item.firstFilePath} alt="상품" />
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

      {/* ⭐ 찜 탭 (추후 추가) */}
      {activeTab === "zzim" && (
        <div className="style-user-posts">
          {(!Array.isArray(zzimPosts) || zzimPosts.length === 0) ? (
            <div className="style-no-posts">찜한 게시물이 없습니다.</div>
          ) : (
            <Masonry
              breakpointCols={breakpointColumns}
              className="style-masonry-grid"
              columnClassName="style-masonry-grid-column"
            >
              {zzimPosts.map((item, index) => (
                <div
                  key={item.postId ?? `zzim-${index}`}
                  className="style-post-card"
                  onClick={() => navigate(`/sh-page/sh-view/${item.postId}`)}
                >
                  <div className="style-post-image">
                    <img src={item.firstFilePath || "/default_image.png"} alt="찜한 상품" />
                  </div>
                  <div className="style-sell-info">
                    <div className="sell-title">{item.title}</div>
                    <div className="sell-price">{item.price?.toLocaleString() ?? 0}원</div>
                  </div>
                </div>
              ))}
            </Masonry>
          )}
        </div>
      )}

    </div>
  );
}

export default StyleUser;