import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'

function Mypage() {
    const loginUser = useSelector( state=>state.user )

    useEffect(
        ()=>{
            console.log(loginUser)
        },[]
    )

    return (
        <article>
            <div>Mypage</div>
            <div><img src={loginUser.profileImg}/></div>
            <div>이름</div><div>{loginUser.name}</div>
            <div>소개글</div><div>{loginUser.profileMsg}</div>
        </article>
    )
}

export default Mypage