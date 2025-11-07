import React ,{useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

function FindAccount() {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [userid, setUserid] = useState('')
    const [viewId, setViewId] = useState({display:'none'})

    const [usercode, setUsercode] = useState('')
    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')
    const [pwdChk, setPwdChk] = useState('')
    const [ viewPW, setViewPW ] = useState({display:'none'})

    const navigate = useNavigate()

    function findid(){
        axios.post('/api/member/findid', null, {params:{name, phone}})
        .then((result)=>{
            if( result.data.msg=='ok'){
                setUserid(result.data.userid)
                setViewId({ width:'100%', margin:'5px 0', border:'1px solid green', padding:'5px 0', display: 'flex'})
            }else{
                alert('해당이름과 전화번호의 회원이 없습니다.')
            }
        }).catch((err)=>{console.error(err)})
    }

    
    function sendMail(){
        if(!email ){return alert('이메일을 입력하세요')}
        axios.post('/api/member/sendMail', null, {params:{email}})
        .then((result)=>{
            if( result.data.msg == 'ok' ){
                alert('인증코드가 이메일로 전송되었습니다. 이메일을 확인하세요')
            }else{
                alert('인증코드 전송에 실패했어요. 이메일 주소를 확인하세요. 계속해서 실패하면 관리에게 문의하세요')
            }
        })
    }

    function confirmCode(){
        if(!usercode ){return alert('전송받은 인증코드를 입력하세요')}
        axios.post('/api/member/confirmCode', null, {params:{usercode}})
        .then((result)=>{
            if( result.data.msg == 'ok' ){
                alert('인증되었습니다. 패스워드를 재설정하세요')
                setViewPW({ width:'100%', margin:'5px 0', border:'1px solid green', padding:'5px 0', display: 'flex'})
            }else{
                alert('코드가 일치하지 않습니다')
            }
        })
    }


    function resetPw(){
        if( !pwd ){return alert('새 패스워드를 입력하세요')}
        if( pwd != pwdChk ){return alert('패스워드 확인이 일치하지 않습니다')}
        axios.post('/api/member/resetPwd', null, {params:{userid, pwd}})
        .then((result)=>{
            if( result.data.msg == 'ok' ){
                alert('패스워드가 변경되었습니다. 새로운 패스워드로 로그인하세요')
                navigate('/login')
            }
        })
    }

    return (
        <article>
            <div className='subPage' >
                <div className='memberform'>
                    <h2>FIND ACCOUNT</h2>
                    <div className='field'>
                        <label>NAME</label>
                        <input type="text" style={{flex:'3'}} value={name} onChange={(e)=>{
                            setName( e.currentTarget.value )}}/>
                    </div>
                    <div className='field'>
                        <label>PHONE</label>
                        <input type="text" style={{flex:'3'}} value={phone} onChange={(e)=>{
                            setPhone( e.currentTarget.value )}}/>
                    </div>
                    <div className="btns">
                        <button onClick={()=>{findid()}}>FIND ID</button>
                    </div>

                    <div className='field' style={viewId}><b>검색하신 아이디는 {userid} 입니다</b></div>
                    <div className='field' style={viewId}>비밀번호를 찾으려면 아래 이메일인증을 진행하세요</div>

                    <div className='field' style={viewId}>
                        <label>EMAIL</label>
                        <input type="text" style={{flex:'2'}} value={email} onChange={(e)=>{
                            setEmail( e.currentTarget.value )}}/>
                        <button style={{flex:'1'}} onClick={()=>{sendMail()}}>이메일 보내기</button>
                    </div>
                    <div className='field' style={viewId}>
                        <label>인증코드</label>
                        <input type="text" style={{flex:'2'}} value={usercode} onChange={(e)=>{setUsercode( e.currentTarget.value )}}/>
                        <button  style={{flex:'1'}} onClick={()=>{confirmCode()}}>코드 인증</button>
                    </div>
                    
                    <div className='field' style={viewPW}>
                        <label>NEW PASSWORD</label>
                        <input type="password" style={{flex:'3'}} value={pwd} onChange={(e)=>{setPwd( e.currentTarget.value )}}/>
                    </div>
                    <div className='field' style={viewPW}>
                        <label>NEW PASSWORD CHK</label>
                        <input type="password" style={{flex:'3'}} value={pwdChk} onChange={(e)=>{setPwdChk( e.currentTarget.value )}}/>
                    </div>
                    <div className="btns"  style={viewPW}>
                        <button onClick={()=>{resetPw()}}>RESET PW</button>
                    </div>

                </div>
            </div>
        </article>
    )
}

export default FindAccount