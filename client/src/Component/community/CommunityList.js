import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../../style/Community.css';

function CommunityList() {
    const [communityList, setCommunityList] = useState([]);
    const [paging, setPaging] = useState({});
    const [pages, setPages] = useState([]);
    const navigate = useNavigate();
    const loginUser = useSelector(state => state.user);
    const page = 1;

    useEffect(() => {
        axios.get(`http://localhost:8080/communityList/getCommunityList/${page}`)
            .then(res => {
                setCommunityList([...res.data.communityList]);
                setPaging(res.data.paging);

                const pageArr = [];
                for (let i = res.data.paging.beginPage; i <= res.data.paging.endPage; i++) {
                    pageArr.push(i);
                }
                setPages([...pageArr]);
            })
            .catch(err => {
                console.error(err);
            });
    }, [page]);

    function onCommunityView(num) {
        axios.post('http://localhost:8080/communityList/addReadCount', null, { params: { num } })
            .then(() => {
                navigate(`/communityView/${num}`);
            })
            .catch(err => {
                console.error(err);
            });
    }

    function onPageMove(p) {
        axios.get(`http://localhost:8080/communityList/getCommunityList/${p}`)
            .then(res => {
                setCommunityList([...res.data.communityList]);
                setPaging(res.data.paging);

                const pageArr = [];
                for (let i = res.data.paging.beginPage; i <= res.data.paging.endPage; i++) {
                    pageArr.push(i);
                }
                setPages([...pageArr]);
            })
            .catch(err => {
                console.error(err);
            });
    }

    function onCategoryClick(category) {
        console.log("선택된 카테고리:", category);
    }

    return (
        <>
            <div className='community'>
                <div className="sidebar">
                    <h3>카테고리</h3>
                    <ul>
                        <li onClick={() => onCategoryClick("자유게시판")}>자유게시판</li>
                        <li onClick={() => onCategoryClick("질문게시판")}>질문게시판</li>
                        <li onClick={() => onCategoryClick("살말")}>살말</li>
                        <li onClick={() => onCategoryClick("팔말")}>팔말</li>
                        <li onClick={() => onCategoryClick("시세")}>시세</li>
                        <li onClick={() => onCategoryClick("정품 감정")}>정품 감정</li>
                        <li onClick={() => onCategoryClick("핫딜")}>핫딜</li>
                    </ul>
                </div>

                <div className='communityList'>
                    <div className='titlerow'>
                        <div className='titlecol'>제목</div>
                        <div className='titlecol'>작성자</div>
                        <div className='titlecol'>작성일</div>
                        <div className='titlecol'>조회수</div>
                        <div className='titlecol'>좋아요</div>
                    </div>

                    {communityList.length === 0 ? (
                        <div className='noPost'>작성된 게시물이 없습니다</div>
                    ) : (
                        communityList.map((community, idx) => (
                            <div className='row' key={idx}>
                                <div className='col' onClick={() => onCommunityView(community.num)}>{community.title}</div>
                                <div className='col'>{community.userid}</div>
                                <div className='col'>{community.writedate?.substring(0, 10) || ""}</div>
                                <div className='col'>{community.readcount}</div>
                                <div className='col'>{community.like}</div>
                            </div>
                        ))
                    )}

                    <div id='paging'>
                        {paging.prev && <span onClick={() => onPageMove(paging.beginPage - 1)}>◀</span>}
                        {pages.map((page, idx) => (
                            <span key={idx} onClick={() => onPageMove(page)}>{page}</span>
                        ))}
                        {paging.next && <span onClick={() => onPageMove(paging.endPage + 1)}>▶</span>}
                    </div>
                </div>
            </div>

            {loginUser && loginUser.userid && (
                <div className="writeBtnArea">
                    <button className="writeBtn" onClick={() => navigate("/WriteCommunity")}>
                        글쓰기
                    </button>
                </div>
            )}
        </>
    );
}

export default CommunityList;
