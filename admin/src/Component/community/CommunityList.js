import React, { useEffect, useState } from 'react'
import SubMenu from '../SubMenu'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';
import '../../style/admin.css'


function CommunityList() {
    const loginUser = useSelector( state=>state.user)
    const [cPostList, setCPostList] = useState([]);
    const [cCategoryList, setCCategoryList] = useState([]);
    const [paging, setPaging]=useState({});
    const navigate = useNavigate();
    const [beginEnd, setBeginEnd] = useState();
    const [key, setKey] = useState('')
    const type = 'community'

    useEffect(
        ()=>{
            if( !loginUser.userid ||  !loginUser.roleNames.includes('ADMIN') ){ 
                alert('권한이 없습니다')
                navigate('/')
            }
            jaxios.get('/api/admin/getCPostList', {params:{page:1, key}})
            .then((result)=>{ 
                console.log(result)
                setCPostList(result.data.cPostList) 
                setCCategoryList(result.data.cCategoryList)
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
        jaxios.get('/api/admin/getCPostList', {params:{page:p, key}})
        .then((result)=>{ 
            setCPostList(result.data.cPostList) 
            setCCategoryList(result.data.cCategoryList)
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
                <div className='title'>커뮤니티</div>
                <div className='row tableTitle'>
                    <div className='col'>카테고리</div>
                    <div className='col'>제목</div>
                    <div className='col'>글쓴이</div>
                    <div className='col'>익명글 여부</div>
                    <div className='col'>게시일</div>
                </div>
                {
                    (cPostList[0])?(
                        cPostList.map((cPost, idx)=>{
                            return (
                                <div className='row' onClick={()=>{navigate(`/communityDetail/${cPost.cpostId}`)}}>
                                    <div className='col'>
                                        {
                                            (cPost.category)?
                                            (cCategoryList[cPost.category.categoryId].categoryName):
                                            (<></>)
                                        }
                                    </div>
                                    <div className='col'>{cPost.title}</div>
                                    <div className='col'>{cPost.member.userid} {(cPost.member.provider)?(<>({cPost.member.provider})</>):(<></>)}</div>
                                    <div className='col'>{cPost.isAnonymous}</div>
                                    <div className='col'>
                                        {
                                            (cPost.indate)?
                                            (cPost.indate.substring(0, 10)):
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

export default CommunityList