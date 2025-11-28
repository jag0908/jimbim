import React from 'react'
import { useNavigate } from 'react-router-dom'

function SideMenu() {
    const navigate = useNavigate()

    return (
        <div className='sidebar' style={{height:'650px', marginTop:'20px'}}>
            <h3>내 정보</h3>
            <ul>
                <li onClick={()=>{navigate("/mypage")}}>로그인 정보</li>
                <li onClick={()=>{navigate("/mypage/profile")}}>프로필 관리</li>
                <li onClick={()=>{navigate("/mypage/addresslist")}}>주소록</li>
            </ul>
            {/* <h3>쇼핑 정보</h3>
            <ul>
                <li onClick={()=>{navigate("/mypage/buying")}}>구매 내역</li>
                <li onClick={()=>{navigate("/mypage/selling")}}>판매 내역</li>
                <li onClick={()=>{navigate("/mypage/zzim")}}>찜 목록</li>
            </ul> */}
        </div>
    )
}

export default SideMenu