import React, {useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector , useDispatch } from 'react-redux'
import { logoutAction } from '../store/userSlice'
import { Cookies } from 'react-cookie'
import jaxios from '../util/jwtutil'

function Index() {
    const loginUser = useSelector( state=>state.user )
    const dispatch = useDispatch()
    const cookies = new Cookies()
    const navigate = useNavigate()
/*
    useEffect(
        ()=>{
            console.log(loginUser)
            jaxios.post("/api/member/test")
            .then()
            .catch((err)=>{console.error(err)});
        },[]
    )
*/
    function onLogout() {
        dispatch( logoutAction() )
        cookies.remove('user')
        navigate('/')
    }
    return (
        <article>
            <div>Index</div>
            {
                (loginUser.userid)?(
                    <div className='logininfo'>
                        <div>{loginUser.userid}({loginUser.name})</div>
                        <div><Link to='/mypage'>마이페이지</Link></div>
                        <div onClick={()=>{ onLogout() }}>LOGOUT</div>
                    </div>
                ):(
                    <>
                        <div><Link to='/login'>로그인</Link></div>
                        <div><Link to='/join'>회원가입</Link></div>
                    </>
                )
            }
        </article>
    )
}

export default Index