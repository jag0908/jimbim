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
    const [liked, setLiked] = useState(false); // 이미 추천했는지 상태
    const navigate = useNavigate();
    const { num } = useParams();

    // 게시글 + 댓글 불러오기 및 추천 상태 확인
    useEffect(() => {
        const fetchCommunityData = async () => {
            setLoading(true);
            try {
                const [communityRes, replyRes] = await Promise.all([
                    axios.get(`${baseURL}/communityList/getCommunity/${num}`, {
                        params: { memberId: loginUser?.member_id } // 서버에서 liked 여부 반환
                    }),
                    axios.get(`${baseURL}/communityReply/getReply/${num}`)
                ]);

                setCommunity(communityRes.data.community || {});
                setLiked(communityRes.data.liked || false); // 서버에서 liked 가져오기
                setReplyList(replyRes.data.replyList || []);
            } catch (err) {
                console.error('데이터 로딩 실패:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCommunityData();
    }, [num, loginUser?.member_id]);

    // 댓글 추가
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
        }
    };

    // 댓글 삭제
    const deleteReply = async (replyId) => {
        if (!window.confirm('해당 댓글을 삭제하시겠습니까?')) return;
        try {
            await jaxios.delete(`${baseURL}/communityReply/deleteReply/${replyId}`);
            setReplyList(prev => prev.filter(reply => reply.replyId !== replyId));
        } catch (err) {
            console.error('댓글 삭제 실패:', err);
        }
    };

    // 게시글 삭제
    const deleteCommunity = async () => {
        if (!window.confirm('게시물을 삭제하시겠습니까?')) return;
        try {
            await jaxios.delete(`${baseURL}/communityList/deleteCommunity/${num}`);
            alert('게시물이 삭제 되었습니다');
            navigate('/communityList');
        } catch (err) {
            console.error('게시물 삭제 실패:', err);
        }
    };

    // 추천 기능: 한 번만 추천 가능
    const handleLike = async () => {
        if (!loginUser?.member_id) return alert('로그인이 필요합니다.');
        if (liked) return alert('이미 추천한 게시물입니다.');

        try {
            const res = await jaxios.post(`${baseURL}/communityList/toggleLike`, null, {
                params: { cpostId: Number(num), memberId: loginUser.member_id }
            });

            setLiked(true); // 클릭 후 상태 true
            setCommunity(prev => ({ ...prev, c_like: res.data.likeCount }));
        } catch (err) {
            console.error('추천 처리 실패:', err);
        }
    };

    if (loading) return <div>로딩 중...</div>;

    return (
        <div className='communityView'>
            <h2>COMMUNITY VIEW</h2>

            <div className="view-title-row">
                <div className="title">{community.title || '제목 없음'}</div>
                <div className="info-group">
                    <div>작성자: {community.member?.userid || '알수없음'}</div>
                    <div>{community.indate ? community.indate.substring(0, 10) : ''}</div>
                    <div>조회수: <span className="count">{community.readcount || 0}</span></div>
                    <div>추천수: <span className="count">{community.c_like || 0}</span></div>
                    <div>댓글수: <span className="count">{replyList.length}</span></div>
                </div>
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
                {Number(loginUser?.member_id) === Number(community.member?.member_id) && (
                    <>
                        <button onClick={() => navigate(`/updateCommunity/${num}`)}>수정</button>
                        <button onClick={deleteCommunity}>삭제</button>
                    </>
                )}
                <button onClick={() => navigate('/communityList')}>이전</button>
                <button onClick={handleLike} disabled={liked}>
                    추천 👍
                </button>
            </div>

            <div className="reply-section">
                <h3>댓글</h3>

                <div className="reply-input">
                    <textarea
                        rows="3"
                        value={rContent}
                        onChange={(e) => setRContent(e.target.value)}
                        placeholder={loginUser?.member_id ? "댓글을 입력하세요." : "※ 댓글 작성은 로그인 후 이용 가능합니다."}
                        disabled={!loginUser?.member_id}
                    />
                    <button onClick={addReply} disabled={!loginUser?.member_id}>작성</button>
                </div>

                <div className="reply-list">
                    {replyList.map((reply) => (
                        <div key={reply.replyId} className="reply-item">
                            <div className="reply-header">
                                <span className="reply-user">{reply.userid || '알수없음'}</span>
                                <span className="reply-time">{/* 작성 시간이 있다면 표시 */}</span>
                            </div>
                            <div className="reply-content">{reply.content}</div>
                            {Number(reply.memberId) === Number(loginUser?.member_id) && (
                                <button className="reply-delete" onClick={() => deleteReply(reply.replyId)}>삭제</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CommunityView;
