import React, {useState, useEffect, useRef} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch} from 'react-redux';
import { loginAction } from '../../store/userSlice';
import axios from 'axios'
import { Cookies } from 'react-cookie';
import '../../style/memberform.css';


function MemberForm(props) {
    
    const navigate = useNavigate()
    const cookies = new Cookies()
    const dispatch = useDispatch();
    const fileref = useRef();

    const {
        userid, setUserid,
        reid, setReid,
        message, setMessage,
        idCheckMsgStyle, setIdCheckMsgStyle,
        pwd, setPwd,
        pwdChk, setPwdChk,
        name, setName,
        email, setEmail,
        phone1, setPhone1,
        phone3, setPhone3,
        phone2, setPhone2,
        rrn1, setRrn1,
        rrn2, setRrn2,

        profileImg, setProfileImg,
        preview, setPreview,

        profileMsg, setProfileMsg,

        terms_agree, setTerms_agree,
        personal_agree, setPersonal_agree,

        kakaoMember, setKakaoMember,

        file, setFile,
        type
    } = props.form

    let title, back
    if(type=='join'){ 
        title = '회원가입'
        back = '/'
    }else if(type=='kakao') {
        title = '서비스 이용을 위해 정보를 입력해주세요'
        back = '/login'
    }

    function idCheck(){
        if( !userid ){ return alert('아이디를 입력하세요')}
        axios.post('/api/member/idcheck', null, {params:{userid}})
        .then((result)=>{
            if( result.data.msg === 'ok'){
                setMessage('사용가능')
                setReid(userid);
                setIdCheckMsgStyle({flex:'1', textAlign:'center', fontWeight:'bold' , color:'blue',})
            }else{
                setMessage('사용 불가능')
                setReid('')
                setIdCheckMsgStyle({flex:'1', textAlign:'center', fontWeight:'bold' , color:'red'})
            }
        }).catch((err)=>{console.error(err)})
    }
    function fileupload(e) {
        /// 단일파일 업로드용으로 바꿨음 ///
        if(!e.target) {return}

        let newfile = e.target.files[0];
        setFile(newfile)

        // 브라우저에서 바로 미리보기 URL 생성
        const url = URL.createObjectURL(newfile);

        setPreview(url)
        fileref.current.value=''
    };

    // 파일 삭제
    const handleRemoveFile = () => {
        setFile({});
        // 미리보기도 같이 갱신
        setPreview('');
    };

    // 파일 업로드시 formData 추가
    async function createFormData() {
        if(!file.name) return;
        const formData = new FormData();
        formData.append('image', file);
        let filename;
        await axios.post( '/api/member/fileupload', formData)
        .then((result)=>{
            setProfileImg(result.data.filename);
            filename=result.data.filename
        }).catch((err)=>{console.error(err)})
        return filename
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

    // 숫자만 입력 가능하게
    const getNumberOnly = (e) => {
        e.target.value = e.target.value.replaceAll(/\D/g, "");
    };

    // 주민번호 검사
    function checkrrn(rrn1, rrn2){
        const lastRrn= (Number)(rrn2);
        let year = (Number)(rrn1.substr(0,2))
        if(lastRrn==1 || lastRrn==2){
            year += 1900;
        }else if(lastRrn==3 || lastRrn==4){
            year += 2000;
        }

        const month = (Number)(rrn1.substr(2,2))
        const day = (Number)(rrn1.substr(4,2))

        if(lastRrn<1 || lastRrn>4) return false;    // 뒷자리가 1~4가 아니면 금지
        if(month==0 || day==0) return false;    // 월이나 일이 0이면 금지
        
        switch(month){                          // 월에 따라 일이 초과하면 금지
            case 1: case 3: case 5: case 7: case 8: case 10: case 12:
                if(day>31) return false;
                break;
            case 4: case 6: case 9: case 11:
                if(day>30) return false;
                break;
            case 2:
                if(year%4==0 && year%100!=0 || year%400==0){
                    if(day>29) return false;
                }else{
                    if(day>28) return false;
                }
                break;
            default: return false;              // 월이 13 이상이면 금지
        }
        return true
    }
    async function onSubmit(){
        if(type=='join'){
            if(!userid){ return alert('아이디를 입력하세요')}
            if( !pwd ){return alert('패스워드를 입력하세요')}

            if( pwd !== pwdChk){return alert('패스워드 확인이 일치하지 않습니다')}
            if( reid !== userid){return alert('아이디 중복을 체크해주세요')}
        }

        if( !name ){return alert('이름을 입력하세요')}
        
        if( !email ){return alert('이메일을 입력하세요')}
        // 유효이메일 양식 체크
        let regix = email.match( /\w+@(\w+[.])+\w+/g );
        if( !regix ){  return alert('유효한 이메일을 입력하세요'); }

        if( !phone1 && !phone2 && !phone3 ){return alert('전화번호를 입력하세요')}

        if( !rrn1 && !rrn2 ){return alert('주민등록번호를 입력하세요')}
        if(!checkrrn(rrn1, rrn2)){return alert('유효한 주민등록번호를 입력하세요')};
        
        const phone = phone1+"-"+phone2+"-"+phone3
        const rrn = rrn1+"-"+rrn2+"******"

        let url = await createFormData()

        if(type=='join'){
            await axios.post('/api/member/join', {userid, pwd, name, email, phone, rrn, profileImg:url, profileMsg, terms_agree, personal_agree})
            .then(()=>{ 
                alert('회원가입이 완료되었습니다. 로그인하세요');
                navigate('/login')
            } ).catch((err)=>{console.error(err)})

        }else if(type=='kakao'){

            if(!url) url = kakaoMember.profileImg
            await axios.post('/api/member/kakaoIdFirstEdit', {userid, name, email, phone, rrn, profileImg:url, profileMsg, terms_agree, personal_agree })
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
    }

    return (
        <>
            <div className='formtitle'>{title}</div>
            <div className='requireguide'><span className='requiremark'>*</span>은 필수 입력사항입니다</div>
            {
                (type=='join')?
                (<>
                    <div className='field'>
                        <label><span className='requiremark'>*</span>아이디</label>
                        <div>
                            <input type="text" value={userid} onChange={(e)=>{
                                setUserid( e.currentTarget.value )
                            }}/>
                            <button className='idcheck' onClick={ ()=>{idCheck()} }>중복검사</button>
                        </div>
                        <div style={idCheckMsgStyle}>{message}</div>
                        <input type='hidden' name='reid' value={reid} />
                    </div>
                    <div className='field'>
                        <label><span className='requiremark'>*</span>비밀번호</label>
                        <input type="password" value={pwd} onChange={
                            (e)=>{ setPwd(e.currentTarget.value )}
                        }/>
                    </div>
                    <div className='field'>
                        <label><span className='requiremark'>*</span>비밀번호 확인</label>
                        <input type="password" value={pwdChk} onChange={
                            (e)=>{ setPwdChk(e.currentTarget.value )}
                        }/>
                    </div>
                </>):(null)
            }
            <div className='field'>
                <label><span className='requiremark'>*</span>이름</label>
                <input type="text" value={name} onChange={(e)=>{
                    setName( e.currentTarget.value )
                }}/>
            </div>
            <div className='field'>
                <label><span className='requiremark'>*</span>이메일</label>
                <input className='inputemail' type="text" value={email} onChange={(e)=>{
                    setEmail( e.currentTarget.value )
                }}/>
            </div>
            <div className='field'>
                <label><span className='requiremark'>*</span>전화번호</label>
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
            <div className='field'>
                <label><span className='requiremark'>*</span>주민등록번호</label>
                <div>
                    <input type="text" className='inputrrn1' value={rrn1} onInput={getNumberOnly} maxLength="6" onChange={(e)=>{
                        setRrn1( e.currentTarget.value )
                    }}/><span className='memberformdash'>&nbsp;-&nbsp;</span>
                    <input type="text" id='inputrrn2' value={rrn2} onInput={getNumberOnly} maxLength="1" onChange={(e)=>{
                        setRrn2( e.currentTarget.value )
                    }}/> * * * * * * 
                </div>
            </div>
            <div className='field'>
                <label>프로필사진</label>
                {/* 미리보기 이미지 */}
                <div className="previewContainer">
                    <div className='imgBox'>
                    {
                        (preview)?
                        (<>
                            <img src={preview} className='formimgpreview'/>
                            <button className='imgcancel' onClick={()=>{handleRemoveFile()}}>취소</button>
                        </>):
                        ((type=='kakao')?
                            (
                            <img src={kakaoMember.profileImg}/>
                            ):(<div className='noimgmsg'>프로필 사진 없음</div>)
                        )
                    }
                    </div>
                </div>
                {/* 파일업로드 인풋 */}
                <label htmlFor="dataFile"><div className='imgBtns'>다른 이미지 업로드</div></label>
                <input id='dataFile' ref={fileref} name="file" type='file' className='inpFile' onChange={(e)=>{fileupload(e);}} style={{display:'none'}}/>
            </div>
            <div className='field'>
                <label>소개글</label>
                <textarea onChange={(e)=>{setProfileMsg( e.currentTarget.value )}} className='formProfileMsg' maxLength={255} value={profileMsg}></textarea>
            </div>
            <div className='field'>
                <label>동의사항(선택)</label>
                <div className='checkboxField'>
                    <div className='checkboxLabel'>
                        <label>약관 동의</label>
                    </div>
                    <div className='agreeCheckbox'>
                        <input type='checkbox' onChange={(e)=>agree(e.target.checked, "terms")}/>
                    </div>
                </div>
                <div className='checkboxField'>
                    <div className='checkboxLabel'>
                        <label>개인정보 동의</label>
                    </div>
                    <div className='agreeCheckbox'>
                        <input type='checkbox' onChange={(e)=>agree(e.target.checked, "personal")}/>
                    </div>
                </div>
            </div>
            <div className="btns formBtns">
                <button onClick={()=>{onSubmit()}}>완료</button>
                <button onClick={()=>{navigate(back)}}>취소</button>
            </div>
        </>
    )
}

export default MemberForm