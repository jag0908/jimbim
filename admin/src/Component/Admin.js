import React, {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {Cookies} from 'react-cookie'
import { loginAction } from '../store/userSlice'
import { useDispatch } from 'react-redux'
// import '../style/admin.css'

function Admin() {
    const [userid, setUserid] = useState('');
    const [pwd, setPwd] = useState('');
    const navigate = useNavigate();
    const cookies = new Cookies();
    const dispatch = useDispatch();
    const clientUrl = 'http://localhost:3000';
    //const clientUrl = 'http://15.165.124.19';

    async function onLogin(){
        if( !userid ){ return alert('아이디를 입력하세요')}
        if( !pwd ){ return alert('패스워드를 입력하세요')}

        const result = await axios.post("/api/member/login", null , {params:{username:userid, password:pwd}})
        if( result.data.error === 'ERROR_LOGIN'){
            alert('아이디 비번을 확인하세요')
        }else{
            if(result.data.roleNames.includes('ADMIN')){
                cookies.set('user', JSON.stringify(result.data), {path:'/'} )
                dispatch( loginAction( result.data) )
                navigate('/memberList')
            }else{
                return alert('관리자 권한이 없는 계정입니다')
            }
        }
    }

    const activeEnter = (e) => {
        if(e.key === "Enter") {
            onLogin();
        }
    }

    return (
        <div className='AdminForm'>
            <h2>Admin LogIn</h2>
            <div className="field">
                <label>Admin ID</label>
                <input type="text" value={userid} onChange={(e)=>{setUserid( e.currentTarget.value )}} onKeyDown={(e) => activeEnter(e)}/>
            </div>
            <div className="field">
                <label>Password</label>
                <input type="password" value={pwd} onChange={(e)=>{setPwd( e.currentTarget.value )}} onKeyDown={(e) => activeEnter(e)}/>
            </div>
            <div className="btns">
                <button onClick={()=>{ onLogin(); }}>로그인</button>
            </div>
            <div className="btns">
                <button onClick={()=>{ navigate(`${clientUrl}`); }} className='graybtn'>일반 페이지로 돌아가기</button>
            </div>
        </div>
    )
}

export default Admin