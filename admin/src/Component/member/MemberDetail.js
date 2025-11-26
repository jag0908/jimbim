import React, {useEffect, useState} from 'react'
import { useParams , useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';
import SubMenu from '../SubMenu';

function MemberDetail() {
    const loginUser = useSelector( state=>state.user)
    const { member_id } = useParams();
    const [member, setMember] = useState({});
    const navigate = useNavigate();

    useEffect(
        ()=>{
            if( !loginUser.userid ||  !loginUser.roleNames.includes('ADMIN') ){ 
                alert('권한이 없습니다')
                navigate('/')
            }
            console.log(member_id)
            jaxios.get('/api/admin/getMember', {params:{member_id}})
            .then((result)=>{ 
                setMember(result.data.member) 
            })
            .catch((err)=>{console.error(err)})
        },[]
    )
    return (
        <div className='adminContainer'>
            <SubMenu type={'member'}/>
            <div className='productTable'>
                <div className='title'>회원정보</div>
                {(member.userid)?
                (<>
                <div className='row'>
                    <div className='col'>아이디</div>
                    <div className='col'>{member.userid} {(member.provider)?(<>({member.provider})</>):(<></>)}</div>
                </div>
                <div className='row'>
                    <div className='col'>이름</div>
                    <div className='col'>{member.name}</div>
                </div>
                <div className='row'>
                    <div className='col'>이메일</div>
                    <div className='col'>{member.email}</div>
                </div>
                <div className='row'>
                    <div className='col'>전화번호</div>
                    <div className='col'>{member.phone}</div>
                </div>
                <div className='row'>
                    <div className='col'>프로필사진</div>
                    <div className='col'><img src={member.profileImg}/></div>
                </div>
                <div className='row'>
                    <div className='col'>소개글</div>
                    <div className='col'>{member.profileMsg}</div>
                </div>
                <div className='row'>
                    <div className='col'>블랙리스트 등급</div>
                    <div className='col'>{member.blacklist}</div>
                </div>
                <div className='row'>
                    <div className='col'>약관 동의</div>
                    <div className='col'>{member.terms_agree}</div>
                </div>
                <div className='row'>
                    <div className='col'>개인정보 동의</div>
                    <div className='col'>{member.personal_agree}</div>
                </div>
                <div className='row'>
                    <div className='col'>삭제여부</div>
                    <div className='col'>{member.deleteyn}</div>
                </div>
                <div className='row'>
                    <div className='col'>가입일</div>
                    <div className='col'>{member.indate.substring(0, 10)}</div>
                </div>
                <div>
                    <button onClick={()=>{navigate('/memberList')}}>뒤로</button>
                </div>
                </>):(<></>)}
            </div>
        </div>
    )
}

export default MemberDetail