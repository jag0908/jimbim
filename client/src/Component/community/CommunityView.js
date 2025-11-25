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
    const [liked, setLiked] = useState(false);
    const navigate = useNavigate();
    const { num } = useParams();

    useEffect(() => {
        const fetchCommunityData = async () => {
            setLoading(true);
            try {
                const [communityRes, replyRes] = await Promise.all([
                    axios.get(`${baseURL}/communityList/getCommunity/${num}`, {
                        params: { memberId: loginUser?.member_id } 
                    }),
                    axios.get(`${baseURL}/communityReply/getReply/${num}`)
                ]);

                setCommunity(communityRes.data.community || {});
                setLiked(communityRes.data.liked || false); 
                setReplyList(replyRes.data.replyList || []);
            } catch (err) {
                console.error('데이터 로딩 실패:', err);
                alert('게시글을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchCommunityData();
    }, [num, loginUser?.member_id]);

    const addReply = async () => {
        if (!loginUser?.member_id) return alert('로그인이 필요한 서비스입니다.');
        if (!rContent.trim()) return alert('댓글을 입력해주세요.');

        try {
            await jaxios.post(`${baseURL}/communityReply/addReply`, {
                content: rContent,
                memberId: loginUser.member_id,
                cpostId: Number(num)
            });

            const result = await axios.get(`${baseURL}/communityReply/getReply/${num}`);
            setReplyList(result.data.replyList || []);
            setRContent('');
        } catch (err) {
            console.error('댓글 작성 실패:', err);
            alert('댓글 작성에 실패했습니다.');
        }
    };

    const deleteReply = async (replyId) => {
        if (!window.confirm('해당 댓글을 삭제하시겠습니까?')) return;
        try {
            await jaxios.delete(`${baseURL}/communityReply/deleteReply/${replyId}`);
            setReplyList(prev => prev.filter(reply => reply.replyId !== replyId));
            alert('댓글이 삭제되었습니다.');
        } catch (err) {
            console.error('댓글 삭제 실패:', err);
            alert('댓글 삭제에 실패했습니다.');
        }
    };

    const deleteCommunity = async () => {
        if (!window.confirm('게시물을 삭제하시겠습니까?')) return;
        try {
            await jaxios.delete(`${baseURL}/communityList/deleteCommunity/${num}`);
            alert('게시물이 삭제 되었습니다');
            navigate('/communityList');
        } catch (err) {
            console.error('게시물 삭제 실패:', err);
            alert('게시물 삭제에 실패했습니다.');
        }
    };

    const handleLike = async () => {
        if (!loginUser?.member_id) return alert('로그인이 필요합니다.');

        try {
            const res = await jaxios.post(`${baseURL}/communityList/toggleLike`, null, {
                params: { cpostId: Number(num), memberId: loginUser.member_id }
            });

            setLiked(res.data.liked); 
            setCommunity(prev => ({ ...prev, c_like: res.data.likeCount }));
            alert(res.data.liked ? '게시물을 추천했습니다! 👍' : '추천을 취소했습니다. 👎'); 
        } catch (err) {
            console.error('추천 처리 실패:', err);
            alert('추천 처리 중 오류가 발생했습니다.');
        }
    };

    if (loading) return <div>로딩 중...</div>;
    if (!community.cpostId && !loading) return <div>존재하지 않는 게시물입니다.</div>;

    return (
        <div className='communityView-container'>
            <h2>COMMUNITY VIEW</h2>

            <div className="communityView-title-row">
                <div className="title">{community.title || '제목 없음'}</div>
                <div className="info-group">
                    <div>작성자: {community.member?.userid || '알수없음'}</div>
                    <div>{community.indate ? community.indate.substring(0, 10) : ''}</div>
                    <div>조회수: <span className="count">{community.readcount || 0}</span></div>
                    <div>추천수: <span className="count">{community.c_like || 0}</span></div>
                    <div>댓글수: <span className="count">{replyList.length}</span></div>
                </div>
            </div>

            <div className='communityView-field'>
                <label>내용</label>
                <div className="communityView-content">{community.content || ''}</div>
            </div>

            {community.fileList && community.fileList.length > 0 && (
                <div className='communityView-field'>
                    <label>이미지</label>
                    <div className="communityView-image-list">
                        {community.fileList.map((file, idx) => (
                            <img
                                key={idx}
                                src={file.path}
                                alt={file.originalname}
                                className="communityView-img"
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className='communityView-btns'>
                {Number(loginUser?.member_id) === Number(community.member?.member_id) && (
                    <>
                        <button onClick={() => navigate(`/updateCommunity/${num}`)}>수정</button>
                        <button onClick={deleteCommunity} className="delete">삭제</button>
                    </>
                )}
                <button onClick={() => navigate('/communityList')}>이전</button>
                <button onClick={handleLike}>추천 👍</button>
            </div>

            <div className="communityView-reply-section">
                <h3>댓글</h3>

                <div className="communityView-reply-input">
                    <textarea
                        rows="3"
                        value={rContent}
                        onChange={(e) => setRContent(e.target.value)}
                        placeholder={loginUser?.member_id ? "댓글을 입력하세요." : "※ 댓글 작성은 로그인 후 이용 가능합니다."}
                        disabled={!loginUser?.member_id}
                    />
                    <button onClick={addReply} disabled={!loginUser?.member_id}>작성</button>
                </div>

                <div className="communityView-reply-list">
                    {replyList.map((reply) => (
                        <div key={reply.replyId} className="reply-item">
                            <div className="communityView-reply-header">
                                <span className="communityView-reply-user">{reply.userid || reply.member?.userid || '알수없음'}</span>
                                <span className="communityView-reply-time">{/* 작성 시간 */}</span>
                            </div>
                            <div className="communityView-reply-content">{reply.content}</div>
                            {Number(reply.memberId) === Number(loginUser?.member_id) && (
                                <button className="communityView-reply-delete" onClick={() => deleteReply(reply.replyId)}>삭제</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CommunityView;
