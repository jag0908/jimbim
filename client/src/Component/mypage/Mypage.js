import React, {useState, useEffect, useRef} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Cookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../../store/userSlice';
import axios from 'axios';
import jaxios from '../../util/jwtutil';
import '../../style/login.css';
import SideMenu from './SideMenu';
import '../../style/mypage.css';

function Mypage() {
    const loginUser = useSelector( state=>state.user )
    const navigate = useNavigate();
    const cookies = new Cookies()
    const dispatch = useDispatch();

    const [prePwd, setPrePwd] = useState('');
    const [pwd, setPwd] = useState('');
    const [pwdChk, setPwdChk] = useState('');

    const [email, setEmail] = useState('');
    const [phone1, setPhone1] = useState('');
    const [phone2, setPhone2] = useState('');
    const [phone3, setPhone3] = useState('');
    const [rrn1, setRrn1] = useState('');
    const [rrn2, setRrn2] = useState('');

    const [terms_agree, setTerms_agree] = useState('')
    const [personal_agree, setPersonal_agree] = useState('')

    const [type, setType] = useState('')

    const [member, setMember] = useState({});

    function reset(member){
        setMember( member );
        setType('')
        setPrePwd('')
        setPwd('')
        setPwdChk('')
        setEmail(member.email)
        setPhone1(member.phone.substring(0,3))
        setPhone2(member.phone.substring(4,8))
        setPhone3(member.phone.substring(9,13))
        setRrn1(member.rrn.substring(0,6))
        setRrn2(member.rrn.substring(7,8))
        setTerms_agree(member.terms_agree)
        setPersonal_agree(member.personal_agree)
    }

    useEffect(
        ()=>{
            if(!loginUser.userid){
                alert("로그인이 필요한 서비스입니다")
                navigate("/")
            }else{
                jaxios.get(`/api/member/getMember`, {params:{userid:loginUser.userid}} )
                .then((result)=>{
                    reset(result.data.member)
                }).catch((err)=>{ console.error(err);  })
            }
        },[]
    )

    function edit(typ){
        reset(member)
        setType(typ)
    }

	// 숫자만 입력 가능하게
    const getNumberOnly = (e) => {
        //e.target.value = e.target.value.replaceAll(/\D/g, "");
    };

    // 주민번호 검사
    function checkrrn(rrn1, rrn2){
        const lastRrn= (Number)(rrn2);
        let year = (Number)(rrn1.substr(0,2))
        if(lastRrn===1 || lastRrn===2){
            year += 1900;
        }else if(lastRrn===3 || lastRrn===4){
            year += 2000;
        }

        const month = (Number)(rrn1.substr(2,2))
        const day = (Number)(rrn1.substr(4,2))

        if(lastRrn<1 || lastRrn>4) return false;    // 뒷자리가 1~4가 아니면 금지
        if(month===0 || day===0) return false;    // 월이나 일이 0이면 금지
        
        switch(month){                          // 월에 따라 일이 초과하면 금지
            case 1: case 3: case 5: case 7: case 8: case 10: case 12:
                if(day>31) return false;
                break;
            case 4: case 6: case 9: case 11:
                if(day>30) return false;
                break;
            case 2:
                if((year%4===0 && year%100!==0) || year%400===0){
                    if(day>29) return false;
                }else{
                    if(day>28) return false;
                }
                break;
            default: return false;              // 월이 13 이상이면 금지
        }
        return true
    }
    function isCheck(yn){
        return yn==='Y';
    }
    async function onSubmit(){
        let rrn=''
        let phone=''
        
        if( type==='email'){
            if(!email) return alert('이메일을 입력하세요')
            
            // 유효이메일 양식 체크
            let regix = email.match( /\w+@(\w+[.])+\w+/g );
            if( !regix ){  return alert('유효한 이메일을 입력하세요'); }
        }

        if( type==='phone'){
            if(!phone1 && !phone2 && !phone3) return alert('전화번호를 입력하세요')
            phone = phone1+"-"+phone2+"-"+phone3
        }

        if( type==='rrn'){
            if(!rrn1 && !rrn2) return alert('주민등록번호를 입력하세요')
            if(!checkrrn(rrn1, rrn2)){return alert('유효한 주민등록번호를 입력하세요')};
            rrn = rrn1+"-"+rrn2+"******"
        }
        
        await jaxios.post('/api/member/updateMember', {userid:loginUser.userid, email, phone, rrn})
        .then((result)=>{
            alert('정보 수정이 완료되었습니다');
            reset(result.data.member)
            navigate("/mypage")
        } ).catch((err)=>{console.error(err);})
    }
    async function updatePwd(){
        if(type==='pwd'){
            if(!prePwd){ return alert('현재 비밀번호를 입력하세요')}
            if( !pwd ){return alert('새 비밀번호를 입력하세요')}
            if( pwd !== pwdChk){return alert('비밀번호 확인이 일치하지 않습니다')}

            let res = await jaxios.post('/api/member/pwdcheck', null, {params:{userid:loginUser.userid, pwd:prePwd}})
            if(res.data.msg !== 'ok'){
                return alert('현재 비밀번호가 일치하지 않습니다');
            }else{

                await jaxios.post('/api/member/updatePwd', {userid:loginUser.userid, pwd:pwd })
                .then((result)=>{
                    alert('정보 수정이 완료되었습니다');
                } ).catch((err)=>{console.error(err);})

                await axios.post('/api/member/login', null , {params:{ username:loginUser.userid, password:pwd }})
                .then((result)=>{
                    if( result.data.error === 'ERROR_LOGIN'){
                        alert('아이디 비밀번호를 확인하세요')
                    }else{
                        console.log(result.data)
                        dispatch( loginAction( result.data ) )
                        cookies.set('user', JSON.stringify(result.data), {path:'/'})
                    }
                }).catch((err)=>{console.error(err)})

                await jaxios.get(`/api/member/getMember`, {params:{userid:loginUser.userid}} )
                .then((result)=>{
                    reset(result.data.member)
                }).catch((err)=>{ console.error(err);  })
            }
        }

    }
    async function updateAgree(agree, yn){
        if(window.confirm('수정하시겠습니까?')){
            await jaxios.post('/api/member/updateAgree', null, {params:{userid:loginUser.userid, agree, yn}})
            .then((result)=>{
                alert('정보 수정이 완료되었습니다');
            } ).catch((err)=>{console.error(err);})

            await jaxios.get(`/api/member/getMember`, {params:{userid:loginUser.userid}} )
            .then((result)=>{
                reset(result.data.member)
            }).catch((err)=>{ console.error(err);  })
        }
    }
    return (
        <article style={{height:'100%'}}>
            {/* height 짤리는 오류, css 중복되는 오류때문에 넣음 */}
            <div style={{display:'flex'}}>
                <SideMenu/>
                <div className='mypage'>
                    {
                        (loginUser.provider==='KAKAO')?
                        (null):
                        (<>
                            <div className='field'>
                                <label>ID</label>
                                <div>{loginUser.userid}</div>
                            </div>
                            <div className='field'>
                                <label>비밀번호</label>
                                {
                                    (type==='pwd')?
                                    (<>
                                        <div className='field'>
                                            <label>현재 비밀번호</label>
                                            <input type="password" value={prePwd} onChange={
                                                (e)=>{ setPrePwd(e.currentTarget.value )}
                                            }/>
                                        </div>
                                        <div className='field'>
                                            <label>새 비밀번호</label>
                                            <input type="password" value={pwd} onChange={
                                                (e)=>{ setPwd(e.currentTarget.value )}
                                            }/>
                                        </div>
                                        <div className='field'>
                                            <label>비밀번호 확인</label>
                                            <input type="password" value={pwdChk} onChange={
                                                (e)=>{ setPwdChk(e.currentTarget.value )}
                                            }/>
                                        </div>
                                        <div className='btns'>
                                            <button onClick={()=>{updatePwd()}}>수정</button>
                                            <button onClick={()=>{edit('')}}>취소</button>
                                        </div>
                                    </>):
                                    (<>
                                        <div>********</div>
                                        <div className='btns'>
                                            <button onClick={()=>{edit('pwd')}}>변경</button>
                                        </div>
                                    </>)
                                }
                            </div>
                        </>)
                    }
                    <div className='field'>
                        <label>이메일</label>
                        {
                            (type==='email')?
                            (<>
                                <input type="text" className='inputemail' value={email} onChange={(e)=>{
                                    setEmail( e.currentTarget.value )
                                }}/>
                                <div className='btns'>
                                    <button onClick={()=>{onSubmit()}}>수정</button>
                                    <button onClick={()=>{edit('')}}>취소</button>
                                </div>
                            </>):
                            (<>
                                <div>{member.email}</div>
                                <div className='btns'>
                                    <button onClick={()=>{edit('email')}}>변경</button>
                                </div>
                            </>)
                        }
                    </div>
                    <div className='field'>
                        <label>전화번호</label>
                        {
                            (type==='phone')?
                            (<>
                                <div>
                                    <input type="text" className='inputphone' value={phone1} onInput={getNumberOnly} maxLength="3" onChange={(e)=>{
                                        setPhone1( e.currentTarget.value )
                                    }}/><span className='memberformdash'>&nbsp;-&nbsp;</span>
                                    <input type="text" className='inputphone' value={phone2} onInput={getNumberOnly} maxLength="4" onChange={(e)=>{
                                        setPhone2( e.currentTarget.value )
                                    }}/><span className='memberformdash'>&nbsp;-&nbsp;</span>
                                    <input type="text" className='inputphone' value={phone3} onInput={getNumberOnly} maxLength="4" onChange={(e)=>{
                                        setPhone3( e.currentTarget.value )
                                    }}/>
                                </div>
                                <div className='btns'>
                                    <button onClick={()=>{onSubmit()}}>수정</button>
                                    <button onClick={()=>{edit('')}}>취소</button>
                                </div>
                            </>):
                            (<>
                                <div>{member.phone}</div>
                                <div className='btns'>
                                    <button onClick={()=>{edit('phone')}}>변경</button>
                                </div>
                            </>)
                        }
                    </div>
                    <div className='field'>
                        <label>주민등록번호</label>
                        {
                            (type==='rrn')?
                            (<>
                                <div>
                                    <input type="text" className='inputrrn1' value={rrn1} onInput={getNumberOnly} maxLength="6" onChange={(e)=>{
                                        setRrn1( e.currentTarget.value )
                                    }}/><span className='memberformdash'>&nbsp;-&nbsp;</span>
                                    <input type="text" id='inputrrn2' value={rrn2} onInput={getNumberOnly} maxLength="1" onChange={(e)=>{
                                        setRrn2( e.currentTarget.value );
                                    }}/> * * * * * * 
                                </div>
                                <div className='btns'>
                                    <button onClick={()=>{onSubmit()}}>수정</button>
                                    <button onClick={()=>{edit('')}}>취소</button>
                                </div>
                            </>):
                            (<>
                                <div>{member.rrn}</div>
                                <div className='btns'>
                                    <button onClick={()=>{edit('rrn')}}>변경</button>
                                </div>
                            </>)
                        }
                    </div>
                    <div className='field'>
                        <label>동의사항(선택)</label>
                        <div className='checkboxField'>
                            <div className='checkboxLabel'>
                                <label>약관 동의</label>
                            </div>
                            <div className='agreeCheckbox'>
                            {
                                (terms_agree === 'N' || terms_agree === 'Y')?
                                (
                                    (terms_agree === 'N')?  
                                    (<input type='checkbox' value={terms_agree} checked={isCheck(terms_agree)} readOnly onClick={()=>{updateAgree('terms', terms_agree)}}/>):
                                    (<input type='checkbox' value={terms_agree} checked={isCheck(terms_agree)} readOnly onClick={()=>{updateAgree('terms', terms_agree)}}/>)
                                ):(null)
                            }
                            </div>
                        </div> 
                        <div className='checkboxField'>
                            <div className='checkboxLabel'>
                                <label>개인정보 동의</label>
                            </div>
                            <div className='agreeCheckbox'>
                            {
                                (personal_agree === 'N' || personal_agree === 'Y')?
                                (
                                    (personal_agree === 'N')?  
                                    (<input type='checkbox' value={personal_agree} checked={isCheck(personal_agree)} readOnly onClick={()=>{updateAgree('personal', personal_agree)}}/>):
                                    (<input type='checkbox' value={personal_agree} checked={isCheck(personal_agree)} readOnly onClick={()=>{updateAgree('personal', personal_agree)}}/>)
                                ):(null)
                            }
                            </div>
                        </div>
                    </div>
                    <div className='field'>
                        <label>가입일</label>
                        <div>{
                            (member.indate)?
                            (member.indate.substring(0,10)):(null)
                        }</div>
                    </div>
                    <div className='btns'>
                        <button onClick={()=>{navigate('/deleteMember')}} style={{backgroundColor:"red"}}>회원탈퇴</button>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default Mypage