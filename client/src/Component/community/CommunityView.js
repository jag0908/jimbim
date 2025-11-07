import React, {useState, useEffect} from 'react'
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';

function CommunityView() {
    const loginUser = useSelector( state=>state.user)
    const [community, setCommunity]=useState({});
    const navigate = useNavigate()
    const { num } = useParams()
    const [curDateTime, setCurDateTime] = useState('');
    const [rContent, setRContent]=useState('');
    const [replyList, setReplyList] = useState([]);

    useEffect(
        ()=>{
            jaxios.get(`/api/community/getCommunity/${num}`)
            .then((result)=>{
                setCommunity(  result.data.community );
            })
            .catch((err)=>{console.error(err)})
            const today = new Date()
            const month = String( today.getMonth()+1 ).padStart(2, '0')
            const day = String( today.getDate() ).padStart(2, '0')
            const hour = String( today.getHours() ).padStart(2, '0')
            const minute = String( today.getMinutes() ).padStart(2, '0')
            setCurDateTime(`${month}/${day} ${hour}:${minute}`);

            jaxios.get(`/api/reply/getReply/${num}`)
            .then((result)=>{
                setReplyList( [...result.data.replyList ] );
            })
            .catch((err)=>{console.log(err)})
        },[]
    )

    async function addReply(){
        try{
            await jaxios.post('/api/reply/addReply', {userid:loginUser.userid, content:rContent, communitynum:num})

            const result = await jaxios.get(`/api/reply/getReply/${num}`)
            setReplyList( [...result.data.replyList ] );

            setRContent('')
        }catch(err){    
            console.error(err)
        }
    }
    
    async function deleteReply(replynum){
        if( window.confirm('해당 댓글을 삭제하시겠습니까?') ){
            try{
                await jaxios.delete(`/api/reply/deleteReply/${replynum}`)

                const result = await jaxios.get(`/api/reply/getReply/${num}`)
                setReplyList( [...result.data.replyList ] );

                setRContent('')
            }catch(err){    
                console.error(err)
            }
        }
    }

    function onDeleteCommunity(){
        if( window.confirm('현재게시물을 삭제하시겠습니까?') ){
            jaxios.delete(`/api/community/deleteCommunity/${num}`)
            .then((result)=>{
                alert('게시물이 삭되었습니다')
                navigate('/main')
            }).catch((err)=>{console.error(err)})
        }
    }

    return (
        <div className='communityView'>
            <h2>COMMUNITY VIEW</h2>
            <div className='field'>
                <label>작성자</label>
                <div>{community.userid}</div>
            </div>
            <div className='field'>
                <label>이메일</label>
                <div>{community.email}</div>
            </div>
            <div className='field'>
                <label>조회수</label>
                <div>{community.readcount}</div>
            </div>
            <div className='field'>
                <label>작성일자</label>
                <div>{
                    (community.writedate)?(community.writedate.substring(0,10)):(null)
                }</div>
            </div>
            <div className='field'>
                <label>제목</label>
                <div>{community.title}</div>
            </div>
            <div className='field'>
                <label>내용</label>
                <div><pre>{community.content}</pre></div>
            </div>
            <div className='field'>
                <label>이미지</label>
                <div><img src={`http://localhost:8070/images/${community.savefilename}`} style={{height:'250px'}} /></div>
            </div>
            <div className='btns'>
                <button onClick={ ()=>{ navigate(`/updateCommunity/${num}`);  }  }>수정</button>
                <button onClick={()=>{ onDeleteCommunity() }}>삭제</button>
                <button onClick={()=>{window.location.href='http://localhost:3000/main'}}>돌아가기</button>
            </div>

            <div className='head-row'>
                <div className="head-col">작성일시</div>
                <div className="head-col">작성자</div>
                <div className="head-col">내용</div>
                <div className="head-col">&nbsp;</div>
            </div>
            <div className="new-reply-row">
                <div className="new-reply-col">{curDateTime}</div>
                <div className="new-reply-col">{loginUser.userid}</div>
                <div className="new-reply-col">
                    <input type="text" value={rContent} onChange={(e)=>{ setRContent( e.currentTarget.value);}}/>
                </div>
                <div class="new-reply-col">
                    <button onClick={()=>{ addReply(); }}>댓글 작성</button>
                </div>
            </div>
            {
                replyList.map((reply, idx)=>{
                    return (
                        <div key={idx} className="new-reply-row">
                            <div className="new-reply-col">
                                { (reply.writedate)?(reply.writedate.substring(0,10)):(null) }
                            </div>
                            <div className="new-reply-col">{reply.userid}</div>
                            <div className="new-reply-col">{reply.content}</div>
                            <div className="new-reply-col">
                                {
                                    (reply.userid == loginUser.userid)?
                                    (<button onClick={()=>{deleteReply(reply.replynum)}}>삭제</button>):
                                    (null)
                                }
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default CommunityView