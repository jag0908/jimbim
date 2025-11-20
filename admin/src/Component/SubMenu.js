import React, { useSyncExternalStore } from 'react'
import {Link , useNavigate } from 'react-router-dom'
import { logoutAction } from '../store/userSlice'
import { useDispatch } from 'react-redux'
import { Cookies } from 'react-cookie'
import axios from 'axios'

function SubMenu() {
    const navigate = useNavigate()
    const cookies = new Cookies()
    const dispatch = useDispatch()

    function onLogout(){
        dispatch( logoutAction() )
        cookies.remove('user')
        navigate('/')
    }

    return (
        <div className='adminmenu'>
            <Link to='/memberList'>회원목록</Link>
            <Link to='/'>상품목록</Link>
            <Link to='/'>거래내역</Link>
            <Link to='/'>Q & A</Link>
            <button onClick={()=>{onLogout()}}>로그아웃</button>
        </div>
    )
}

export default SubMenu