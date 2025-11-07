import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Mypage() {
    const loginUser = useSelector( state=>state.user )
    const loginUserIndate = new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date(loginUser.indate))
    const navigate = useNavigate();

    useEffect(
        ()=>{
            console.log(loginUser)
            
        },[]
    )

    return (
        <article>
            <div>Mypage</div>
            <div><button onClick={()=>{navigate('/')}}>메인이동</button></div>
            <div><button onClick={()=>{navigate('/member/updateform')}}>회원정보수정</button></div>
            <div><button onClick={()=>{navigate('/mypage/addresslist')}}>주소록</button></div>
            <div>
                {
                    (loginUser.profileImg)?
                    (<img src={loginUser.profileImg}/>):
                    (<div>기본 프로필 사진</div>)
                }
            </div>
            <div>
                <div>이름</div>
                <div>{loginUser.name}</div>
            </div>
            <div>
                <div>소개글</div>
                <div>
                    {
                        (loginUser.profileMsg)?
                        (<>{loginUser.profileMsg}</>):
                        (<>소개글이 없습니다</>)
                    }
                </div>
            </div>
            <div>
                <div>이메일</div>
                <div>{loginUser.email}</div>
            </div>
            <div>
                <div>계정생성일</div>
                <div>{loginUserIndate}</div>
            </div>
        </article>
    )
}

export default Mypage