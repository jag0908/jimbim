import React, { useEffect } from 'react'
import {Link , useNavigate } from 'react-router-dom'
import { logoutAction } from '../store/userSlice'
import { useDispatch,useSelector } from 'react-redux'
import { Cookies } from 'react-cookie'
import axios from 'axios'

function SubMenu(props) {
    const loginUser = useSelector( state=>state.user)
    const navigate = useNavigate()
    const cookies = new Cookies()
    const dispatch = useDispatch()

    const currentStyle = {
        // backgroundcolor : "#8a2be2" blueviolet
        backgroundColor : "#6809c0"
    }

    const type = props.type

    function onLogout(){
        dispatch( logoutAction() )
        cookies.remove('user')
        navigate('/')
    }

    return (
        <div className='adminmenu'>
            <div className='loginadminarea'>
                관리자 {loginUser.userid} 로그인중 <button onClick={()=>{onLogout()}}>로그아웃</button>
            </div>
            <div className='menutitle' style={(type=='member')?(currentStyle):({})}><Link to='/memberList'>회원목록</Link></div>
            <div className='menutitle' style={(type=='sh')?(currentStyle):({})}><Link to='/shList'>상품목록(중고마을)</Link></div>
            <div className='menutitle' style={(type=='order')?(currentStyle):({})}><Link to='/orderList'>거래내역</Link></div>
            <div className='menutitle' style={(type=='qna')?(currentStyle):({})}><Link to='/qnaList'>Q & A</Link></div>
        </div>
    )
}

export default SubMenu