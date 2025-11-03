import React ,{useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

function Join() {
    const [userid, setUserid] = useState('')

    const [reid, setReid]=useState('')
    const [message, setMessage]=useState('')
    const [idCheckMsgStyle, setIdCheckMsgStyle] = useState({})

    const [pwd, setPwd] = useState('');
    const [pwdChk, setPwdChk] = useState('');

    const navigate = useNavigate()

    function idCheck(){
        if( !userid ){ return alert('아이디를 입력하세요')}
        axios.post('/api/member/idcheck', null, {params:{userid}})
        .then((result)=>{
            if( result.data.msg === 'ok'){
                setMessage('사용가능')
                setReid(userid);
                setIdCheckMsgStyle({flex:'1', textAlign:'center', fontWeight:'bold' , color:'blue'})
            }else{
                setMessage('사용 불가능')
                setReid('')
                setIdCheckMsgStyle({flex:'1', textAlign:'center', fontWeight:'bold' , color:'red'})
            }
        }).catch((err)=>{console.error(err)})
    }

    function onSubmit(){
        if(!userid){ return alert('아이디를 입력하세요')}
        if( !pwd ){return alert('패스워드를 입력하세요')}

        if( pwd !== pwdChk){return alert('패스워드 확인이 일치하지 않습니다')}
        if( reid !== userid){return alert('아이디 중복을 체크해주세요')}

        axios.post('/api/member/join', {userid, pwd/*, name, email, phone, zip_num, address1, address2, address3 */})
        .then(()=>{ 
            alert('회원가입이 완료되었습니다. 로그인하세요');
            navigate('/login')
        } ).catch((err)=>{console.error(err)})

    }
    return (
        <article>
            <div>Join</div>
            <div className='field'>
                <label>USERID</label>
                <input type="text" style={{flex:'2'}} value={userid} onChange={(e)=>{
                    setUserid( e.currentTarget.value )
                }}/>
                <button style={{flex:'1'}} onClick={ ()=>{idCheck()} }>ID CHECK</button>
                <div style={idCheckMsgStyle}>{message}</div>
                <input type='hidden' name='reid' value={reid} />
            </div>
            <div className='field'>
                <label>PASSWORD</label>
                <input type="password" value={pwd} onChange={
                    (e)=>{ setPwd(e.currentTarget.value )}
                }/>
            </div>
            <div className='field'>
                <label>RETYPE PW</label>
                <input type="password"  value={pwdChk} onChange={
                    (e)=>{ setPwdChk(e.currentTarget.value )}
                }/>
            </div>
            <div className="btns">
                <button onClick={()=>{onSubmit()}}>JOIN</button>
                <button >BACK</button>
            </div>
        </article>
    )
}

export default Join