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
                // 서버에서 'liked' 여부를 반환하도록 API가 설계되었다고 가정합니다.
                const [communityRes, replyRes] = await Promise.all([
                    axios.get(`${baseURL}/communityList/getCommunity/${num}`, {
                        // 로그인된 유저가 있다면 memberId를 보내서 추천 상태를 확인 (서버 설계에 따름)
                        params: { memberId: loginUser?.member_id } 
                    }),
                    axios.get(`${baseURL}/communityReply/getReply/${num}`)
                ]);

                setCommunity(communityRes.data.community || {});
                // 서버 응답에서 liked 상태를 가져와 설정
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

            // 댓글 목록 새로고침
            const result = await axios.get(`${baseURL}/communityReply/getReply/${num}`);
            setReplyList(result.data.replyList || []);
            setRContent('');
        } catch (err) {
            console.error('댓글 작성 실패:', err);
            alert('댓글 작성에 실패했습니다.');
        }
    };

    // 댓글 삭제
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

    // 게시글 삭제
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

    // 📢 수정된 추천 기능: 토글 가능하도록 로직 변경
    const handleLike = async () => {
        if (!loginUser?.member_id) return alert('로그인이 필요합니다.');

        try {
            // 서버의 toggleLike API를 호출합니다. (서버가 추천/취소를 알아서 처리)
            const res = await jaxios.post(`${baseURL}/communityList/toggleLike`, null, {
                params: { cpostId: Number(num), memberId: loginUser.member_id }
            });

            // 서버 응답(res.data.liked)에 따라 liked 상태를 토글합니다.
            setLiked(res.data.liked); 
            
            // 추천수를 서버 응답의 likeCount로 업데이트합니다.
            setCommunity(prev => ({ ...prev, c_like: res.data.likeCount }));

            alert(res.data.liked ? '게시물을 추천했습니다! 👍' : '추천을 취소했습니다. 👎'); 

        } catch (err) {
            console.error('추천 처리 실패:', err);
            alert('추천 처리 중 오류가 발생했습니다.');
        }
    };

    if (loading) return <div>로딩 중...</div>;
    // 게시글이 존재하지 않을 경우 처리
    if (!community.cpostId && !loading) return <div>존재하지 않는 게시물입니다.</div>;


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

            {/* 🚨 이미지를 복수 처리하려면 c_image 대신 c_image_list 같은 배열로 처리해야 함 */}
            {community.c_image && (
                <div className='field'>
                    <label>이미지</label>
                    <img src={`${baseURL}/images/${community.c_image}`} alt="community" className="view-image" />
                </div>
            )}

            <div className='btns'>
                {/* 현재 로그인 유저의 member_id와 게시글 작성자의 member_id가 일치할 때만 수정/삭제 버튼 표시 */}
                {Number(loginUser?.member_id) === Number(community.member?.member_id) && (
                    <>
                        <button onClick={() => navigate(`/updateCommunity/${num}`)}>수정</button>
                        <button onClick={deleteCommunity}>삭제</button>
                    </>
                )}
                <button onClick={() => navigate('/communityList')}>이전</button>
                {/* 📢 버튼 문구를 liked 상태에 따라 변경 */}
                <button onClick={handleLike}>
                    {liked ? '추천 취소 👎' : '추천 👍'}
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
                                {/* 작성자 표시 (userid 또는 member.userid) */}
                                <span className="reply-user">{reply.userid || reply.member?.userid || '알수없음'}</span>
                                <span className="reply-time">{/* 작성 시간이 있다면 표시 */}</span>
                            </div>
                            <div className="reply-content">{reply.content}</div>
                            {/* 댓글 작성자의 memberId와 로그인 유저의 member_id가 일치할 때만 삭제 버튼 표시 */}
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