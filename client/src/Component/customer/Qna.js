import React, { useState, useEffect} from 'react'
import SideMenu from './SideMenu';
import '../../style/customer.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import jaxios from '../../util/jwtutil';
import Modal from 'react-modal'

function Qna() {
    const loginUser = useSelector( state=>state.user )
    const navigate = useNavigate();

    const [qnaList, setQnaList] = useState([]);
    const [paging, setPaging]=useState({});
    const [beginEnd, setBeginEnd]=useState([])

    const [isOpen, setIsOpen]=useState(false)

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [member, setMember] = useState({})

    const customStyles = {
        overlay: {
            backgroundColor: "rgba( 0 , 0 , 0 , 0.5)", 
            zIndex: "2000"
        },
        content: {
            left: "0",
            margin: "auto",
            width: "500px",
            height: "650px",
            padding: "0",
            overflow: "hidden",
        },
    };

    useEffect(
        ()=>{
            if(loginUser.userid){
                jaxios.get(`/api/customer/getQnaList`, {params:{userid:loginUser.userid, page:1}} )
                .then((result)=>{
                    console.log( loginUser.userid, result.data)
                    setQnaList(result.data.qnaList)
                    setPaging( result.data.paging )
                    let arr = [];
                    for( let i=result.data.paging.beginPage; i<=result.data.paging.endPage; i++){
                        arr.push(i);
                    }
                    setBeginEnd( [...arr] )
                }).catch((err)=>{ console.error(err);  })

                jaxios.get(`/api/member/getMember`, {params:{userid:loginUser.userid}} )
                .then((result)=>{
                    setMember(result.data.member)
                }).catch((err)=>{ console.error(err);  })
            }
        },[]
    )
    function onPageMove(page){
        jaxios.get(`/api/customer/getQnaList`, {params:{userid:loginUser.userid, page}})
        .then((result)=>{
            setQnaList(result.data.qnaList)
            setPaging( result.data.paging )
            const pageArr = [];
            for(let i=result.data.paging.beginPage; i<=result.data.paging.endPage; i++){
                pageArr.push(i);
            }
            setBeginEnd( [...pageArr] );
        }).catch((err)=>{console.error(err)})
    }
    async function onSubmit(){
        console.log(title, content, loginUser.member_id)
        if(!title){ return alert('제목을 입력하세요')}
        if(!content ){return alert('내용을 입력하세요')}

        await jaxios.post('/api/customer/writeQna', {title, content, member})
        .then(()=>{ 
            alert('문의가 완료되었습니다.');
            setIsOpen( false )
        } ).catch((err)=>{console.error(err)})

        await jaxios.get(`/api/customer/getQnaList`, {params:{userid:loginUser.userid, page:1}} )
        .then((result)=>{
            setQnaList(result.data.qnaList)
            setPaging( result.data.paging )
            let arr = [];
            for( let i=result.data.paging.beginPage; i<=result.data.paging.endPage; i++){
                arr.push(i);
            }
            setBeginEnd( [...arr] )
        }).catch((err)=>{ console.error(err);  })
    }
    return (
        <div className='customercontainer'>
            <SideMenu/>
            <div className='customer'>
                <div className='formtitle'>Qna</div>
                <div className='formBtns'>
                    <button onClick={ ()=>{ setIsOpen( !isOpen ) }}>문의하기</button>
                </div>
                <Modal isOpen={isOpen}  ariaHideApp={false}  style={customStyles} >
                    <div className='writeReplyTitle'>문의하기</div>
                    <div className='qnatitle'>
                        <input value={title} onChange={(e)=>{setTitle( e.currentTarget.value )}} placeholder='제목을 입력해주세요'/>
                    </div>
                    <div className='qnaTextarea'>
                        <textarea value={content} onChange={(e)=>{setContent( e.currentTarget.value )}} maxLength={2000}></textarea>
                    </div>
                    <div className='detailPageBtns'>
                        <button onClick={()=>{onSubmit()}}>보내기</button>
                    </div>
                    <div className='detailPageBtns'>
                        <button className='graybtn' onClick={()=>{ setIsOpen(false) }}>닫기</button>
                    </div>
                </Modal>
                <div>
                    {
                        (qnaList.length!=0)?
                        (<div className='qnaList'>
                            <div className='field' style={{flex:'2'}}>
                                <div className='addressListText'>제목</div>
                            </div>
                            <div className='field'>
                                <div className='addressListText'>답변여부</div>
                            </div>
                            <div className='field'>
                                <div className='addressListText'>작성일</div>
                            </div>
                        </div>):(<></>)
                    }
                {
                    (qnaList.length!=0)?
                        (
                            qnaList.map((qna, idx)=>{
                                return (
                                    <div key={idx} className='qnaList' onClick={()=>{navigate(`/customer/qna/${qna.qnaId}`)}}>
                                        <div className='field' style={{flex:'2'}}>
                                            <div className='addressListText'>{qna.title}</div>
                                        </div>
                                        <div className='field'>
                                            <div className='addressListText'>{(qna.reply)?(<>Y</>):(<>N</>)}</div>
                                        </div>
                                        <div className='field'>
                                            <div className='addressListText'>{(qna.indate)?(qna.indate.substring(0,10)):(null)}</div>
                                        </div>
                                    </div>
                                )
                            })
                            
                        ):
                        ((loginUser.userid)?
                        (<div>아직 문의가 없습니다</div>):
                        (<div>로그인 후 사용 가능합니다</div>)
                    )
                }
                {
                        
                        (qnaList.length!=0)?
                        (<div id="paging" style={{textAlign:"center", padding:"10px"}}>
                            {
                                (paging.prev)?(
                                    <span style={{cursor:"pointer"}} onClick={ ()=>{ onPageMove( paging.beginPage-1 ) } } > ◀ </span>
                                ):(<span></span>)
                            }
                            {
                                (beginEnd)?(
                                    beginEnd.map((page, idx)=>{
                                        return (
                                            <span style={(page==paging.page)?{fontWeight:'bold', cursor:"pointer"}:{cursor:"pointer"}} key={idx} onClick={
                                                ()=>{ onPageMove( page ) }
                                            }>&nbsp;{page}&nbsp;</span>
                                        )
                                    })
                                ):(<></>)
                            }
                            {
                                (paging.next)?(
                                    <span style={{cursor:"pointer"}} onClick={
                                        ()=>{ onPageMove( paging.endPage+1 ) }
                                    }>&nbsp;▶&nbsp;</span>
                                ):(<></>)
                            }
                        </div>):(<></>)
                    }
                </div>
            </div>
        </div>
    )
}

export default Qna