import React, { useEffect, useState } from 'react'
import SubMenu from '../SubMenu'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';
import '../../style/admin.css'


function MemberList() {
    const loginUser = useSelector( state=>state.user)
    const [memberList, setMemberList] = useState([]);
    const [paging, setPaging]=useState({});
    const navigate = useNavigate();
    const [beginEnd, setBeginEnd] = useState();
    const [key, setKey] = useState('')
    const type = 'member'

    useEffect(
        ()=>{
            if( !loginUser.userid ||  !loginUser.roleNames.includes('ADMIN') ){ 
                alert('권한이 없습니다')
                navigate('/')
            }
            jaxios.get('/api/admin/getMemberList', {params:{page:1, key}})
            .then((result)=>{ 
                setMemberList(result.data.memberList) 
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
        jaxios.get('/api/admin/getMemberList', {params:{page:p, key}})
        .then((result)=>{ 
            setMemberList(result.data.memberList) 
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
                <div className='title'>회원목록</div>
                <div className='row tableTitle'>
                    <div className='col'>User ID</div>
                    <div className='col'>이름</div>
                    <div className='col'>블랙리스트 등급</div>
                    <div className='col'>관리자 권한</div>
                    <div className='col'>탈퇴유저 여부</div>
                    <div className='col'>가입일</div>
                </div>
                {
                    (memberList)?(
                        memberList.map((member, idx)=>{
                            return (
                                <div className='row' onClick={()=>{navigate(`/memberDetail/${member.member_id}`)}}>
                                    <div className='col'>{member.userid} {(member.provider)?(<>({member.provider})</>):(<></>)}</div>
                                    <div className='col'>{member.name}</div>
                                    <div className='col'>{member.blacklist}</div>
                                    <div className='col'>
                                        {
                                            (member.memberRoleList && member.memberRoleList.includes('ADMIN'))?
                                            (<>Y</>):(<>N</>)
                                        }
                                    </div>
                                    <div className='col'>{member.deleteyn}</div>
                                    <div className='col'>{member.indate.substring(0, 10)}</div>
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
                                <span style={{cursor:"pointer"}} className={(page==paging.page)?('currentPage'):''} key={idx} onClick={
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

export default MemberList