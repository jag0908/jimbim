import React ,{useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

function Join() {
    const [userid, setUserid] = useState('')

    const [reid, setReid]=useState('')
    const [message, setMessage]=useState('')
    const [idCheckMsgStyle, setIdCheckMsgStyle] = useState({})

    const [pwd, setPwd] = useState('');
    const [pwdChk, setPwdChk] = useState('');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone1, setPhone1] = useState('');
    const [phone2, setPhone2] = useState('');
    const [phone3, setPhone3] = useState('');
    const [rrn1, setRrn1] = useState('');
    const [rrn2, setRrn2] = useState('');

    const [profile_img, setProfile_img] = useState('')
    const [imgStyle, setImgStyle] = useState({display:"none"});

    const [profile_msg, setProfile_msg] = useState('')

    const [terms_agree, setTerms_agree] = useState('N')
    const [personal_agree, setPersonal_agree] = useState('N')

    const baseURL = process.env.REACT_APP_BASE_URL;
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

    function fileUpload(e){
        const formData = new FormData()
        formData.append('image', e.target.files[0])
        axios.post( '/api/member/fileupload', formData)
        .then((result)=>{
            console.log(result)
            setProfile_img(`${baseURL}/profile_img/${result.data.filename}`);
            setImgStyle({display:"block", width:"200px"});
        }).catch((err)=>{console.error(err)})
    }
    
    function agree(checked, box){
        if(box=="terms"){
            if(checked) setTerms_agree('Y')
            else setTerms_agree('N')
        }
        if(box=="personal"){
            if(checked) setPersonal_agree('Y')
            else setPersonal_agree('N')
        }
    }

    function onSubmit(){
        if(!userid){ return alert('아이디를 입력하세요')}
        if( !pwd ){return alert('패스워드를 입력하세요')}

        if( pwd !== pwdChk){return alert('패스워드 확인이 일치하지 않습니다')}
        if( reid !== userid){return alert('아이디 중복을 체크해주세요')}

        if( !name ){return alert('이름을 입력하세요')}
        if( !email ){return alert('이메일을 입력하세요')}
        if( !phone1 && !phone2 && !phone3 ){return alert('전화번호를 입력하세요')}
        if( !rrn1 && !rrn2 ){return alert('주민번호를 입력하세요')}

        const phone = phone1+"-"+phone2+"-"+phone3
        const rrn = rrn1+"-"+rrn2+"******"

        axios.post('/api/member/join', {userid, pwd, name, email, phone, rrn, profile_img, profile_msg, terms_agree, personal_agree})
        .then(()=>{ 
            alert('회원가입이 완료되었습니다. 로그인하세요');
            navigate('/login')
        } ).catch((err)=>{console.error(err)})

    }
    return (
        <article>
            <div>Join</div>
            <div><span>*</span>은 필수 입력사항입니다</div>
            <div className='field'>
                <label><span>*</span>ID</label>
                <input type="text" style={{flex:'2'}} value={userid} onChange={(e)=>{
                    setUserid( e.currentTarget.value )
                }}/>
                <button style={{flex:'1'}} onClick={ ()=>{idCheck()} }>ID CHECK</button>
                <div style={idCheckMsgStyle}>{message}</div>
                <input type='hidden' name='reid' value={reid} />
            </div>
            <div className='field'>
                <label><span>*</span>비밀번호</label>
                <input type="password" value={pwd} onChange={
                    (e)=>{ setPwd(e.currentTarget.value )}
                }/>
            </div>
            <div className='field'>
                <label><span>*</span>비밀번호 확인</label>
                <input type="password"  value={pwdChk} onChange={
                    (e)=>{ setPwdChk(e.currentTarget.value )}
                }/>
            </div>
            <div className='field'>
                <label><span>*</span>이름</label>
                <input type="text" style={{flex:'2'}} value={name} onChange={(e)=>{
                    setName( e.currentTarget.value )
                }}/>
            </div>
            <div className='field'>
                <label><span>*</span>E-mail</label>
                <input type="text" style={{flex:'2'}} value={email} onChange={(e)=>{
                    setEmail( e.currentTarget.value )
                }}/>
            </div>
            <div className='field'>
                <label><span>*</span>전화번호</label>
                <input type="text" style={{flex:'2'}} value={phone1} onChange={(e)=>{
                    setPhone1( e.currentTarget.value )
                }}/>-
                <input type="text" style={{flex:'2'}} value={phone2} onChange={(e)=>{
                    setPhone2( e.currentTarget.value )
                }}/>-
                <input type="text" style={{flex:'2'}} value={phone3} onChange={(e)=>{
                    setPhone3( e.currentTarget.value )
                }}/>
            </div>
            <div className='field'>
                <label><span>*</span>주민번호</label>
                <input type="text" style={{flex:'2'}} value={rrn1} onChange={(e)=>{
                    setRrn1( e.currentTarget.value )
                }}/>-
                <input type="text" style={{flex:'2'}} value={rrn2} onChange={(e)=>{
                    setRrn2( e.currentTarget.value )
                }}/>******
            </div>
            <div className='field'>
                <label>프로필사진</label>
                <input type="file" onChange={(e)=>{fileUpload(e)}}/>
            </div>
            <div className='field'>
                <label>미리보기</label>
                <div><img src={profile_img} style={imgStyle}/></div>
            </div>
            <div className='field'>
                <label>소개글</label>
                <input type="text" style={{flex:'2'}} value={profile_msg} onChange={(e)=>{
                    setProfile_msg( e.currentTarget.value )
                }}/>
            </div>
            <div className='field'>
                <label>동의사항(선택)</label>
                <label>약관 동의</label><input type='checkbox' onChange={(e)=>agree(e.target.checked, "terms")}/>
                <label>개인정보 동의</label><input type='checkbox' onChange={(e)=>agree(e.target.checked, "personal")}/>
            </div>
            <div className="btns">
                <button onClick={()=>{onSubmit()}}>JOIN</button>
                <button onClick={()=>{navigate(-1)}}>BACK</button>
            </div>
        </article>
    )
}

export default Join