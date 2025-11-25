import React, { useState, useEffect} from 'react'
import SideMenu from './SideMenu';
import '../../style/customer.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import jaxios from '../../util/jwtutil';

function Qna() {
    const loginUser = useSelector( state=>state.user )
    const navigate = useNavigate();

    const [qnaList, setQnaList] = useState([]);

    useEffect(
        ()=>{
            if(loginUser.userid){
                jaxios.get(`/api/customer/getQnaList`, {params:{userid:loginUser.userid, page:1}} )
                .then((result)=>{
                    console.log(result.data)
                    setQnaList(result.data.qnaList)
                }).catch((err)=>{ console.error(err);  })
            }
        },[]
    )
    return (
        <div className='customercontainer'>
            <SideMenu/>
            <div>
                <div className='formtitle'>Qna</div>
                <div className='formBtns'>
                    <button onClick={()=>{navigate('/customer/writeqna')}}>문의하기</button>
                </div>
                <div>
                {
                    (qnaList.length!=0)?
                        (
                            qnaList.map((qna, idx)=>{
                                return (
                                    <div key={idx} className='qnaList'>
                                        <div className='field'>
                                            <label>제목</label>
                                            <div className='addressListText'>{qna.title}</div>
                                        </div>
                                        <div className='field'>
                                            <label>답변여부</label>
                                            <div className='addressListText'>{(qna.reply)?(<>Y</>):(<>N</>)}</div>
                                        </div>
                                        <div className='field'>
                                            <label>작성일</label>
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
                </div>
            </div>
        </div>
    )
}

export default Qna