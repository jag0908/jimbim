import React, {useState, useEffect, useRef} from 'react'
import { useNavigate,} from 'react-router-dom'
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';
import '../../style/login.css';
import SideMenu from './SideMenu';
import '../../style/mypage.css';

function Profile() {
    const loginUser = useSelector( state=>state.user )
    const navigate = useNavigate();
    const fileref = useRef();

    const [name, setName] = useState();

    const [profileImg, setProfileImg] = useState('')
    const [preview, setPreview] = useState('')

    const [profileMsg, setProfileMsg] = useState('')

    const [file, setFile] = useState({});
    const [type, setType] = useState('')

    const [member, setMember] = useState({});

    function reset(member){
        setMember( member );
        setType('')
        setName(member.name)
        setProfileImg(member.profileImg)
        setProfileMsg(member.profileMsg)
        setPreview('')
        setFile({})
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

    function fileupload(e) {
        /// 단일파일 업로드용으로 바꿨음 ///
        if(!e.target.files[0]) {return}
        edit('profileImg');

        let newfile = e.target.files[0];
        setFile(newfile)

        // 브라우저에서 바로 미리보기 URL 생성
        const url = URL.createObjectURL(newfile);

        setPreview(url)
        fileref.current.value=''
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

    async function onSubmit(){
        if( !name && type==='name'){return alert('이름을 입력하세요')}
        
        let url = await createFormData()
        if(!url) url = profileImg
        
        await jaxios.post('/api/member/updateMember', {userid:loginUser.userid, name, profileImg:url, profileMsg })
        .then((result)=>{
            console.log(result.data)
            alert('정보 수정이 완료되었습니다');
            reset(result.data.member)
            navigate("/mypage/profile")
        } ).catch((err)=>{console.error(err);})
    }
    return (
        <article style={{height:'100%'}}>
            {/* height 짤리는 오류, css 중복되는 오류때문에 넣음 */}
            <div style={{display:'flex'}}>
                <SideMenu/>
                <div className='mypage'>
                    <div className='field'>
                        <label>이름</label>
                        {
                            (type==='name')?
                            (<>
                                <input type="text" value={name} onChange={(e)=>{
                                    setName( e.currentTarget.value )
                                }}/>
                                <div className='btns formBtns'>
                                    <button onClick={()=>{onSubmit()}}>수정</button>
                                    <button onClick={()=>{edit('')}}>취소</button>
                                </div>
                            </>):
                            (<>
                                <div>{member.name}</div>
                                <div className='btns'>
                                    <button onClick={()=>{edit('name')}}>변경</button>
                                </div>
                            </>)
                        }
                    </div>
                    <div className='field'>
                        <label>프로필사진</label>
                        {
                            (type==='profileImg')?
                            (<>
                                <div className="previewContainer">
                                    {
                                        (preview)?
                                        (
                                        <div className='imgBox'>
                                            <img src={preview} alt='' className='formimgpreview'/>
                                        </div>
                                        ):
                                        (<></>)
                                    }
                                </div>
                            </>):
                            (<>
                                <div className="previewContainer">
                                    <div className='imgBox'>
                                        <img src={member.profileImg} alt='' className='formimgpreview'/>
                                    </div>
                                </div>
                            </>)
                        }
                        <label htmlFor="dataFile"><div className='imgBtns'>다른 이미지 업로드</div></label>
                        <input id='dataFile' ref={fileref} name="file" type='file' className='inpFile' onChange={(e)=>{fileupload(e);}} style={{display:'none'}}/>
                        {
                            (type==='profileImg')?
                            (
                                <div className='btns'>
                                    <button onClick={()=>{onSubmit()}}>수정</button>
                                    <button onClick={()=>{edit('')}}>취소</button>
                                </div>
                            ):
                            (null)
                        }
                    </div>
                    
                    <div className='field'>
                        <label>소개글</label>
                        {
                            (type==='profileMsg')?
                            (<>
                                <textarea value={profileMsg} onChange={(e)=>{
                                    setProfileMsg( e.currentTarget.value )
                                }}/>
                                <div className='btns'>
                                    <button onClick={()=>{onSubmit()}}>수정</button>
                                    <button onClick={()=>{edit('')}}>취소</button>
                                </div>
                            </>):
                            (<>
                                <div>{member.profileMsg}</div>
                                <div className='btns'>
                                    <button onClick={()=>{edit('profileMsg')}}>변경</button>
                                </div>
                            </>)
                        }
                    </div>
                </div>
            </div>
        </article>
    )
}

export default Profile