import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import axios from 'axios';
import jaxios from '../../util/jwtutil';
import '../../style/Community.css';

const baseURL = process.env.REACT_APP_BASE_URL;

function CommunityList() {
    const [communityList, setCommunityList] = useState([]);
    const [paging, setPaging] = useState({
        page: 1,
        prev: false,
        next: false,
        beginPage: 1,
        endPage: 1
    });
    const [pages, setPages] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(0);
    const navigate = useNavigate();
    const loginUser = useSelector(state => state.user);

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

    useEffect(() => {
        fetchCommunityList(1, selectedCategoryId);
    }, [selectedCategoryId]);

    function fetchCommunityList(page, categoryId) {
        const url = categoryId === 0
            ? `${baseURL}/communityList/getCommunityList/${page}`
            : `${baseURL}/communityList/getCommunityList/${page}?categoryId=${categoryId}`;

        axios.get(url)
            .then(result => {
                if(result.data.error) {
                    console.error(result.data.error);
                    return;
                }
                const sortedList = (result.data.communityList || []).sort((a,b) => new Date(b.indate) - new Date(a.indate));
                setCommunityList(sortedList);

                const newPaging = result.data.paging || {};
                setPaging({
                    page: newPaging.page || 1,
                    prev: newPaging.prev || false,
                    next: newPaging.next || false,
                    beginPage: newPaging.beginPage || 1,
                    endPage: newPaging.endPage || 1
                });

                const pageArr = [];
                const begin = newPaging.beginPage || 1;
                const end = newPaging.endPage || 1;
                for(let i = begin; i <= end; i++) {
                    pageArr.push(i);
                }
                setPages(pageArr);
            })
            .catch(err => {
                console.error(err);
                alert('게시글 불러오기 실패');
            });
    }

    function onPageMove(p) {
        fetchCommunityList(p, selectedCategoryId);
    }

    function onCommunityView(cpostId) { //수정
        const request = loginUser?.accessToken 
            ? jaxios.post(`${baseURL}/communityList/addReadCount`, null, { params: { num: cpostId } }) //수정
            : axios.post(`${baseURL}/communityList/addReadCount`, null, { params: { num: cpostId } }); //수정

        request
            .catch(err => console.error(err))
            .finally(() => navigate(`/communityView/${cpostId}`)); //수정
    }

    function onCategoryClick(categoryId) {
        setSelectedCategoryId(categoryId);
    }

    function onWriteClick() {
        if(!loginUser || !loginUser.userid) {
            alert("로그인이 필요한 서비스입니다.");
            navigate("/login");
        } else {
            navigate("/writeCommunity");
        }
    }

    return (
        <>
            {/* 글쓰기 버튼 항상 상단 */}
            <div className="writeBtnArea top">
                <button className="writeBtn" onClick={onWriteClick}>
                    글쓰기
                </button>
            </div>

            <div className='community'>
                <div className="sidebar">
                    <h3>카테고리</h3>
                    <ul>
                        {categories.map(cat => (
                            <li
                                key={cat.id}
                                onClick={() => onCategoryClick(cat.id)}
                                className={selectedCategoryId === cat.id ? "active" : ""}
                            >
                                {cat.name}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className='communityList'>
                    <div className='titlerow'>
                        <div className='titlecol'>제목</div>
                        <div className='titlecol'>작성자</div>
                        <div className='titlecol'>작성일</div>
                        <div className='titlecol'>조회수</div>
                    </div>

                    {communityList.length === 0 ? (
                        <div className='noPosts'>작성된 게시물이 없습니다</div>
                    ) : (
                        communityList.map((community, idx) => (
                            <div className='row' key={idx}>
                                <div className='col' onClick={() => onCommunityView(community.cpostId)}> {/*수정*/}
                                    {community.title}
                                </div>
                                <div className='col'>{community.userid || community.member?.userid}</div>
                                <div className='col'>{community.indate?.substring(0, 10) || ""}</div>
                                <div className='col'>{community.readcount}</div>
                            </div>
                        ))
                    )}

                    <div id='paging'>
                        {paging.prev && <span onClick={() => onPageMove(paging.beginPage - 1)}>◀</span>}
                        {pages.map((page, idx) => (
                            <span
                                key={idx}
                                onClick={() => onPageMove(page)}
                                className={page === paging.page ? "active" : ""}
                            >
                                {page}
                            </span>
                        ))}
                        {paging.next && <span onClick={() => onPageMove(paging.endPage + 1)}>▶</span>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default CommunityList;
