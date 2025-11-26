import React from 'react'
import '../style/header.css'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { Cookies } from 'react-cookie'
import { logoutAction } from '../store/userSlice'

function Header() {
    const loginUser = useSelector( state=>state.user )
    const dispatch = useDispatch();
    const cookies = new Cookies();
    const navigate = useNavigate();

    function onLogout() {
        dispatch( logoutAction() )
        cookies.remove('user')
        navigate('/')
    }

  return (
    <div id='header'>
        <div className='util'>
            {
                (loginUser.userid)?
                (
                    <>
                        <a href='#!' onClick={()=>{ onLogout() }}>로그아웃</a>
                        <Link to={"/mypage"}>회원정보수정</Link>
                        <Link to={`/styleUser/${loginUser.userid}`}>MY</Link>
                    </>):
                (
                    <>
                    <Link to={"/login"}>로그인</Link>
                    <Link to={"/join"}>회원가입</Link>
                    </>
                )
            }
            

            <Link to={"/"}>고객센터</Link>
            {
                (loginUser.userid)?
                <Link to={`/alram/${loginUser.member_id}`}>알림</Link> :
                null
            }

        </div>
        <div className='inner'>
            <h1 className='logo'>
                <Link to={"/"}>
                    JIMBIM
                </Link>
            </h1>
            <div className='gnb'>
                <div className='list'>
                    <Link to={"/"}>HOME</Link>
                </div>   
                <div className='list'>
                    <Link to={"/sh-page"}>중고마을</Link>
                </div>   
                <div className='list'> 
                    <Link to={"/"}>SHOP</Link>
                </div>
                <div className='list'>
                    <Link to={"/communityList"}>커뮤니티</Link>
                </div>
                <div className='list'>
                    <Link to={"/style"}>STYLE</Link>
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default Header