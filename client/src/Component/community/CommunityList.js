import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import axios from 'axios';
import jaxios from '../../util/jwtutil';
import '../../style/Community.css';

const baseURL = process.env.REACT_APP_BASE_URL;

function CommunityList() {

    const [communityList, setCommunityList] = useState([]);
    const [paging, setPaging] = useState({ page: 1, prev: false, next: false, beginPage: 1, endPage: 1 });
    const [pages, setPages] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(0);
    const [searchCategoryId, setSearchCategoryId] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState("");

    const [noticeList, setNoticeList] = useState([]);

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

    const fetchCommunityList = useCallback((page, categoryId, keyword = "") => {

        if(page===1){
            axios.get('/api/communityList/getNoticeList')
            .then((result)=> setNoticeList(result.data.noticeList))
            .catch((err)=> console.error(err));
        }

        let url = `${baseURL}/communityList/getCommunityList/${page}?title=${encodeURIComponent(keyword)}&categoryId=${categoryId}`;

        axios.get(url)
            .then(res => {
                const list = res.data.communityList || [];
                setCommunityList(list.sort((a,b)=> new Date(b.indate) - new Date(a.indate)));

                const pg = res.data.paging;
                setPaging(pg);

                const pArr = [];
                for(let i = pg.beginPage; i <= pg.endPage; i++){
                    pArr.push(i);
                }
                setPages(pArr);
            })
            .catch(err=> {
                console.error(err);
                alert("게시글 로딩 실패");
            });
    }, []);

    useEffect(() => {
        fetchCommunityList(1, selectedCategoryId); 
    }, [fetchCommunityList, selectedCategoryId]);

    const onSearch = () => {
        setSelectedCategoryId(searchCategoryId);
        fetchCommunityList(1, searchCategoryId, searchKeyword.trim());
    };

    const onPageMove = (page) => {
        fetchCommunityList(page, selectedCategoryId, searchKeyword.trim());
    };

    const onCommunityView = (id) => {
        jaxios.post(`${baseURL}/communityList/addReadCount?num=${id}`).catch(()=>{});
        navigate(`/communityView/${id}`);
    };

    const onDelete = async (id) => {
        if(!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            await jaxios.delete(`${baseURL}/communityList/deleteCommunity/${id}`);
            alert("삭제되었습니다.");
            onPageMove(paging.page);
        } catch(e){
            console.error(e);
            alert("삭제 실패");
        }
    };

    const onWrite = () => {
        if(!loginUser?.userid){
            alert("로그인이 필요합니다");
            navigate("/login");
            return;
        }
        navigate("/writeCommunity");
    };

    return (
        <>
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
                        placeholder="검색어를 입력하세요"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onKeyDown={(e) => { if(e.key === "Enter") onSearch(); }}
                    />

                    <button onClick={onSearch}>검색</button>
                </div>

                <button className="writeBtn" onClick={onWrite}>글쓰기</button>
            </div>

            <div className='community'>
                <div className="sidebar">
                    <h3>카테고리</h3>
                    <ul>
                        {categories.map(c => (
                            <li key={c.id}
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

                <div className='communityList'>
                    <div className='titlerow'>
                        <div className='col title'>제목</div>
                        <div className='col author'>작성자</div>
                        <div className='col date'>작성일</div>
                        <div className='col count'>조회수</div>
                    </div>

                    {/* 공지사항 */}
                    {noticeList.length > 0 && noticeList.map(post => (
                        <div className='row notice' key={post.cpostId} onClick={() => onCommunityView(post.cpostId)}>
                            <div className='col title'>
                                <div className="title-wrapper">
                                    <span className="notice-icon" role="img" aria-label="notice-icon">📢</span>
                                    <span className="title-text">&nbsp;{post.title}</span>
                                    <span className="comment-count">[{post.replyCount ?? 0}]</span>
                                </div>
                            </div>
                            <div className='col author'>
                                {post.isAnonymous === 'Y'
                                    ? "익명"
                                    : post.member?.userid || post.userid || "알수없음"}
                            </div>
                            <div className='col date'>{post.indate?.substring(0,10)}</div>
                            <div className='col count'>{post.readcount ?? post.readCount ?? 0}</div>
                        </div>
                    ))}

                    {/* 일반 게시글 */}
                    {communityList.length === 0 ? (
                        <div className='noPosts'>게시물이 없습니다.</div>
                    ) : communityList.map(post => (
                        <div className='row' key={post.cpostId} onClick={() => onCommunityView(post.cpostId)}>
                            <div className='col title'>
                                <div className="title-wrapper">
                                    {post.fileList && post.fileList.length > 0 ? (
                                        <span className="icon" role="img" aria-label="image-icon">📷</span>
                                    ) : (
                                        <span className="icon" role="img" aria-label="text-icon">📄</span>
                                    )}
                                    <span className="title-text">&nbsp;{post.title || '제목 없음'}</span>
                                    <span className="comment-count">[{post.replyCount ?? 0}]</span>
                                </div>
                            </div>
                            <div className='col author'>
                                {post.isAnonymous === 'Y'
                                    ? "익명"
                                    : post.member?.userid || post.userid || "알수없음"}
                            </div>
                            <div className='col date'>{post.indate?.substring(0,10)}</div>
                            <div className='col count'>{post.readcount ?? post.readCount ?? 0}</div>
                        </div>
                    ))}

                    <div id='paging'>
                        {paging.prev && <span onClick={() => onPageMove(Math.max(1, paging.page - 1))}>◀</span>}
                        {pages.map(p => (
                            <span
                                key={p}
                                onClick={() => onPageMove(p)}
                                className={p === paging.page ? "active" : ""}
                            >
                                {p}
                            </span>
                        ))}
                        {paging.next && <span onClick={() => onPageMove(Math.min(paging.endPage, paging.page + 1))}>▶</span>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default CommunityList;
