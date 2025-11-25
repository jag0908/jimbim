import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import jaxios from '../../util/jwtutil'

function WriteQna() {
    const loginUser = useSelector( state=>state.user )
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [member, setMember] = useState({})
    const navigate = useNavigate();

    useEffect(
        ()=>{
            if(!loginUser.userid){
                alert("로그인이 필요한 서비스입니다")
                navigate("/login")
            }else{
                jaxios.get(`/api/member/getMember`, {params:{userid:loginUser.userid}} )
                .then((result)=>{
                    setMember(result.data.member)
                }).catch((err)=>{ console.error(err);  })
            }
        },[]
    )
    function onSubmit(){
        console.log(title, content, loginUser.member_id)
        if(!title){ return alert('제목을 입력하세요')}
        if(!content ){return alert('내용을 입력하세요')}

        jaxios.post('/api/customer/writeQna', {title, content, member})
        .then(()=>{ 
            alert('문의가 완료되었습니다.');
            navigate('/customer/qna')
        } ).catch((err)=>{console.error(err)})
    }
    return (
        <div>
            <div>WriteQna</div>
            <div><input type='text' value={title} onChange={(e)=>{setTitle(e.currentTarget.value)}}/></div>
            <div><textarea value={content} onChange={(e)=>{setContent( e.currentTarget.value )}} maxLength={2000}></textarea></div>
            <div>
                <button onClick={()=>{onSubmit()}}>문의</button>
                <button onClick={()=>{navigate('/customer/qna')}}>취소</button>
            </div>
        </div>
    )
}

export default WriteQna