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
        // backgroundcolor : "#ff7e36" 
        // backgroundColor : "#ee6d25"
        backgroundColor : "#ff5e16"
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
                관리자 {loginUser.userid} 로그인중 <button onClick={()=>{onLogout()}} className='logout'>로그아웃</button>
            </div>
            <div className='menutitle' style={(type=='member')?(currentStyle):({})} onClick={()=>{navigate('/memberList')}}>회원목록</div>
            <div className='menutitle' style={(type=='sh')?(currentStyle):({})} onClick={()=>{navigate('/shList')}}>상품목록(중고마을)</div>
            <div className='menutitle' style={(type=='shop')?(currentStyle):({})} onClick={()=>{navigate('/shopList')}}>상품목록(SHOP)</div>
            <div className='menutitle' style={(type=='suggest')?(currentStyle):({})} onClick={()=>{navigate('/suggestList')}}>요청내역(SHOP)</div>
            {/* <div className='menutitle' style={(type=='order')?(currentStyle):({})}><Link to='/orderList'>거래내역</Link></div> */}
            <div className='menutitle' style={(type=='community')?(currentStyle):({})} onClick={()=>{navigate('/communityList')}}>커뮤니티</div>
            <div className='menutitle' style={(type=='qna')?(currentStyle):({})} onClick={()=>{navigate('/qnaList')}}>Q & A</div>
        </div>
    )
}

export default SubMenu