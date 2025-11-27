import React , {useState, useEffect} from 'react'
import axios from 'axios'
import {Cookies} from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../../store/userSlice';
import '../../style/login.css';

function Login() {

    const loginUser = useSelector(state=>state.user)
    const [userid, setUserid]=useState('')
    const [pwd, setPwd]=useState('')
    const cookies = new Cookies()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const baseURL = process.env.REACT_APP_BASE_URL;

    useEffect(
        ()=>{
            if( loginUser && loginUser.userid ){
                navigate('/')
            }
        },[loginUser, navigate]
    )
    const activeEnter = (e) => {
        if(e.key === "Enter") {
            onloginlocal();
        }
    }

    function onloginlocal(){
        if( !userid ){ return alert('아이디를 입력하세요')}
        if( !pwd ){ return alert('패스워드를 입력하세요')}

        axios.post('/api/member/login', null , {params:{ username:userid, password:pwd }})
        .then((result)=>{
            if( result.data.error === 'ERROR_LOGIN'){
                alert('아이디 비밀번호를 확인하세요')
            }else{
                dispatch( loginAction( result.data ) )
                cookies.set('user', JSON.stringify(result.data), {path:'/'})
                navigate('/')
            }
        }).catch((err)=>{console.error(err)})
    }

    return (
        <article>
            <div className='subPage'>
                <div className='memberform'>
                    <div className='formtitle'>로그인</div>
                    <div className='field'>
                        <label>아이디</label>
                        <input type='text' value={userid} onChange={(e)=>{setUserid( e.currentTarget.value)}} onKeyDown={(e) => activeEnter(e)}/>
                    </div>
                    <div className='field'>
                        <label>비밀번호</label>
                        <input type='password'  value={pwd} onChange={(e)=>{setPwd( e.currentTarget.value)}} onKeyDown={(e) => activeEnter(e)}/>
                    </div>
                    <div className='btns'>
                        <button onClick={()=>{ onloginlocal() }}>로그인</button>
                        <button onClick={()=>{ navigate('/join')}}>회원가입</button>
                        <button onClick={()=>{ navigate('/findaccount')}}>아이디/비밀번호 찾기</button>
                    </div>
                    <div className="kakaobutton">
                        <button onClick={
                            ()=>{window.location.href=`${baseURL}/member/kakaostart`}
                        }>KAKAO</button>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default Login