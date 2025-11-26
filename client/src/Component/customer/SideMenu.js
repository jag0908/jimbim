import React from 'react'
import { useNavigate } from 'react-router-dom'

function SideMenu() {
    const navigate = useNavigate()

    return (
        <div className='sidebar'>
            <h3>고객센터</h3>
            <ul>
                <li onClick={()=>{navigate("/customer/qna")}}>문의하기</li>
                <li onClick={()=>{navigate("/customer/map")}}>찾아오시는 길</li>
            </ul>
        </div>
    )
}

export default SideMenu