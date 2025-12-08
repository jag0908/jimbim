import React, { useEffect, useState } from 'react'
import '../style/header.css'
import ChatBot from './ChatBot';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { Cookies } from 'react-cookie'
import { logoutAction } from '../store/userSlice'
import jaxios from '../util/jwtutil';

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

    // 전체알람
    const [allAlramCount, setAllAlramCount] = useState(null);
    const location = useLocation();
    useEffect(() => {
        if (!loginUser.userid) return;
        runMyFunction();
    }, [location.pathname])
    function runMyFunction() {
        jaxios.get(`/api/alram/allAlramCount/${loginUser.member_id}`)
            .then((res)=> {
                console.log(res);
                setAllAlramCount(res.data.alram);
            }).catch(err=>console.error(err));
    }

  return (
    <div id='header'>
        <div className='util'>
            {
                (loginUser.userid)?
                (
                    <>
                        <a href='#!' onClick={()=>{ onLogout() }}>로그아웃</a>
                        <Link to={"/mypage"}>마이페이지</Link>
                        <Link to={`/styleUser/${loginUser.userid}`}>프로필</Link>
                    </>):
                (
                    <>
                    <Link to={"/login"}>로그인</Link>
                    <Link to={"/join"}>회원가입</Link>
                    </>
                )
            }
            

            <Link to={"/customer/qna"}>고객센터</Link>

            <ChatBot />

            {
                (loginUser.userid)?
                <Link to={`/alram/${loginUser.member_id}`} className='hAllAlram'>
                    알림
                    <div className='floatCount'>{allAlramCount}</div>
                </Link> :
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
                    <Link to={"/shop"}>SHOP</Link>
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