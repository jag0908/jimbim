import React from 'react'
import { Link } from 'react-router-dom'

function SideMenu() {
    return (
        <div className='sidebar'>
            <h3>마이페이지</h3>
            <ul>
                <li><Link to={"/mypage"}>로그인 정보</Link></li>
                <li><Link to={"/mypage/addresslist"}>주소록</Link></li>
            </ul>
        </div>
    )
}

export default SideMenu