import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import axios from 'axios';
import jaxios from '../../util/jwtutil';
import '../../style/CommunityView.css';

const baseURL = process.env.REACT_APP_BASE_URL;

function CommunityView() {
    const loginUser = useSelector(state => state.user);
    const [community, setCommunity] = useState({});
    const navigate = useNavigate();
    const { num } = useParams();
    const [curDateTime, setCurDateTime] = useState('');
    const [rContent, setRContent] = useState('');
    const [replyList, setReplyList] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                // 글 조회
                const communityResult = await axios.get(`${baseURL}/communityList/getCommunity/${num}`);
                setCommunity(communityResult.data.post);

                // 댓글 조회
                const replyResult = await axios.get(`${baseURL}/reply/getReply/${num}`);
                setReplyList([...replyResult.data.replyList]);
                
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, [num]);


    async function addReply() {
        try {
            await jaxios.post(`${baseURL}/api/reply/addReply`, {
                userid: loginUser.userid,
                content: rContent,
                communitynum: num
            });
            const result = await jaxios.get(`${baseURL}/api/reply/getReply/${num}`);
            setReplyList([...result.data.replyList]);
            setRContent('');
        } catch (err) {
            console.error(err);
        }
    }

    async function deleteReply(replynum) {
        if (window.confirm('해당 댓글을 삭제하시겠습니까?')) {
            try {
                await jaxios.delete(`${baseURL}/api/reply/deleteReply/${replynum}`);
                const result = await jaxios.get(`${baseURL}/api/reply/getReply/${num}`);
                setReplyList([...result.data.replyList]);
            } catch (err) {
                console.error(err);
            }
        }
    }

    function onDeleteCommunity() {
        if (window.confirm('게시물을 삭제하시겠습니까?')) {
            jaxios.delete(`${baseURL}/api/community/deleteCommunity/${num}`)
                .then(() => {
                    alert('게시물이 삭제 되었습니다');
                    navigate('/main');
                })
                .catch((err) => console.error(err));
        }
    }

    return (
        <div className='communityView'>
            <h2>COMMUNITY VIEW</h2>
            <div className='field'>
                <label>작성자</label>
                <div>{community.member?.userid}</div>
            </div>
            <div className='field'>
                <label>조회수</label>
                <div>{community.readcount}</div>
            </div>
            <div className='field'>
                <label>작성일</label>
                <div>{community.indate ? community.indate.substring(0, 10) : ''}</div>
            </div>
            <div className='field'>
                <label>제목</label>
                <div>{community.title}</div>
            </div>
            <div className='field'>
                <label>내용</label>
                <div>{community.content}</div>
            </div>
            <div className='field'>
                <label>이미지</label>
                {community.c_image && (
                    <div>
                        <img
                            src={`${baseURL}/images/${community.c_image}`}
                            style={{ height: '250px' }}
                            alt="community"
                        />
                    </div>
                )}
            </div>
            <div className='btns'>
                <button onClick={() => navigate(`/updateCommunity/${num}`)}>수정</button>
                <button onClick={onDeleteCommunity}>삭제</button>
                <button onClick={() => navigate('/communityList')}>이전</button>
            </div>
        </div>
    );
}

export default CommunityView;
