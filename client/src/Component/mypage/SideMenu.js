import React from 'react'
import { useNavigate } from 'react-router-dom'

function SideMenu() {
    const navigate = useNavigate()

    return (
        <div className='sidebar'>
            <h3>마이페이지</h3>
            <ul>
                <li onClick={()=>{navigate("/mypage")}}>로그인 정보</li>
                <li onClick={()=>{navigate("/mypage/addresslist")}}>주소록</li>
            </ul>
        </div>
    )
}

export default SideMenu