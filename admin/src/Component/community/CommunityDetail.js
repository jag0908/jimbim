import React, {useEffect, useState} from 'react'
import { useParams , useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';
import SubMenu from '../SubMenu';
import Modal from 'react-modal'

function CommunityDetail() {
    const loginUser = useSelector( state=>state.user)
    const { cpostId } = useParams();
    const [cPost, setCPost] = useState({});
    const [cCategoryList, setCCategoryList] = useState([]);
    const navigate = useNavigate();

    useEffect(
        ()=>{
            if( !loginUser.userid ||  !loginUser.roleNames.includes('ADMIN') ){ 
                alert('권한이 없습니다')
                navigate('/')
            }
            jaxios.get('/api/admin/getCPost', {params:{cpostId}})
            .then((result)=>{ 
                console.log(result.data)
                setCPost(result.data.cPost)
                setCCategoryList(result.data.CCategoryList)
            })
            .catch((err)=>{console.error(err)})
        },[]
    )
    return (
        <div className='adminContainer'>
            <SubMenu type={'sh'}/>
            <div className='productTable detailTable'>
                <div className='title'>게시글 정보</div>
                {(cPost.title)?
                (<>
                    <div className='row'>
                        <div className='col detailTitle'>제목</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{cPost.title}</div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>글쓴이</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{cPost.member.userid}</div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>게시일</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{cPost.indate.substring(0, 10)}</div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>카테고리</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{cPost.category.categoryName}</div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>첨부 이미지</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}></div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>내용</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{cPost.content}</div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>조회수</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{cPost.readcount}</div>
                    </div>
                </>):(<></>)}
                
                <div className='detailPageBtns'>
                    <button onClick={()=>{navigate('/communityList')}} >뒤로</button>
                </div>
            </div>
        </div>
    )
}

export default CommunityDetail