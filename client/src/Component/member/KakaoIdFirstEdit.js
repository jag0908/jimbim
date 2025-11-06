// KakaoIdFirstEdit.js
import React, {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch} from 'react-redux';
import { loginAction } from '../../store/userSlice';
import axios from 'axios'
import { Cookies } from 'react-cookie';

function KakaoIdFirstEdit() {

    const {userid} = useParams()
    const navigate = useNavigate()
    const cookies = new Cookies()
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone1, setPhone1] = useState('');
    const [phone2, setPhone2] = useState('');
    const [phone3, setPhone3] = useState('');
    const [rrn1, setRrn1] = useState('');
    const [rrn2, setRrn2] = useState('');
    const [profile_img, setProfile_img] = useState('')
    const [profile_msg, setProfile_msg] = useState('')
    
    const [terms_agree, setTerms_agree] = useState('N')
    const [personal_agree, setPersonal_agree] = useState('N')

    const [kakaoMember, setKakaoMember] = useState({})

    const baseURL = process.env.REACT_APP_BASE_URL;

    useEffect(
        ()=>{
            axios.post('/api/member/getKakaoMember', null, {params:{ userid}})
            .then((result)=>{
                setKakaoMember(result.data.member)
            })
            .catch((err)=>{console.error(err)})

        },[]
    )
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

    async function onSubmit(){
        if( !phone1 && !phone2 && !phone3 ){return alert('전화번호를 입력하세요')}
        if( !rrn1 && !rrn2 ){return alert('주민번호를 입력하세요')}

        const phone = phone1+"-"+phone2+"-"+phone3
        const rrn = rrn1+"-"+rrn2+"******"

        await axios.post('/api/member/kakaoIdFirstEdit', {userid, email, phone, rrn, profile_img, profile_msg, terms_agree, personal_agree })
        .then((result)=>{
            alert('정보 입력이 완료되었습니다');
        } ).catch((err)=>{console.error(err)})

        await axios.post('/api/member/login', null, {params:{ username:userid, password:'KAKAO'}})
        .then((result)=>{
            if( result.data.error == 'ERROR_LOGIN' ){
                return alert("이메일 또는 패스워드 오류입니다");
            }else{
                dispatch( loginAction( result.data ) );
                cookies.set('user', JSON.stringify(result.data), {path:'/',});
                navigate('/');
            }
        })
    }
    return (
        <article>
            <div>서비스 이용을 위해 정보를 입력해주세요</div>
            <div><span>*</span>은 필수 입력사항입니다</div>
            <div className='field'>
                <label><span>*</span>이름</label>
                <div>{kakaoMember.name}</div>
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
                <div><img src={kakaoMember.profileImg}/></div>
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
                <button onClick={()=>{onSubmit()}}>완료</button>
            </div>
        </article>
    )
}

export default KakaoIdFirstEdit