import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import jaxios from '../../util/jwtutil'
import { useDispatch } from 'react-redux'
import { Cookies } from 'react-cookie'
import { logoutAction } from '../../store/userSlice'

function DeleteMember() {
    const loginUser = useSelector( state=>state.user )
    const navigate = useNavigate()
    const cookies = new Cookies();
    const dispatch = useDispatch();

    function deleteMember(){
        if(window.confirm('"확인" 버튼을 누르면 회원탈퇴가 진행됩니다.')){
            jaxios.delete('/api/member/deleteMember', {params:{userid:loginUser.userid}})
            .then((result)=>{
                alert('회원탈퇴 처리되었습니다.')
                dispatch( logoutAction() )
                cookies.remove('user')
                navigate('/')
            }).catch((err)=>{ console.error(err);  })
        }
    }

    useEffect(
        ()=>{
            if(!loginUser.userid){
                alert("로그인이 필요한 서비스입니다")
                navigate("/")
            }else{
                
            }
        },[]
    )

    return (
      	<div className='deleteMemberPage'>
            <div className='deleteMemberText'>
                정말 회원탈퇴 하시겠습니까?<br/>
                이 행동은 되돌릴 수 없습니다!
            </div>

            <div className='formBtns' style={{width:'300px', margin:'30px auto'}}>
                <button onClick={()=>{deleteMember()}} style={{backgroundColor:"red"}}>회원탈퇴</button>
                <button style={{display:'none'}}></button>
                <button onClick={()=>{navigate('/mypage')}}>돌아가기</button>
            </div>
        </div>
    )
}

export default DeleteMember