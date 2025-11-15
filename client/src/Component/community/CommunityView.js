import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import axios from 'axios';
import jaxios from '../../util/jwtutil';
import '../../style/CommunityView.css';

const baseURL = process.env.REACT_APP_BASE_URL;

function CommunityView() {
    const loginUser = useSelector(state => state.user);
    const [community, setCommunity] = useState({}); // 초기값을 빈 객체로
    const navigate = useNavigate();
    const { num } = useParams();
    const [rContent, setRContent] = useState('');
    const [replyList, setReplyList] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                // 게시물 조회
                const communityResult = await axios.get(`${baseURL}/communityList/getCommunity/${num}`);
                setCommunity(communityResult.data.community || {}); // 데이터 없으면 빈 객체

                // 댓글 조회
                const replyResult = await axios.get(`${baseURL}/reply/getReply/${num}`);
                setReplyList(replyResult.data.replyList || []);
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, [num]);

    async function addReply() {
        if (!rContent.trim()) return alert('댓글을 입력해주세요.');
        try {
            await jaxios.post(`${baseURL}/api/reply/addReply`, {
                memberId: loginUser.member_id,
                content: rContent,
                cpostId: num
            });
            const result = await jaxios.get(`${baseURL}/api/reply/getReply/${num}`);
            setReplyList(result.data.replyList || []);
            setRContent('');
        } catch (err) {
            console.error(err);
        }
    }

    async function deleteReply(replyId) {
        if (window.confirm('해당 댓글을 삭제하시겠습니까?')) {
            try {
                await jaxios.delete(`${baseURL}/api/reply/deleteReply/${replyId}`);
                const result = await jaxios.get(`${baseURL}/api/reply/getReply/${num}`);
                setReplyList(result.data.replyList || []);
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
                    navigate('/communityList');
                })
                .catch((err) => console.error(err));
        }
    }

    return (
        <div className='communityView'>
            <h2>COMMUNITY VIEW</h2>

            <div className='field horizontal-info'>
                <div><strong>작성자:</strong> {community.member?.userid || '알수없음'}</div>
                <div><strong>작성일:</strong> {community.indate ? community.indate.substring(0, 10) : ''}</div>
                <div><strong>조회수:</strong> {community.readcount || 0}</div>
                <div><strong>추천수:</strong> {community.c_like || 0}</div>
            </div>

            <div className='field'>
                <label>제목</label>
                <div className="view-title-content">{community.title || ''}</div>
            </div>

            <div className='field'>
                <label>내용</label>
                <div className="view-content">{community.content || ''}</div>
            </div>

            {community.c_image && (
                <div className='field'>
                    <label>이미지</label>
                    <div>
                        <img
                            src={`${baseURL}/images/${community.c_image}`}
                            alt="community"
                            className="view-image"
                        />
                    </div>
                </div>
            )}

            <div className='btns'>
                <button onClick={() => navigate(`/updateCommunity/${num}`)}>수정</button>
                <button onClick={onDeleteCommunity}>삭제</button>
                <button onClick={() => navigate('/communityList')}>이전</button>
            </div>

            <div className="reply-section">
                <h3>댓글</h3>
                <div className="reply-input">
                    <textarea
                        rows="3"
                        value={rContent}
                        onChange={(e) => setRContent(e.currentTarget.value)}
                        placeholder="댓글을 입력하세요."
                    ></textarea>
                    <button onClick={addReply}>작성</button>
                </div>
                <div className="reply-list">
                    {replyList.map((reply) => (
                        <div key={reply.reply_id} className="reply-item">
                            <span className="reply-user">{reply.member?.userid || '알수없음'}</span> : 
                            <span className="reply-content">{reply.content}</span>
                            {reply.member?.member_id === loginUser.member_id && (
                                <button className="reply-delete" onClick={() => deleteReply(reply.reply_id)}>삭제</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CommunityView;
