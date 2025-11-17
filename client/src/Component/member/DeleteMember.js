import React from 'react'
import { useNavigate } from 'react-router-dom'

function DeleteMember() {
    const navigate = useNavigate()
    return (
        <div>
            <div>회원탈퇴 추가예정</div>
            <div className='btns'>
                <button onClick={()=>{navigate('/mypage')}} style={{backgroundColor:"red"}}>회원탈퇴</button>
                <button onClick={()=>{navigate('/mypage')}}>돌아가기</button>
            </div>
        </div>
    )
}

export default DeleteMember