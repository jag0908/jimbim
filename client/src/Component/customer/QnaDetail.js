import React, { useState, useEffect} from 'react'
import SideMenu from './SideMenu';
import '../../style/customer.css';
import { useSelector } from 'react-redux';
import {useParams, useNavigate } from 'react-router-dom';
import jaxios from '../../util/jwtutil';
import Modal from 'react-modal'

function QnaDetail() {
    const loginUser = useSelector( state=>state.user )
    const navigate = useNavigate();

    const [qna, setQna] = useState({});

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const [isOpen, setIsOpen]=useState(false)
    const { qnaId } = useParams();

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
            jaxios.get('/api/customer/getQna', {params:{qnaId}})
            .then((result)=>{ 
                if( !loginUser.userid || result.data.qna.member.userid!=loginUser.userid ){ 
                    alert('로그인 후 사용 가능합니다')
                    navigate('/qna')
                }
                setQna(result.data.qna) 
                setTitle(result.data.qna.title)
                setContent(result.data.qna.content)
            })
            .catch((err)=>{console.error(err)})
        },[]
    )
    function setUpdateForm(){
        if(qna.reply){
            alert('답변이 작성된 문의는 수정할 수 없습니다.\n추가 문의사항이 있으실 경우 새 문의를 작성해주세요')
            return
        }else{
            setIsOpen( !isOpen )
        }
    }
    async function updateQna(){
        if(!title){ return alert('제목을 입력하세요')}
        if(!content ){return alert('내용을 입력하세요')}

        await jaxios.post('/api/customer/updateQna', {qnaId, title, content})
        .then((result)=>{ 
            alert('수정이 완료되었습니다.')
        })
        .catch((err)=>{console.error(err)})

        await jaxios.get('/api/customer/getQna', {params:{qnaId}})
        .then((result)=>{ 
            setQna(result.data.qna) 
            setTitle(result.data.qna.title)
            setContent(result.data.qna.content)
            setIsOpen( false )
        })
        .catch((err)=>{console.error(err)})
    }
    function deleteQna(){
        if(window.confirm('문의를 삭제하시겠습니까?')){
            jaxios.delete('/api/customer/deleteQna', {params:{qnaId}})
            .then((result)=>{ 
                alert('삭제되었습니다.')
                navigate('/customer/qna')
            })
            .catch((err)=>{console.error(err)})
        }
    }

    return (
        <div className='customercontainer'>
            <SideMenu/>
            <div className='customer'>
                <div className='formtitle'>Qna</div>
                <Modal isOpen={isOpen}  ariaHideApp={false}  style={customStyles} >
                    <div className='writeReplyTitle'>수정하기</div>
                    <div className='qnatitle'>
                        <input value={title} onChange={(e)=>{setTitle( e.currentTarget.value )}} placeholder='제목을 입력해주세요'/>
                    </div>
                    <div className='qnaTextarea'>
                        <textarea value={content} onChange={(e)=>{setContent( e.currentTarget.value )}} maxLength={2000}></textarea>
                    </div>
                    <div className='detailPageBtns'>
                        <button onClick={()=>{updateQna()}}>수정</button>
                    </div>
                    <div className='detailPageBtns'>
                        <button className='graybtn' onClick={()=>{ setIsOpen(false) }}>닫기</button>
                    </div>
                </Modal>
                {
                    (qna)?
                    (
                        <div className='qnaDetailTable' onClick={()=>{navigate(`/customer/qna/${qna.qnaId}`)}}>
                            <div className='qnaDetailRow'>
                                <div className='qnaDetailCol'>제목</div>
                                <div className='qnaDetailCol'>{qna.title}</div>
                            </div>
                            <div className='qnaDetailRow'>
                                <div className='qnaDetailCol'>작성일</div>
                                <div className='qnaDetailCol'>{(qna.indate)?(qna.indate.substring(0,10)):(null)}</div>
                            </div>
                            <div className='qnaDetailRow'>
                                <div className='qnaDetailCol'>내용</div>
                                <div className='qnaDetailCol'>{qna.content}</div>
                            </div>
                            <div className='qnaDetailRow'>
                                <div className='qnaDetailCol'>답변</div>
                                <div className='qnaDetailCol'>
                                    {
                                        (qna.answerer)?
                                        (<>
                                            <div>답변자: {qna.answerer.userid}</div>
                                            <div>{qna.reply}</div>
                                        </>):(<></>)
                                    }
                                </div>
                            </div>
                        </div>
                    )
                    :(<></>)
                }
                <div className='formBtns' style={{width:'300px'}}>
                    <button onClick={()=>{setUpdateForm()}}>수정</button>
                    <button onClick={()=>{deleteQna()}} style={{background:'red'}}>삭제</button>
                    <button onClick={()=>{navigate('/customer/qna')}}>뒤로</button>
                </div>
            </div>
        </div>
    )
}

export default QnaDetail