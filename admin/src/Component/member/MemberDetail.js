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
            jaxios.get('/api/admin/getMember', {params:{member_id}})
            .then((result)=>{ 
                setMember(result.data.member) 
            })
            .catch((err)=>{console.error(err)})
        },[]
    )

    function changeAdmin( userid, checked){
        if(userid == loginUser.userid){
            alert('자신의 관리자 권한은 수정할 수 없습니다.')
            return
        }else if( checked ){
             jaxios.post('/api/admin/changeRoleAdmin', null, {params:{userid}})
            .then((result)=>{
                if( result.data.msg==='ok'){
                    alert(userid + '님이 관리자로 선정되셨습니다')
                }
            })
        }else{
            jaxios.post('/api/admin/changeRoleUser', null, {params:{userid}})
            .then((result)=>{
                if( result.data.msg==='ok'){
                    alert(userid + '님의 등급이 일반유저로 변경되었습니다')
                }
            })
        }
    }

    return (
        <div className='adminContainer'>
            <SubMenu type={'member'}/>
            <div className='productTable detailTable'>
                <div className='title'>회원정보</div>
                {(member.userid)?
                (<>
                <div className='row'>
                    <div className='col detailTitle'>아이디</div>
                    <div className='col'>{member.userid} {(member.provider)?(<>({member.provider})</>):(<></>)}</div>
                </div>
                <div className='row'>
                    <div className='col detailTitle'>이름</div>
                    <div className='col'>{member.name}</div>
                </div>
                <div className='row'>
                    <div className='col detailTitle'>이메일</div>
                    <div className='col'>{member.email}</div>
                </div>
                <div className='row'>
                    <div className='col detailTitle'>전화번호</div>
                    <div className='col'>{member.phone}</div>
                </div>
                <div className='row'>
                    <div className='col detailTitle'>프로필사진</div>
                    <div className='col'><img src={member.profileImg}/></div>
                </div>
                <div className='row'>
                    <div className='col detailTitle'>소개글</div>
                    <div className='col'>{member.profileMsg}</div>
                </div>
                <div className='row'>
                    <div className='col detailTitle'>블랙리스트 등급</div>
                    <div className='col'>{member.blacklist}</div>
                </div>
                <div className='row'>
                    <div className='col detailTitle'>약관 동의</div>
                    <div className='col'>{member.terms_agree}</div>
                </div>
                <div className='row'>
                    <div className='col detailTitle'>개인정보 동의</div>
                    <div className='col'>{member.personal_agree}</div>
                </div>
                <div className='row'>
                    <div className='col detailTitle'>관리자 권한</div>
                    <div className='col'>
                        {
                            (member.deleteyn=='Y')?(<>탈퇴회원</>):
                            (
                                (member.memberRoleList && member.memberRoleList.includes('ADMIN'))?(<>Y 
                                    <input type="checkbox" value={member.userid} onChange={(e)=>{
                                        changeAdmin( member.userid, e.currentTarget.checked )
                                    }} checked/>
                                </>
                                ):(<>N 
                                    <input type="checkbox" value={member.userid} onChange={(e)=>{
                                        changeAdmin( member.userid, e.currentTarget.checked )
                                    }} />
                                </>)
                            )
                        }
                    </div>
                </div>
                <div className='row'>
                    <div className='col detailTitle'>탈퇴유저 여부</div>
                    <div className='col'>{member.deleteyn}</div>
                </div>
                <div className='row'>
                    <div className='col detailTitle'>가입일</div>
                    <div className='col'>{member.indate.substring(0, 10)}</div>
                </div>
                <div className='detailPageBtns'>
                    <button onClick={()=>{navigate('/memberList')}}>뒤로</button>
                </div>
                </>):(<></>)}
            </div>
        </div>
    )
}

export default MemberDetail