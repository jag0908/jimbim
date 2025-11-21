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
    const [replyList, setReplyList] = useState([]);
    const [rContent, setRContent] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { num } = useParams();

    useEffect(() => {
        const fetchCommunityData = async () => {
            setLoading(true);
            try {
                const [communityRes, replyRes] = await Promise.all([
                    axios.get(`${baseURL}/communityList/getCommunity/${num}`),
                    axios.get(`${baseURL}/communityReply/getReply/${num}`)
                ]);

                setCommunity(communityRes.data.community || {});
                setReplyList(replyRes.data.replyList || []);
            } catch (err) {
                console.error('데이터 로딩 실패:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCommunityData();
    }, [num]);

    // 댓글 추가
    const addReply = async () => {
        if (!rContent.trim()) return alert('댓글을 입력해주세요.');

        try {
            await jaxios.post(`${baseURL}/communityReply/addReply`, { //수정
                content: rContent,
                memberId: loginUser.member_id, //수정
                cpostId: Number(num) //수정
            });

            const result = await axios.get(`${baseURL}/communityReply/getReply/${num}`);
            setReplyList(result.data.replyList || []);
            setRContent('');
        } catch (err) {
            console.error('댓글 작성 실패:', err);
        }
    };

    const deleteReply = async (replyId) => {
        if (!window.confirm('해당 댓글을 삭제하시겠습니까?')) return;
        try {
            await jaxios.delete(`${baseURL}/communityReply/deleteReply/${replyId}`);
            setReplyList(prev => prev.filter(reply => reply.replyId !== replyId));
        } catch (err) {
            console.error('댓글 삭제 실패:', err);
        }
    };

    const deleteCommunity = async () => {
        if (!window.confirm('게시물을 삭제하시겠습니까?')) return;
        try {
            await jaxios.delete(`${baseURL}/communityList/deleteCommunity/${num}`); //수정
            alert('게시물이 삭제 되었습니다');
            navigate('/communityList');
        } catch (err) {
            console.error('게시물 삭제 실패:', err);
        }
    };

    if (loading) return <div>로딩 중...</div>;

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
                    <img src={`${baseURL}/images/${community.c_image}`} alt="community" className="view-image" />
                </div>
            )}

            <div className='btns'>
                <button onClick={() => navigate(`/updateCommunity/${num}`)}>수정</button>
                <button onClick={deleteCommunity}>삭제</button>
                <button onClick={() => navigate('/communityList')}>이전</button>
            </div>

            <div className="reply-section">
                <h3>댓글</h3>
                <div className="reply-input">
                    <textarea
                        rows="3"
                        value={rContent}
                        onChange={(e) => setRContent(e.target.value)}
                        placeholder="댓글을 입력하세요."
                    />
                    <button onClick={addReply}>작성</button>
                </div>

                <div className="reply-list">
                    {replyList.map((reply) => (
                        <div key={reply.replyId} className="reply-item">
                            <span className="reply-user">{reply.userid || '알수없음'}</span> : {/*수정*/}
                            <span className="reply-content">{reply.content}</span>

                            {reply.memberId === loginUser.member_id && ( /*수정*/
                                <button
                                    className="reply-delete"
                                    onClick={() => deleteReply(reply.replyId)}
                                >
                                    삭제
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CommunityView;
