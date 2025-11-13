import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import { logoutAction } from '../../store/userSlice';
import jaxios from '../../util/jwtutil';
import '../../style/Community.css';

const baseURL = process.env.REACT_APP_BASE_URL;

function CommunityList() {
    const [communityList, setCommunityList] = useState([]);
    const navigate = useNavigate();
    const loginUser = useSelector(state => state.user);
    const cookies = new Cookies();
    const [paging, setPaging] = useState({});
    const [pages, setPages] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        axios.get(`${baseURL}/communityList/getCommunityList/1`, {
            headers: { 'Authorization': `Bearer ${loginUser.accessToken}` },
        })
        .then((result) => {
            if (result.data.error) {
                alert(result.data.error);
                dispatch(logoutAction());
                navigate('/');
            } else {
                setCommunityList([...result.data.communityList]);
                setPaging(result.data.paging);

                const pageArr = [];
                for (let i = result.data.paging.beginPage; i <= result.data.paging.endPage; i++) {
                    pageArr.push(i);
                }
                setPages([...pageArr]);
            }
        })
        .catch((err) => {
            console.error(err);
            alert('게시글 불러오기 실패');
        });
    }, []);

    function onPageMove(p) {
        axios.get(`${baseURL}/communityList/getCommunityList/${p}`, {
            headers: { 'Authorization': `Bearer ${loginUser.accessToken}` },
        })
        .then((result) => {
            setCommunityList([...result.data.communityList]);
            setPaging(result.data.paging);

            const pageArr = [];
            for (let i = result.data.paging.beginPage; i <= result.data.paging.endPage; i++) {
                pageArr.push(i);
            }
            setPages([...pageArr]);
        })
        .catch((err) => console.error(err));
    }

    function onCommunityView(cpost_id) {
        jaxios.post(`${baseURL}/communityList/addReadCount?num=${cpost_id}`, null, { params: { num: cpost_id } })
            .then(() => {
                navigate(`/communityView/${cpost_id}`);
            })
            .catch((err) => console.error(err));
    }

    function onCategoryClick(category) {
        console.log("선택된 카테고리:", category);
    }

    return (
        <>
            {loginUser && loginUser.userid && (
                <div className="writeBtnArea top">
                    <button className="writeBtn" onClick={() => navigate("/WriteCommunity")}>
                        글쓰기
                    </button>
                </div>
            )}

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
                        <div className='noPosts'>작성된 게시물이 없습니다</div>
                    ) : (
                        communityList.map((community, idx) => (
                            <div className='row' key={idx}>
                                <div className='col' onClick={() => onCommunityView(community.cpost_id)}>
                                    {community.title}
                                </div>
                                <div className='col'>{community.member?.userid}</div>
                                <div className='col'>{community.indate?.substring(0, 10) || ""}</div>
                                <div className='col'>{community.readcount}</div>
                                <div className='col'>{community.c_like}</div>
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
        </>
    );
}

export default CommunityList;
