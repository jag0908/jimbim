import React, { useState, useEffect} from 'react'
import SideMenu from './SideMenu';
import '../../style/customer.css';
import { useSelector } from 'react-redux';
import {useParams, useNavigate } from 'react-router-dom';
import jaxios from '../../util/jwtutil';

function QnaDetail() {
    const loginUser = useSelector( state=>state.user )
    const navigate = useNavigate();

    const [qna, setQna] = useState({});
    const { qnaId } = useParams();

    useEffect(
        ()=>{
            jaxios.get('/api/customer/getQna', {params:{qnaId}})
            .then((result)=>{ 
                if( !loginUser.userid || result.data.qna.member.userid!=loginUser.userid ){ 
                    alert('로그인 후 사용 가능합니다')
                    navigate('/qna')
                }
                setQna(result.data.qna) 
                console.log(result.data.qna)
            })
            .catch((err)=>{console.error(err)})
        },[]
    )

    return (
        <div className='customercontainer'>
            <SideMenu/>
            <div className='customer'>
                <div className='formtitle'>Qna</div>
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
                                <div className='qnaDetailCol'>{qna.reply}</div>
                            </div>
                        </div>
                    )
                    :(<></>)
                }
                <div className='formBtns'>
                    <button onClick={()=>{navigate('/customer/qna')}}>뒤로</button>
                </div>
            </div>
        </div>
    )
}

export default QnaDetail