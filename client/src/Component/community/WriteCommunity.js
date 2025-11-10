import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';
import '../../style/CommunityWrite.css'

const baseURL = process.env.REACT_APP_BASE_URL;

function WriteCommunity() {

    const loginUser = useSelector(state=>state.user);
    const [userid, setUserid] = useState('');
    const [email, setEmail] = useState('');
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [pass, setPass] = useState("");
    const [image, setImage] = useState("");
    const [savefilename, setSavefilename] = useState("");
    const [imgSrc, setImgSrc] = useState('http://via.placeholder.com/300x150')
    const [imgStyle, setImgStyle] = useState({display:'none'})
    const navigate = useNavigate();

    useEffect(
        ()=>{
            if( !loginUser || !loginUser.userid ){
                alert('로그인이 필요한 서비스 입니다');
                navigate('/');
            }
            setUserid(loginUser.userid);
            setEmail(loginUser.email);
        }, []
    )

    function onFileUpload(e){
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        jaxios.post('/api/community/fileupload', formData)
        .then((result)=>{
            setSavefilename(result.data.savefilename);
            setImage(result.data.image);
            setImgSrc(`baseURL/images/${result.data.savefilename}`);
            setImgStyle({width:'300px', display:'block'})
        }).catch((err)=>{console.error(err);})
    }

    function onSubmit(){
        if(!pass){return alert('패스워드는 수정 삭제시 필요합니다')}
        if(!title){return alert('제목을 입력하세요')}
        if(!content){return alert('내용을 입력하세요')}

        jaxios.post('/api/community/insertCommunity',
            {userid, email, pass, title, content, image, savefilename})
        .then((result)=>{
            console.log(result.data);
            alert('게시물이 작성되었습니다');
            navigate('/main');
        }).catch((err)=>{console.error(err);})
    }

    return (
        <div className='writeCommunity'>
            <h2>COMMUNITY WRITE</h2>
            <div className='field'>
                <label>작성자</label>
                <input type='text' value={userid} readOnly />
            </div>
            <div className='field'>
                <label>이메일</label>
                <input type='text' value={email} readOnly />
            </div>
            <div className='field'>
                <label>PASS</label>
                <input type='password' value={pass} onChange={(e)=>{ setPass(e.currentTarget.value); }} />
            </div>
            <div className='field'>
                <label>제목</label>
                <input type='text' value={title} onChange={(e)=>{ setTitle(e.currentTarget.value); }} />
            </div>
            <div className='field'>
                <label>내용</label>
                <textarea rows="10" value={content} onChange={(e)=>{ setContent(e.currentTarget.value); }}></textarea>
            </div>
            <div className='field'>
                <label>이미지</label>
                <input type='file' onChange={(e)=>{ onFileUpload(e); }} />
            </div><div className='field'>
                <label>이미지 미리보기</label>
                <div><img src={imgSrc} style={imgStyle} /></div>
            </div>
            <div className='btns'>
                <button onClick={()=>{onSubmit()}}>작성완료</button>
                <button onClick={()=>{navigate('/community')}}>이전</button>
            </div>
        </div>
    )
}

export default WriteCommunity
