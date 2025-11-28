import React, { useEffect, useState } from 'react'
import SubMenu from '../SubMenu'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';
import '../../style/admin.css'


function QnaList() {
    const loginUser = useSelector( state=>state.user)
    const [qnaList, setQnaList] = useState([]);
    const [paging, setPaging]=useState({});
    const navigate = useNavigate();
    const [beginEnd, setBeginEnd] = useState();
    const [key, setKey] = useState('')
    const type = 'qna'

    useEffect(
        ()=>{
            if( !loginUser.userid ||  !loginUser.roleNames.includes('ADMIN') ){ 
                alert('권한이 없습니다')
                navigate('/')
            }
            jaxios.get('/api/admin/getQnaList', {params:{page:1, key}})
            .then((result)=>{ 
                setQnaList(result.data.qnaList) 
                setPaging( result.data.paging )
                setKey( result.data.key)

                let arr = [];
                for( let i=result.data.paging.beginPage; i<=result.data.paging.endPage; i++){
                    arr.push(i);
                }
                setBeginEnd( [...arr] )
            })
            .catch((err)=>{console.error(err)})
        },[]
    )

    function onPageMove(p){ 
        jaxios.get('/api/admin/getQnaList', {params:{page:p, key}})
        .then((result)=>{ 
            setQnaList(result.data.qnaList) 
            setPaging( result.data.paging )
            setKey( result.data.key)
            let arr = [];
            for( let i=result.data.paging.beginPage; i<=result.data.paging.endPage; i++){
                arr.push(i);
            }
            setBeginEnd( [...arr] )
        })
        .catch((err)=>{console.error(err)})
    }

    return (
        <div className='adminContainer'>
            <SubMenu type={type}/>
            <div className='productTable'>
                <div className='title'>Q & A</div>
                <div className='row tableTitle'>
                    <div className='col'>게시자</div>
                    <div className='col'>글제목</div>
                    <div className='col'>답변여부</div>
                    <div className='col'>작성일</div>
                </div>
                {
                    (qnaList)?(
                        qnaList.map((qna, idx)=>{
                            return (
                                <div className='row' onClick={()=>{navigate(`/qnaDetail/${qna.qnaId}`)}}>
                                    <div className='col'>{qna.member.userid}</div>
                                    <div className='col'>{qna.title}</div>
                                    <div className='col'>{(qna.reply)?(<>Y</>):(<>N</>)}</div>
                                    <div className='col'>{qna.indate.substring(0, 10)}</div>
                                </div>
                            )
                        })
                    ):(<span>loading...</span>)
                }
                <div id="paging" style={{textAlign:"center", padding:"10px"}}>
                {
                    (paging.prev)?(
                        <span style={{cursor:"pointer"}} onClick={ ()=>{ onPageMove( paging.beginPage-1 ) } } > ◀ </span>
                    ):(<span></span>)
                }
                {
                    (beginEnd)?(
                        beginEnd.map((page, idx)=>{
                            return (
                                <span style={{cursor:"pointer"}} key={idx} className={(page==paging.page)?('currentPage'):''}  onClick={
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
                </div>
                <div className='btns' style={{display:"flex", margin:"5px"}}>
                    <input type="text" value={key} onChange={(e)=>{setKey(e.currentTarget.value)}} />
                    <button style={{marginLeft:"auto"}} onClick={()=>{ onPageMove(1) }}>검색</button>
                </div>    
            </div>
        </div>
    )
}

export default QnaList