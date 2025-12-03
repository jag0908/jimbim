import React, {useEffect, useState} from 'react'
import { useParams , useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';
import SubMenu from '../SubMenu';
import Modal from 'react-modal'

function QnaDetail() {
    const loginUser = useSelector( state=>state.user)
    const { qnaId } = useParams();
    const [qna, setQna] = useState({});
    const [reply, setReply] = useState('');
    const navigate = useNavigate();

    const [isOpen, setIsOpen]=useState(false)
    const customStyles = {
        overlay: {
            backgroundColor: "rgba( 0 , 0 , 0 , 0.5)", 
            zIndex: "2000"
        },
        content: {
            left: "0",
            margin: "auto",
            width: "500px",
            height: "600px",
            padding: "0",
            overflow: "hidden",
        },
    };

    useEffect(
        ()=>{
            if( !loginUser.userid ||  !loginUser.roleNames.includes('ADMIN') ){ 
                alert('권한이 없습니다')
                navigate('/')
            }
            jaxios.get('/api/admin/getQna', {params:{qnaId}})
            .then((result)=>{ 
                setQna(result.data.qna)
                setReply('')
            })
            .catch((err)=>{console.error(err)})
        },[]
    )
    async function onSubmit(){
        if(!reply){ return alert('답변을 입력하세요')}

        await jaxios.post('/api/admin/writeReply', null, {params:{qnaId, reply, answerer:loginUser.userid}})
        .then(()=>{ 
            alert('답변 작성이 완료되었습니다.');
            setIsOpen( false )
        } ).catch((err)=>{console.error(err)})

        await jaxios.get('/api/admin/getQna', {params:{qnaId}})
        .then((result)=>{ 
            setQna(result.data.qna) 
            console.log(result.data.qna)
        })
        .catch((err)=>{console.error(err)})
    }
    return (
        <div className='adminContainer'>
            <SubMenu type={'qna'}/>
            <div className='productTable detailTable'>
                <div className='title'>Q & A</div>
                {(qna.member)?
                (<>
                    <div className='row'>
                        <div className='col detailTitle'>글제목</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{qna.title}</div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>게시자</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{qna.member.userid}</div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>작성일</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{qna.indate.substring(0, 10)}</div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>내용</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{qna.content}</div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>답변</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{(qna.reply)?
                            (<>
                                <div>답변자: {qna.answerer.userid}</div>
                                <div>{qna.reply}</div>
                            </>
                            ):
                            (
                                <div className='detailPageBtns' onClick={ ()=>{ setIsOpen( !isOpen ) }}>
                                    <button>답변 작성하기</button>
                                </div>
                            )}
                        </div>
                    </div>
                </>):(<></>)}
                <Modal isOpen={isOpen}  ariaHideApp={false}  style={customStyles} >
                    <div className='writeReplyTitle'>답변 작성</div>
                    <div className='qnaTextarea'>
                        <textarea value={reply} onChange={(e)=>{setReply( e.currentTarget.value )}} maxLength={2000}></textarea>
                    </div>
                    <div className='detailPageBtns'>
                        <button onClick={()=>{onSubmit()}}>답변 작성하기</button>
                    </div>
                    <div className='detailPageBtns'>
                        <button className='graybtn' onClick={()=>{ setIsOpen(false) }}>닫기</button>
                    </div>
                </Modal>
                
                <div className='detailPageBtns'>
                    <button onClick={()=>{navigate('/qnaList')}} >뒤로</button>
                </div>
            </div>
        </div>
    )
}

export default QnaDetail