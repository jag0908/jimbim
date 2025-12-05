import React, {useEffect, useState} from 'react'
import { useParams , useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';
import SubMenu from '../SubMenu';
import Modal from 'react-modal'

function ShDetail() {
    const loginUser = useSelector( state=>state.user)
    const { postId } = useParams();
    const [shPost, setShPost] = useState({});
    const [shCategoryList, setShCategoryList] = useState([]);
    const navigate = useNavigate();

    useEffect(
        ()=>{
            if( !loginUser.userid ||  !loginUser.roleNames.includes('ADMIN') ){ 
                alert('권한이 없습니다')
                navigate('/')
            }
            jaxios.get('/api/admin/getShPost', {params:{postId}})
            .then((result)=>{ 
                setShPost(result.data.shPost)
                setShCategoryList(result.data.shCategoryList)
            })
            .catch((err)=>{console.error(err)})
        },[]
    )
    function forceDelete(){
        if(window.confirm('해당 게시물을 정말 삭제하시겠습니까?')){
            jaxios.delete('/api/admin/deleteShPost', {params:{postId}})
            .then((result)=>{ 
                alert('삭제되었습니다.')
                navigate('/shList')
            })
            .catch((err)=>{console.error(err)})
        }
    }
    return (
        <div className='adminContainer'>
            <SubMenu type={'sh'}/>
            <div className='productTable detailTable'>
                <div className='title'>상품정보</div>
                {(shPost.title)?
                (<>
                    <div className='row'>
                        <div className='col detailTitle'>상품명</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{shPost.title}</div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>게시자</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{shPost.member.userid}</div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>게시일</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{shPost.indate.substring(0, 10)}</div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>카테고리</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{shCategoryList[shPost.categoryId-1].category_name}</div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>상품 이미지</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}></div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>상품설명</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{shPost.content}</div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>가격</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{shPost.price} 원</div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>조회수</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{shPost.viewCount}</div>
                    </div>
                </>):(<></>)}
                
                <div className='detailPageBtns'>
                    <button onClick={()=>{navigate('/shList')}} >뒤로</button>
                </div>
                <div className='detailPageBtns'>
                    <button className='redbtn' onClick={()=>{forceDelete()}} >강제삭제</button>
                </div>
            </div>
        </div>
    )
}

export default ShDetail