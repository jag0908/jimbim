import React, {useState, useEffect} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Cookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../../store/userSlice';
import axios from 'axios';
import jaxios from '../../util/jwtutil';
import '../../style/login.css';

function Mypage() {
    const loginUser = useSelector( state=>state.user )
    const navigate = useNavigate();
    const cookies = new Cookies()
    const dispatch = useDispatch();

    const [prePwd, setPrePwd] = useState('');
    const [pwd, setPwd] = useState('');
    const [pwdChk, setPwdChk] = useState('');

    const [name, setName] = useState();
    const [email, setEmail] = useState('');
    const [phone1, setPhone1] = useState('');
    const [phone2, setPhone2] = useState('');
    const [phone3, setPhone3] = useState('');
    const [rrn1, setRrn1] = useState('');
    const [rrn2, setRrn2] = useState('');

    const [profileImg, setProfileImg] = useState('')
    const [preview, setPreview] = useState('')

    const [profileMsg, setProfileMsg] = useState('')

    // const [terms_agree, setTerms_agree] = useState('N')
    // const [personal_agree, setPersonal_agree] = useState('N')

    const [file, setFile] = useState({});
    const [type, setType] = useState('')

    const [member, setMember] = useState({});

    function reset(member){
        console.log('reset', member)
        setMember( member );
        setType('')
        setPrePwd('')
        setPwd('')
        setPwdChk('')
        setName(member.name)
        setEmail(member.email)
        setPhone1(member.phone.substring(0,3))
        setPhone2(member.phone.substring(4,8))
        setPhone3(member.phone.substring(9,13))
        setRrn1(member.rrn.substring(0,6))
        setRrn2(member.rrn.substring(7,8))
        setProfileImg(member.profileImg)
        setProfileMsg(member.profileMsg)
        setPreview('')
        setFile({})
    }

    useEffect(
        ()=>{
            if(loginUser.userid){
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

    function fileupload(e) {
        /// 단일파일 업로드용으로 바꿨음 ///
        if(!e.target.files[0]) {return}
        edit('profileImg');

        let newfile = e.target.files[0];
        setFile(newfile)

        // 브라우저에서 바로 미리보기 URL 생성
        const url = URL.createObjectURL(newfile);

        setPreview(url)
    };

    // 파일 업로드시 formData 추가
    async function createFormData() {
        if(!file.name) return;
        const formData = new FormData();
        formData.append('image', file);
        let filename;
        await jaxios.post( '/api/member/fileupload', formData)
        .then((result)=>{
            setProfileImg(result.data.filename);
            filename=result.data.filename
        }).catch((err)=>{console.error(err)})
        return filename
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
        let rrn=''
        let phone=''
        
        if( !name && type=='name'){return alert('이름을 입력하세요')}
        
        if( type=='email'){
            if(!email) return alert('이메일을 입력하세요')
            
            // 유효이메일 양식 체크
            let regix = email.match( /\w+@(\w+[.])+\w+/g );
            if( !regix ){  return alert('유효한 이메일을 입력하세요'); }
        }

        if( type=='phone'){
            if(!phone1 && !phone2 && !phone3) return alert('전화번호를 입력하세요')
            phone = phone1+"-"+phone2+"-"+phone3
        }

        if( type=='rrn'){
            if(!rrn1 && !rrn2) return alert('주민등록번호를 입력하세요')
            if(!checkrrn(rrn1, rrn2)){return alert('유효한 주민등록번호를 입력하세요')};
            rrn = rrn1+"-"+rrn2+"******"
        }
        
        let url = await createFormData()
        if(!url) url = member.profileImg
        
        await jaxios.post('/api/member/updateMember', {userid:loginUser.userid, name, email, phone, rrn, profileImg:url, profileMsg })
        .then((result)=>{
            alert('정보 수정이 완료되었습니다');
            reset(result.data.member)
            navigate("/mypage")
        } ).catch((err)=>{console.error(err);})
    }
    async function updatePwd(){
        if(type=='pwd'){
            if(!prePwd){ return alert('현재 비밀번호를 입력하세요')}
            if( !pwd ){return alert('새 비밀번호를 입력하세요')}
            if( pwd !== pwdChk){return alert('비밀번호 확인이 일치하지 않습니다')}

            let res = await jaxios.post('/api/member/pwdcheck', null, {params:{userid:loginUser.userid, pwd:prePwd}})
            if(res.data.msg != 'ok'){
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
    return (
        <article>
            <div>마이페이지</div>
            {type}
            <div>
                <Link to={"/mypage"}>로그인 정보</Link>
                <Link to={"/mypage/addresslist"}>주소록</Link>
            </div>
            {
                (loginUser.provider=='kakao')?
                (null):
                (<>
                    <div className='field'>
                        <label>ID</label>
                        <div>{loginUser.userid}</div>
                    </div>
                    <div className='field'>
                        <label>비밀번호</label>
                        {
                            (type=='pwd')?
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
                                <button onClick={()=>{updatePwd()}}>수정</button>
                                <button onClick={()=>{edit('')}}>취소</button>
                            </>):
                            (<>
                                <div>********</div>
                                <button onClick={()=>{edit('pwd')}}>변경</button>
                            </>)
                        }
                    </div>
                </>)
            }
            <div className='field'>
                <label>이름</label>
                {
                    (type=='name')?
                    (<>
                        <input type="text" value={name} onChange={(e)=>{
                            setName( e.currentTarget.value )
                        }}/>
                        <button onClick={()=>{onSubmit()}}>수정</button>
                        <button onClick={()=>{edit('')}}>취소</button>
                    </>):
                    (<>
                        <div>{member.name}</div>
                        <button onClick={()=>{edit('name')}}>변경</button>
                    </>)
                }
            </div>
            <div className='field'>
                <label>이메일</label>
                {
                    (type=='email')?
                    (<>
                        <input type="text" value={email} onChange={(e)=>{
                            setEmail( e.currentTarget.value )
                        }}/>
                        <button onClick={()=>{onSubmit()}}>수정</button>
                        <button onClick={()=>{edit('')}}>취소</button>
                    </>):
                    (<>
                        <div>{member.email}</div>
                        <button onClick={()=>{edit('email')}}>변경</button>
                    </>)
                }
            </div>
            <div className='field'>
                <label>전화번호</label>
                {
                    (type=='phone')?
                    (<>
                        <div>
                            <input type="text" value={phone1} onInput={getNumberOnly} maxLength="3" onChange={(e)=>{
                                setPhone1( e.currentTarget.value )
                            }}/>&nbsp;-&nbsp;
                            <input type="text" value={phone2} onInput={getNumberOnly} maxLength="4" onChange={(e)=>{
                                setPhone2( e.currentTarget.value )
                            }}/>&nbsp;-&nbsp;
                            <input type="text" value={phone3} onInput={getNumberOnly} maxLength="4" onChange={(e)=>{
                                setPhone3( e.currentTarget.value )
                            }}/>
                        </div>
                        <button onClick={()=>{onSubmit()}}>수정</button>
                        <button onClick={()=>{edit('')}}>취소</button>
                    </>):
                    (<>
                        <div>{member.phone}</div>
                        <button onClick={()=>{edit('phone')}}>변경</button>
                    </>)
                }
            </div>
            <div className='field'>
                <label>주민등록번호</label>
                {
                    (type=='rrn')?
                    (<>
                        <div>
                            <input type="text" value={rrn1} onInput={getNumberOnly} maxLength="6" onChange={(e)=>{
                                setRrn1( e.currentTarget.value )
                            }}/>&nbsp;-&nbsp;
                            <input type="text" value={rrn2} onInput={getNumberOnly} maxLength="1" onChange={(e)=>{
                                setRrn2( e.currentTarget.value )
                            }} style={{width:'10px'}}/> * * * * * * 
                        </div>
                        <button onClick={()=>{onSubmit()}}>수정</button>
                        <button onClick={()=>{edit('')}}>취소</button>
                    </>):
                    (<>
                        <div>{member.rrn}</div>
                        <button onClick={()=>{edit('rrn')}}>변경</button>
                    </>)
                }
            </div>
            <div className='field'>
                <label>프로필사진</label>
                {
                    (type=='profileImg')?
                    (<>
                        <div className="previewContainer">
                            {
                                (preview)?
                                (
                                <div className='imgBox'>
                                    <img src={preview}/>
                                </div>
                                ):
                                (<></>)
                            }
                        </div>
                    </>):
                    (<>
                        <div className="previewContainer">
                            <div className='imgBox'>
                                <img src={member.profileImg}/>
                            </div>
                        </div>
                    </>)
                }
                <label htmlFor="dataFile"><div>다른 이미지 업로드</div></label>
                <input id='dataFile' name="file" type='file' className='inpFile' onChange={(e)=>{fileupload(e);}} style={{display:'none'}}/>
                {
                    (type=='profileImg')?
                    (<>
                        <button onClick={()=>{onSubmit()}}>수정</button>
                        <button onClick={()=>{edit('')}}>취소</button>
                    </>):
                    (<></>)
                }
            </div>
            <div className='field'>
                <label>소개글</label>
                {
                    (type=='profileMsg')?
                    (<>
                        <input type="text" value={profileMsg} onChange={(e)=>{
                            setProfileMsg( e.currentTarget.value )
                        }}/>
                        <button onClick={()=>{onSubmit()}}>수정</button>
                        <button onClick={()=>{edit('')}}>취소</button>
                    </>):
                    (<>
                        <div>{member.profileMsg}</div>
                        <button onClick={()=>{edit('profileMsg')}}>변경</button>
                    </>)
                }
            </div>
            <div className='field'>
                <label>동의사항(선택)</label>
                <div><label>약관 동의</label> {member.terms_agree}</div>
                <div><label>개인정보 동의</label> {member.personal_agree}</div>
            </div>
            <div className='field'>
                <label>가입일</label>
                <div>{
                    (member.indate)?
                    (member.indate.substring(0,10)):(null)
                }</div>
            </div>
        </article>
    )
}

export default Mypage