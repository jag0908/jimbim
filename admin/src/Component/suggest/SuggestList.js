import React, { useEffect, useState } from 'react'
import SubMenu from '../SubMenu'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';
import '../../style/admin.css'

function SuggestList() {
    const loginUser = useSelector( state=>state.user)
    const [suggestList, setSuggestList] = useState([]);
    // const [cCategoryList, setCCategoryList] = useState([]);
    const [paging, setPaging]=useState({});
    const navigate = useNavigate();
    const [beginEnd, setBeginEnd] = useState();
    const [key, setKey] = useState('')
    const type = 'suggest'

    useEffect(
        ()=>{
            if( !loginUser.userid ||  !loginUser.roleNames.includes('ADMIN') ){ 
                alert('권한이 없습니다')
                navigate('/')
            }
            jaxios.get('/api/admin/getSuggestList', {params:{page:1, key}})
            .then((result)=>{ 
                console.log(result)
                setSuggestList(result.data.suggestList) 
                // setCCategoryList(result.data.cCategoryList)
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
        jaxios.get('/api/admin/getSuggestList', {params:{page:p, key}})
        .then((result)=>{ 
            setSuggestList(result.data.suggestList) 
            // setCCategoryList(result.data.cCategoryList)
            setPaging( result.data.paging )
            setKey( result.data.key)
            let arr = [];
            for( let i=result.data.paging.beginPage; i<=result.data.paging.endPage; i++){
                arr.push(i);
            }
            setBeginEnd( [...arr] )
            console.log('paging', result.data.paging)
        })
        .catch((err)=>{console.error(err)})
    }

    return (
        <div className='adminContainer'>
            <SubMenu type={type}/>
            <div className='productTable'>
                <div className='title'>요청내역</div>
                <div className='row tableTitle'>
                    {/* <div className='col'>카테고리</div> */}
                    <div className='col'>제목</div>
                    <div className='col'>가격</div>
                    <div className='col'>요청자</div>
                    <div className='col'>상태</div>
                    <div className='col'>요청일</div>
                </div>
                {
                    (suggestList[0])?(
                        suggestList.map((suggest, idx)=>{
                            return (
                                <div className='row' onClick={()=>{navigate(`/suggestDetail/${suggest.suggestId}`)}}>
                                    {/* <div className='col'>
                                        {
                                            (suggest.category)?
                                            (cCategoryList[suggest.category.categoryId].categoryName):
                                            (<></>)
                                        }
                                    </div> */}
                                    <div className='col'>{suggest.title}</div>
                                    <div className='col'>{suggest.price} 원</div>
                                    <div className='col'>{
                                        (suggest.member)?
                                        (((suggest.member.provider)?(suggest.member.userid+' ('+suggest.member.provider+')'):(suggest.member.userid))):
                                        (<span className='italic'>탈퇴회원</span>)
                                    }</div>
                                    <div className='col'>{
                                        (suggest.isAccept)?
                                        (suggest.isAccept):
                                        (<span className='italic'>확인안함</span>)
                                    }</div>
                                    <div className='col'>
                                        {
                                            (suggest.indate)?
                                            (suggest.indate.substring(0, 10)):
                                            (<></>)
                                        }
                                    </div>
                                </div>
                            )
                        })
                    ):(<></>)
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

export default SuggestList