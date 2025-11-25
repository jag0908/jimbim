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
    const [paging, setPaging]=useState({});
    const [beginEnd, setBeginEnd]=useState([])

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