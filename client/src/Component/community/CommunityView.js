// import React, {useState, useEffect} from 'react'
// import axios from 'axios';
// import { useNavigate } from "react-router-dom";
// import { useSelector } from 'react-redux';
// import jaxios from '../../util/jwtutil';

// const baseURL = process.env.REACT_APP_BASE_URL;

// function CommunityView() {
//     const loginUser = useSelector( state=>state.user)
//     const [community, setCommunity]=useState({});
//     const navigate = useNavigate()
//     const { num } = useParams()
//     const [curDateTime, setCurDateTime] = useState('');
//     const [rContent, setRContent]=useState('');
//     const [replyList, setReplyList] = useState([]);

//     useEffect(()=>{

//     })

//     async function addReply() {
//         try{
//             await jaxios.post('/api/reply/addReply', {userid:loginUser.userid, content:rContent, communitynum:num})
//             const result = await jaxios.get(`/api/reply/getReply/${num}`)
//             setReplyList([...result.data.replyList]);
//             setRContent('')
//         }catch(err){console.error(err)}
//     }

//     async function deleteReply(replynum){
//         if( window.confirm('해당 댓글을 삭제하시겠습니까?') ){
//             try{
//                 await jaxios.delete(`/api/reply/deleteReply/${replynum}`)

//                 const result = await jaxios.get(`/api/reply/getReply/${num}`)
//                 setReplyList( [...result.data.replyList ] );

//                 setRContent('')
//             }catch(err){    
//                 console.error(err)
//             }
//         }
//     }

//     function onDeleteCommunity(){
//         if( window.confirm('게시물을 삭제하시겠습니까?') ){
//             jaxios.delete(`/api/community/deleteCommunity/${num}`)
//             .then((result)=>{
//                 alert('게시물이 삭제 되었습니다')
//                 navigate('/main')
//             }).catch((err)=>{console.error(err)})
//         }
//     }

//     return (
//         <div className='communityView'>
//             <h2>COMMUNITY VIEW</h2>
//             <div className='field'>
//                 <label>작성자</label>
//                 <div>{community.userid}</div>
//             </div>
//             <div className='field'>
//                 <label>조회수</label>
//                 <div>{community.readcount}</div>
//             </div>
//             <div className='field'>
//                 <label>작성일</label>
//                 <div>{
//                     (community.writedate)?(community.writedate.substring(0,10)):(null)
//                 }</div>
//             </div>
//             <div className='field'>
//                 <label>제목</label>
//                 <div>{community.title}</div>
//             </div>
//             <div className='field'>
//                 <label>내용</label>
//                 <div>{community.content}</div>
//             </div>
//             <div className='field'>
//                 <label>이미지</label>
//                 <div><img src={`baseURL/images/${community.savefilename}`} style={{height:'250px'}} /></div>
//             </div>
//             <div className='btns'>
//                 <button onClick={()=>{navigate(`/updateCommunity/${num}`);}}>수정</button>
//                 <button onClick={()=>{onDeleteCommunity()}}>삭제</button>
//                 <button onClick={()=>{window.location.href='baseURL/main'}}>이전</button>
//             </div>
//         </div>
//     )
// }

// export default CommunityView
