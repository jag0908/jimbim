import { useEffect, useState } from "react";
import jaxios from "../../util/jwtutil";
import { useNavigate } from "react-router-dom";
import "../../style/StyleFollowList.css";

const baseURL = process.env.REACT_APP_BASE_URL;

function StyleFollowList({ open, onClose, memberId, type }) {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;

    const fetchList = async () => {
      try {
        const url =
          type === "followers"
            ? `${baseURL}/style/follow/list/followers/${memberId}`
            : `${baseURL}/style/follow/list/following/${memberId}`;

        const res = await jaxios.get(url);
        setList(res.data);
      } catch (err) {
        console.error("리스트 로딩 실패", err);
      }
    };

    fetchList();
  }, [open, type, memberId]);

  const handleFollowToggle = async (targetUserid) => {
    try {
      const res = await jaxios.post(`${baseURL}/style/follow`, {
        targetUserid,
      });

      setList((prev) =>
        prev.map((u) =>
          u.userid === targetUserid
            ? { ...u, isFollowing: res.data.followed }
            : u
        )
      );
    } catch (err) {
      console.error("팔로우 토글 실패", err);
    }
  };

  const filtered = list.filter(
    (u) =>
      u.userid.includes(search) ||
      u.nickname?.includes(search)
  );

  if (!open) return null;

  return (
    <div className="follow-modal-overlay" onClick={onClose}>
      <div
        className="follow-modal-content"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록
      >
        {/* --- 헤더 --- */}
        <div className="follow-header">
          <span>{type === "followers" ? "팔로워" : "팔로잉"}</span>
          <button className="follow-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* --- 검색창 --- */}
        <div className="follow-search-box">
          <input
            type="text"
            placeholder="검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* --- 리스트 --- */}
        <div className="follow-list">
          {filtered.map((user) => (
            <div className="follow-item" key={user.userid}>
              <div className="follow-item-left">
                <img
                  src={user.profileImg || "/default_profile.png"}
                  alt=""
                  onClick={() => navigate(`/styleUser/${user.userid}`)}
                />

                <div
                  className="f-info"
                  onClick={() => navigate(`/styleUser/${user.userid}`)}
                >
                  <div className="nickname">{user.nickname || user.userid}</div>
                  <div className="userid">@{user.userid}</div>
                </div>
              </div>

              <button
                className={`f-btn ${user.isFollowing ? "following" : ""}`}
                onClick={() => handleFollowToggle(user.userid)}
              >
                {user.isFollowing ? "팔로잉" : "팔로우"}
              </button>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="empty">검색 결과 없음</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StyleFollowList;
