import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import jaxios from '../../util/jwtutil'

function DeleteMember() {
    const loginUser = useSelector( state=>state.user )
    const navigate = useNavigate()

    function deleteMember(){
        if(window.confirm('정말로 회원탈퇴 하시겠습니까? 이 동작은 되돌릴 수 없습니다!')){
            alert('미구현')
            //jaxios.delete('/api/member/deleteMember')
        }
    }

    useEffect(
        ()=>{
            if(!loginUser.userid){
                alert("로그인이 필요한 서비스입니다")
                navigate("/")
            }else{
                navigate("/mypage")
            }
        },[]
    )

    return (
      	<article style={{height:'100%'}}>
            <div>회원탈퇴시 </div>
            <div className='formBtns' style={{width:'300px'}}>
                <button onClick={()=>{deleteMember()}} style={{backgroundColor:"red"}}>회원탈퇴</button>
                <button onClick={()=>{navigate('/mypage')}}>돌아가기</button>
            </div>
        </article>
    )
}

export default DeleteMember