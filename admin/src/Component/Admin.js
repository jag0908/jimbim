import React, {useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {Cookies} from 'react-cookie'
import { loginAction } from '../store/userSlice'
import { useDispatch } from 'react-redux'
// import '../style/admin.css'

function Admin() {
    const [userid, setUserid] = useState();
    const [pwd, setPwd] = useState();
    const navigate = useNavigate();
    const cookies = new Cookies();
    const dispatch = useDispatch();

    const [adminTest, setAdminTest] = useState(); // 로그인 시도시 어드민 테스트용 메세지

    async function onLogin(){
        if( !userid ){ return alert('아이디를 입력하세요')}
        if( !pwd ){ return alert('패스워드를 입력하세요')}

        const result = await axios.post("/api/member/login", null , {params:{username:userid, password:pwd}})
        if( result.data.error === 'ERROR_LOGIN'){
            alert('아이디 비번을 확인하세요')
        }else{

            console.log('result.data ',result.data.roleNames)

            if(result.data.roleNames.includes('ADMIN')){
                cookies.set('user', JSON.stringify(result.data), {path:'/'} )
                dispatch( loginAction( result.data) )
                // navigate('') // 현재 테스트중으로 주소 이동하지않음 
            }else{
                return alert('관리자 권한이 없는 계정입니다')
            }
                setAdminTest(result.data.roleNames)
        }
    }

    return (
        <div className='AdminForm'>
            <div>
                어드민 로그인 방법<br/>
                워크벤치에서<br/>
                update member_member_role_list set member_role_list=1 where  member_member_id = (멤버아이디) 로 해당 멤버 관리자 권한 얻음<br/>
                어드민 계정으로 로그인 시도시 밑에 ADMIN 출력되면 관리자계정<br/>
                {adminTest}
            </div>
            <h2>Admin LogIn</h2>
            <div className="field">
                <label>Admin ID</label>
                <input type="text" value={userid} onChange={(e)=>{
                    setUserid( e.currentTarget.value );
                }}/>
            </div>
            <div className="field">
                <label>Password</label>
                <input type="password" value={pwd} onChange={(e)=>{
                    setPwd( e.currentTarget.value );
                }}/>
            </div>
            <div className="btns">
                <button onClick={()=>{ onLogin(); }}>로그인</button>
            </div>
        </div>
    )
}

export default Admin