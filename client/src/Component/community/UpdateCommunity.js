import React ,{useState, useEffect} from 'react'
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';

function UpdateCommunity() {
    const loginUser = useSelector( state=>state.user)
    const [ userid, setUserid ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ title, setTitle ] = useState('');
    const [ content, setContent ] = useState('');
    const [ pass, setPass ] = useState('');
    const [ imgSrc, setImgSrc ] = useState('');
    const [ image, setImage ] = useState('');
    const [ savefilename, setSavefilename ] = useState('');
    const [ newImgSrc, setNewImgSrc ] = useState('')
    const [newImgStyle, setNewImgStyle] = useState({display:'none'})
    const navigate = useNavigate();
    const {num} = useParams();

    useEffect(
        ()=>{
            if(!loginUser || !loginUser.userid){
                alert('로그인이 필요한 서비스 입니다')
                navigate('/login');
            }
            jaxios.get(`/api/community/getCommunity/${num}`)
            .then((result)=>{
                setUserid(result.data.community.userid);
                setTitle( result.data.board.title );
                setContent( result.data.board.content );
                setImage( result.data.board.image );
                setSavefilename( result.data.board.savefilename );
                setImgSrc( `http://localhost:8070/images/${result.data.board.savefilename}` );
            }).catch((err)=>{console.error(err)})
        }, []
    )

    function onFileUpload(e){
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        jaxios.post('/api/community/fileupload', formData)
        .then((result)=>{
            setSavefilename(result.data.savefilename);
            setImage(result.data.image);
            setNewImgSrc( `http://localhost:8070/images/${result.data.savefilename}` );
            setNewImgStyle({display:'block', width:'250px'})
        })
        .catch((err)=>{console.error(err);})
    }

    function onsubmit(){
        if( !pass ){ return alert('수정 비밀번호를 입력하세요');}
        if( !title ){ return alert('제목을 입력하세요')}
        if( !content ){ return alert('내용을 입력하세요')}

        jaxios.post('/api/board/updateBoard', {num, userid, email, pass, title, content, image, savefilename})
        .then((result)=>{
            if( result.data.msg != 'ok'){
                alert('비밀번호가 맞지 않습니다.');
            }else{
                alert('게시물이 수정되었습니다');
                navigate(`/boardView/${num}`);
            }
       })
    }

    return (
        <div className='writeCommunity'>
            <h2>COMMUNITY UPDATE</h2>
            <div className='field'>
                <label>작성자</label>
                <input type='text' value={userid} readOnly />
            </div>
            <div className='field'>
                <label>PASS</label>
                <input type='password' value={pass} onChange={(e)=>{setPass(e.currentTarget.value)}} />
            </div>
            <div className='field'>
                <label>제목</label>
                <input type='text' value={title} onChange={(e)=>{setTitle(e.currentTarget.value)}} />
            </div>
            <div className='field'>
                <label>내용</label>
                <textarea rows='10' value={content} onChange={(e)=>{setContent(e.currentTarget.value)}}></textarea>
            </div>
            <div className='field'>
                <label>기존 이미지</label>
                <div>
                    <img src={imgSrc} style={{width:"200px"}} alt='' /><br />
                </div>
            </div>
            <div className='field'>
                <label>수정 이미지</label>
                <div>
                    <input type='file' onChange={(e)=>{onFileUpload(e);}} />
                    <img src={newImgSrc} style={newImgStyle} alt='' /><br />
                </div>
            </div>

            <div className='btns'>
                <button onClick={()=>{onsubmit();}}>수정완료</button>
                <button onClick={()=>{navigate(`/communityView/${num}`);}}>이전</button>
            </div>
        </div>
    )
}

export default UpdateCommunity
