import React, { useState, useEffect, useRef } from 'react';
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
    const [replyInputs, setReplyInputs] = useState({});
    const replyRefs = useRef({});
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const navigate = useNavigate();
    const { num } = useParams();
    const [anonymousTop, setAnonymousTop] = useState(false);

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
                cpostId: Number(num),
                parentReplyId: null,
                anonymous: anonymousTop
            });

            const result = await axios.get(`${baseURL}/communityReply/getReply/${num}`);
            setReplyList(result.data.replyList || []);
            setRContent('');
            setAnonymousTop(false);
        } catch (err) {
            console.error('댓글 작성 실패:', err);
            alert('댓글 작성에 실패했습니다.');
        }
    };

    const handleReplyInputChange = (parentId, value) => {
        setReplyInputs(prev => ({ ...prev, [parentId]: value }));
    };

    const openReplyInput = (parentId) => {
        setReplyInputs(prev => ({ ...prev, [parentId]: prev[parentId] ?? { content: '', anonymous: false } }));
        setTimeout(() => {
            replyRefs.current[parentId]?.focus();
        }, 0);
    };

    const submitReply = async (parentId) => {
        const input = replyInputs[parentId];
        const content = input.content;
        const anonymous = input.anonymous;

        if (!loginUser?.member_id) return alert('로그인이 필요한 서비스입니다.');
        if (!content || !content.trim()) return alert('댓글을 입력해주세요.');

        try {
            await jaxios.post(`${baseURL}/communityReply/addReply`, {
                content,
                memberId: loginUser.member_id,
                cpostId: Number(num),
                parentReplyId: parentId,
                anonymous
            });

            const result = await axios.get(`${baseURL}/communityReply/getReply/${num}`);
            setReplyList(result.data.replyList || []);

            setReplyInputs(prev => {
                const updated = { ...prev };
                delete updated[parentId];
                return updated;
            });
        } catch (err) {
            console.error('댓글 작성 실패:', err);
            alert('댓글 작성에 실패했습니다.');
        }
    };

    const cancelReply = (parentId) => {
        setReplyInputs(prev => {
            const updated = { ...prev };
            delete updated[parentId];
            return updated;
        });
    };

    const deleteReply = async (replyId) => {
        if (!window.confirm('해당 댓글을 삭제하시겠습니까?')) return;

        try {
            await jaxios.delete(`${baseURL}/communityReply/deleteReply/${replyId}`);

            const removeReplyRecursively = (replies, id) => {
                return replies
                    .filter(r => r.replyId !== id)
                    .map(r => ({
                        ...r,
                        children: r.children ? removeReplyRecursively(r.children, id) : []
                    }));
            };

            setReplyList(prev => removeReplyRecursively(prev, replyId));
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
        } catch (err) {
            console.error('추천 처리 실패:', err);
            alert('추천 처리 중 오류가 발생했습니다.');
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        const ss = String(date.getSeconds()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    };

    // 전체 댓글 수 계산 (답글 포함)
    const getTotalReplyCount = (replies) => {
        return replies.reduce((acc, reply) => {
            const childrenCount = reply.children ? getTotalReplyCount(reply.children) : 0;
            return acc + 1 + childrenCount;
        }, 0);
    };

    const renderReplies = (replies, level = 0) => {
        return replies.map(reply => (
            <div key={reply.replyId} className="reply-item" style={{ marginLeft: level * 20 }}>
                <div className="communityView-reply-header">
                    <span className="communityView-reply-user">{reply.anonymous ? '익명' : reply.userid}</span>
                    <span className="communityView-reply-time">{formatDateTime(reply.indate)}</span>
                </div>
                <div className="communityView-reply-content">{reply.content}</div>
                <div className="communityView-reply-actions">
                    {loginUser?.member_id && (
                        <button onClick={() => openReplyInput(reply.replyId)}>답글</button>
                    )}
                    {Number(reply.memberId) === Number(loginUser?.member_id) && (
                        <button onClick={() => deleteReply(reply.replyId)}>삭제</button>
                    )}
                </div>

                {replyInputs[reply.replyId] && (
                    <div className="communityView-reply-input" style={{ marginTop: 6 }}>
                        <textarea
                            ref={el => replyRefs.current[reply.replyId] = el}
                            rows="2"
                            value={replyInputs[reply.replyId].content}
                            onChange={(e) => handleReplyInputChange(reply.replyId, {
                                ...replyInputs[reply.replyId],
                                content: e.target.value
                            })}
                            placeholder="댓글을 입력하세요."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    submitReply(reply.replyId);
                                }
                            }}
                        />
                        <label>
                            <input
                                type="checkbox"
                                checked={replyInputs[reply.replyId].anonymous}
                                onChange={() => handleReplyInputChange(reply.replyId, {
                                    ...replyInputs[reply.replyId],
                                    anonymous: !replyInputs[reply.replyId].anonymous
                                })}
                            />
                            익명
                        </label>
                        <button onClick={() => submitReply(reply.replyId)}>작성</button>
                        <button onClick={() => cancelReply(reply.replyId)} className="cancel">취소</button>
                    </div>
                )}

                {reply.children && reply.children.length > 0 && renderReplies(reply.children, level + 1)}
            </div>
        ));
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
                    <div>{formatDateTime(community.indate)}</div>
                    <div>조회수: <span className="count">{community.readcount || 0}</span></div>
                    <div>댓글수: <span className="count">{getTotalReplyCount(replyList)}</span></div>
                </div>
            </div>

            <div className="communityView-field">
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
                <button onClick={handleLike}>
                    추천 👍 {community.c_like || 0}
                </button>
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
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                addReply();
                            }
                        }}
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={anonymousTop}
                            onChange={() => setAnonymousTop(!anonymousTop)}
                        />
                        익명
                    </label>
                    <button onClick={addReply} disabled={!loginUser?.member_id}>작성</button>
                </div>

                <div className="communityView-reply-list">
                    {renderReplies(replyList)}
                </div>
            </div>
        </div>
    );
}

export default CommunityView;
