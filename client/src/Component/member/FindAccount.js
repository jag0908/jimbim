import React ,{useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

function FindAccount() {
    const [name, setName] = useState('')
    const [phone1, setPhone1] = useState('');
    const [phone2, setPhone2] = useState('');
    const [phone3, setPhone3] = useState('');
    const [userid, setUserid] = useState('')
    const [viewId, setViewId] = useState({display:'none'})

    const [usercode, setUsercode] = useState('')
    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')
    const [pwdChk, setPwdChk] = useState('')
    const [ viewPW, setViewPW ] = useState({display:'none'})

    const [ emailbutton, setEmailbutton] = useState('이메일 보내기')

    const navigate = useNavigate()

    // 숫자만 입력 가능하게
    const getNumberOnly = (e) => {
        //e.target.value = e.target.value.replaceAll(/\D/g, "");
    };

    function findid(){
        let phone=''
        
        if(!phone1 && !phone2 && !phone3) return alert('전화번호를 입력하세요')
        else phone = phone1+"-"+phone2+"-"+phone3


        axios.post('/api/member/findid', null, {params:{name, phone}})
        .then((result)=>{
            if( result.data.msg=='kakao'){
                alert('카카오 아이디는 카카오에 문의해주세요')
                setViewId({display:'none'})
                setViewPW({display:'none'})
            } else if( result.data.msg=='ok'){
                setUserid(result.data.userid)
                setViewId({display: 'flex'})
            }else{
                alert('해당이름과 전화번호의 회원이 없습니다.')
                setViewId({display:'none'})
                setViewPW({display:'none'})
            }
        }).catch((err)=>{console.error(err)})
    }

    
    async function sendMail(){
        if(!email ){return alert('이메일을 입력하세요')}
        setEmailbutton('이메일 보내는중...')
        await axios.post('/api/member/sendMail', null, {params:{email}})
        .then((result)=>{
            if( result.data.msg == 'ok' ){
                alert('인증코드가 이메일로 전송되었습니다. 이메일을 확인하세요')
            }else{
                alert('인증코드 전송에 실패했어요. 이메일 주소를 확인하세요. 계속해서 실패하면 관리자에게 문의하세요')
            }
            setEmailbutton('이메일 보내기')
        })
    }

    function confirmCode(){
        if(!usercode ){return alert('전송받은 인증코드를 입력하세요')}
        axios.post('/api/member/confirmCode', null, {params:{usercode}})
        .then((result)=>{
            if( result.data.msg == 'ok' ){
                alert('인증되었습니다. 패스워드를 재설정하세요')
                setViewPW({ margin:'5px 0', padding:'5px 0', display: 'flex'})
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
        <article style={{height:'100%'}}>
            <div className='subPage'>
                <div className='memberform'>
                    <div className='formtitle'>계정 찾기</div>
                    <div className='field'>
                        <label>이름</label>
                        <input type="text" value={name} onChange={(e)=>{
                            setName( e.currentTarget.value )}}/>
                    </div>
                    <div className='field'>
                        <label>전화번호</label>
                        <div>
                            <input type="text" className='inputphone' value={phone1} onInput={getNumberOnly} maxLength="3" onChange={(e)=>{
                                setPhone1( e.currentTarget.value )
                            }}/><span className='memberformdash'>&nbsp;-&nbsp;</span>
                            <input type="text" className='inputphone' value={phone2} onInput={getNumberOnly} maxLength="4" onChange={(e)=>{
                                setPhone2( e.currentTarget.value )
                            }}/><span className='memberformdash'>&nbsp;-&nbsp;</span>
                            <input type="text" className='inputphone'value={phone3} onInput={getNumberOnly} maxLength="4" onChange={(e)=>{
                                setPhone3( e.currentTarget.value )
                            }}/>
                        </div>
                    </div>
                    <div className="formBtns">
                        <button onClick={()=>{findid()}}>아이디 찾기</button>
                    </div>

                    <div className='field' style={viewId}><b>검색하신 아이디는 {userid} 입니다</b></div>
                    <div className='field' style={viewId}>비밀번호를 찾으려면 아래 이메일인증을 진행하세요</div>

                    <div className='field' style={viewId}>
                        <label>이메일</label>
                        <input type="text" className='inputemail' value={email} onChange={(e)=>{
                            setEmail( e.currentTarget.value )}}/>
                        <div className="formBtns">
                            <button onClick={()=>{sendMail()}}>{emailbutton}</button>
                        </div>
                    </div>
                    <div className='field' style={viewId}>
                        <label>인증코드</label>
                        <input type="text" value={usercode} onChange={(e)=>{setUsercode( e.currentTarget.value )}}/>
                        <div className="formBtns">
                            <button onClick={()=>{confirmCode()}}>코드 인증</button>
                        </div>
                    </div>
                    
                    <div className='field' style={viewPW}>
                        <label>새 비밀번호</label>
                        <input type="password" value={pwd} onChange={(e)=>{setPwd( e.currentTarget.value )}}/>
                    </div>
                    <div className='field' style={viewPW}>
                        <label>새 비밀번호 확인</label>
                        <input type="password" value={pwdChk} onChange={(e)=>{setPwdChk( e.currentTarget.value )}}/>
                    </div>
                    <div className="formBtns"  style={viewPW}>
                        <button onClick={()=>{resetPw()}}>비밀번호 변경</button>
                    </div>

                </div>
            </div>
        </article>
    )
}

export default FindAccount