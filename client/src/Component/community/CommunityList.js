import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import axios from 'axios';
import jaxios from '../../util/jwtutil';
import '../../style/Community.css';

const baseURL = process.env.REACT_APP_BASE_URL;

function CommunityList() {

    // 리스트 관련 상태
    const [communityList, setCommunityList] = useState([]);
    const [noticeList, setNoticeList] = useState([]);

    // 페이징 (백엔드 페이지)
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // 검색 / 카테고리
    const [selectedCategoryId, setSelectedCategoryId] = useState(0);
    const [searchCategoryId, setSearchCategoryId] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState("");

    // ref
    const listRef = useRef(null);

    const loginUser = useSelector(state => state.user);
    const navigate = useNavigate();

    const categories = [
        { id: 0, name: "전체게시판" },
        { id: 1, name: "자유게시판" },
        { id: 2, name: "질문게시판" },
        { id: 3, name: "살말" },
        { id: 4, name: "팔말" },
        { id: 5, name: "시세" },
        { id: 6, name: "정품 감정" },
        { id: 7, name: "핫딜" }
    ];

    /** -----------------------------
     *  📌 데이터 로딩 함수
     * ----------------------------- */
    const fetchCommunityList = useCallback(async (currentPage, categoryId, keyword = "") => {
        try {
            setLoading(true);

            // page=1일 때 공지 가져오기
            if (currentPage === 1) {
                const noticeRes = await axios.get('/api/communityList/getNoticeList');
                setNoticeList(noticeRes.data.noticeList || []);
            }

            const url = `${baseURL}/communityList/getCommunityList/${currentPage}?title=${encodeURIComponent(keyword)}&categoryId=${categoryId}`;
            const res = await axios.get(url);

            const list = res.data.communityList || [];

            if (currentPage === 1) {
                setCommunityList(list);
            } else {
                setCommunityList(prev => [...prev, ...list]);
            }

            // 다음 페이지 존재 여부
            if (list.length < 10) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    /** -----------------------------
     *  📌 카테고리 변경 시 초기화
     * ----------------------------- */
    useEffect(() => {
        setPage(1);
        setHasMore(true);
        fetchCommunityList(1, selectedCategoryId, searchKeyword);
    }, [selectedCategoryId, fetchCommunityList]);

    /** -----------------------------
     *  📌 스크롤 감지 (부드럽게)
     * ----------------------------- */
    useEffect(() => {
        const listBox = listRef.current;
        if (!listBox) return;

        const handleScroll = () => {
            if (loading || !hasMore) return;

            const { scrollTop, clientHeight, scrollHeight } = listBox;
            const scrollPercent = (scrollTop + clientHeight) / scrollHeight;

            if (scrollPercent > 0.8) {
                setPage(prev => prev + 1);
            }
        };

        listBox.addEventListener("scroll", handleScroll);
        return () => listBox.removeEventListener("scroll", handleScroll);

    }, [loading, hasMore]);

    /** -----------------------------
     *  📌 page 변경 시 다음 데이터 로딩
     * ----------------------------- */
    useEffect(() => {
        if (page > 1) {
            fetchCommunityList(page, selectedCategoryId, searchKeyword);
        }
    }, [page, selectedCategoryId, searchKeyword, fetchCommunityList]);

    /** -----------------------------
     *  📌 나머지 이벤트 함수
     * ----------------------------- */
    const onSearch = () => {
        setSelectedCategoryId(searchCategoryId);
        setPage(1);
        setHasMore(true);
        fetchCommunityList(1, searchCategoryId, searchKeyword.trim());
    };

    const onCommunityView = (id) => {
        jaxios.post(`${baseURL}/communityList/addReadCount?num=${id}`).catch(() => {});
        navigate(`/communityView/${id}`);
    };

    const onWrite = () => {
        if (!loginUser?.userid) {
            alert("로그인이 필요합니다");
            navigate("/login");
            return;
        }
        navigate("/writeCommunity");
    };

    return (
        <>
            {/* 검색 + 글쓰기 */}
            <div className="writeBtnArea top" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="searchArea" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <select
                        value={searchCategoryId}
                        onChange={(e) => setSearchCategoryId(Number(e.target.value))}
                    >
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="검색어 입력"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") onSearch(); }}
                    />

                    <button className="searchBtn" onClick={onSearch}>검색</button>
                </div>

                <button className="writeBtn" onClick={onWrite}>글쓰기</button>
            </div>

            <div className='community'>
                {/* 사이드바 */}
                <div className="sidebar">
                    <h3>카테고리</h3>
                    <ul>
                        {categories.map(c => (
                            <li
                                key={c.id}
                                className={selectedCategoryId === c.id ? "active" : ""}
                                onClick={() => {
                                    setSelectedCategoryId(c.id);
                                    setSearchKeyword("");
                                    setSearchCategoryId(0);
                                }}
                            >
                                {c.name}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 게시글 리스트 (내부 스크롤) */}
                <div className='communityList' ref={listRef}>
                    {/* 고정 헤더 */}
                    <div className='titlerow sticky'>
                        <div className='col title'>제목</div>
                        <div className='col author'>작성자</div>
                        <div className='col date'>작성일</div>
                        <div className='col count'>조회수</div>
                    </div>

                    {/* 공지 */}
                    {page === 1 && noticeList.length > 0 && noticeList.map(post => (
                        <div className='row notice' key={post.cpostId} onClick={() => onCommunityView(post.cpostId)}>
                            <div className='col title'>
                                <div className="title-wrapper">
                                    <span className="notice-icon">📢</span>
                                    <span className="title-text">&nbsp;{post.title}</span>
                                    {post.replyCount > 0 && <span className="comment-count">[{post.replyCount}]</span>}
                                </div>
                            </div>
                            <div className='col author'>
                                {post.isAnonymous === 'Y' ? "익명" : post.member?.userid || post.userid}
                            </div>
                            <div className='col date'>{post.indate?.substring(0, 10)}</div>
                            <div className='col count'>{post.readcount}</div>
                        </div>
                    ))}

                    {/* 일반 게시글 */}
                    {communityList.map(post => (
                        <div className='row' key={post.cpostId} onClick={() => onCommunityView(post.cpostId)}>
                            <div className='col title'>
                                <div className="title-wrapper">
                                    {post.fileList?.length > 0 ? <span className="icon">📷</span> : <span className="icon">📄</span>}
                                    <span className="title-text">&nbsp;{post.title}</span>
                                    {post.replyCount > 0 && <span className="comment-count">[{post.replyCount}]</span>}
                                </div>
                            </div>
                            <div className='col author'>
                                {post.isAnonymous === 'Y' ? "익명" : post.member?.userid || post.userid}
                            </div>
                            <div className='col date'>{post.indate?.substring(0, 10)}</div>
                            <div className='col count'>{post.readcount}</div>
                        </div>
                    ))}

                    {/* 로딩 표시 */}
                    {loading && (
                        <div style={{ padding: "20px", textAlign: "center" }}>로딩 중...</div>
                    )}
                </div>
            </div>
        </>
    );
}

export default CommunityList;
