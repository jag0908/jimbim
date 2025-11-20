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

    function changeAdmin( userid, checked){
        if( checked ){
             jaxios.post('/api/admin/changeRoleAdmin', null, {params:{userid}})
            .then((result)=>{
                if( result.data.msg==='ok'){
                    alert(userid + '님이 관리자로 선정되셨습니다')
                }
            })
        }else{
            jaxios.post('/api/admin/changeRoleUser', null, {params:{userid}})
            .then((result)=>{
                if( result.data.msg==='ok'){
                    alert(userid + '님의 등급이 일반유저로 변경되었습니다')
                }
            })
        }
    }

    return (
        <div className='adminContainer'>
            <SubMenu />
            <div className='btns' style={{display:"flex", margin:"5px"}}>
                <input type="text" value={key} onChange={(e)=>{setKey(e.currentTarget.value)}} />
                <button style={{marginLeft:"auto"}} onClick={()=>{ onPageMove(1) }}>검색</button>
            </div>
            <div className='productTable'>
                <div className='row'>
                    <div className='col'>관리자/일반유저</div>
                    <div className='col' style={{flex:"1"}}>User ID</div>
                    <div className='col'>이름</div>
                    <div className='col'>블랙리스트 등급</div>
                    <div className='col'>탈퇴유저 여부</div>
                    <div className='col'>가입일</div>
                </div>
                {
                    (memberList)?(
                        memberList.map((member, idx)=>{
                            return (
                                <div className='row'>
                                    <div className='col'>
                                        {
                                            (member.memberRoleList && member.memberRoleList.includes('ADMIN'))?(
                                                <input type="checkbox" value={member.userid} onChange={(e)=>{
                                                    changeAdmin( member.userid, e.currentTarget.checked )
                                                }} checked/>
                                            ):(
                                                <input type="checkbox" value={member.userid} onChange={(e)=>{
                                                    changeAdmin( member.userid, e.currentTarget.checked )
                                                }} />
                                            )
                                        }
                                    </div>
                                    <div className='col'  style={{flex:"1"}}>{member.userid} {(member.provider)?(<>({member.provider})</>):(<></>)}</div>
                                    <div className='col'>{member.name}</div>
                                    <div className='col'>{member.blacklist}</div>
                                    <div className='col'>{member.deleteyn}</div>
                                    <div className='col'>{member.indate.substring(0, 10)}</div>
                                </div>
                            )
                        })
                    ):(<span>loading...</span>)
                }
            </div>


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
                            <span style={{cursor:"pointer"}} key={idx} onClick={
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
        
        </div>
    )
}

export default MemberList