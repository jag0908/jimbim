// KakaoIdLogin.js
import React, {useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { loginAction } from '../../store/userSlice';
import axios from 'axios'
import { Cookies } from 'react-cookie';

function KakaoIdLogin() {

    const {userid} = useParams()
    const navigate = useNavigate()
    const cookies = new Cookies()
    const dispatch = useDispatch();

    useEffect(
        ()=>{
            axios.post('/api/member/login', null, {params:{ username:userid, password:'KAKAO'}})
            .then((result)=>{
                if( result.data.error == 'ERROR_LOGIN' ){
                    return alert("이메일 또는 패스워드 오류입니다");
                }else{
                    dispatch( loginAction( result.data ) );
                    cookies.set('user', JSON.stringify(result.data), {path:'/',});
                    navigate('/');
                }
            })
        },[]
    )

    return (
        <div>KakaoIdLogin</div>
    )
}

export default KakaoIdLogin