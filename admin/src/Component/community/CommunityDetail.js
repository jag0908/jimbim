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
                if(result.data.cPost==null){
                    alert('존재하지 않는 페이지입니다')
                    navigate('/communityList')
                }else{
                    setCPost(result.data.cPost)
                    setCCategoryList(result.data.CCategoryList)
                    console.log(result.data)
                }
            })
            .catch((err)=>{console.error(err)})
        },[]
    )
    function forceDelete(){
        if(window.confirm('해당 게시물을 정말 삭제하시겠습니까?')){
            jaxios.delete('/api/admin/deleteCommunity', {params:{cpostId}})
            .then((result)=>{ 
                alert('삭제되었습니다.')
                navigate('/communityList')
            })
            .catch((err)=>{console.error(err)})
        }
    }
    async function changeNotice( cpostId, isNotice){
        if( isNotice=='N' ){
            if(window.confirm('공지글로 등록하시겠습니까?')){
                await jaxios.post('/api/admin/changeNotice', null, {params:{cpostId, isNotice}})
                .then((result)=>{
                    if( result.data.msg==='ok'){
                        alert('공지글로 등록되었습니다')
                    }
                })
                await jaxios.get('/api/admin/getCPost', {params:{cpostId}})
                .then((result)=>{  
                    setCPost(result.data.cPost)
                    setCCategoryList(result.data.CCategoryList)
                })
            }else{return false}
        }else{
            if(window.confirm('공지글에서 해제하시겠습니까?')){
                await jaxios.post('/api/admin/changeNotice', null, {params:{cpostId, isNotice}})
                .then((result)=>{
                    if( result.data.msg==='ok'){
                        alert('공지글에서 해제되었습니다')
                    }
                })
                await jaxios.get('/api/admin/getCPost', {params:{cpostId}})
                .then((result)=>{  
                    setCPost(result.data.cPost)
                    setCCategoryList(result.data.CCategoryList)
                })
            }else{return false}
        }
    }
    return (
        <div className='adminContainer'>
            <SubMenu type={'community'}/>
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
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>
                            {(cPost.member)?
                            (((cPost.member.provider)?(cPost.member.userid+' ('+cPost.member.provider+')'):(cPost.member.userid))):
                            (<span className='italic'>탈퇴회원</span>)}
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>게시일</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>
                        {
                            (cPost.indate)?
                            (cPost.indate.substring(0, 10)):
                            (<></>)
                        }
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>카테고리</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>
                        {
                            (cPost.category)?
                            (cPost.category.categoryName):
                            (<></>)
                        }
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>첨부 이미지</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>
                            <div className='detailImg'>
                            {
                                cPost.fileList.map((file, idx)=>{
                                    return (<>
                                        {
                                            (idx<5)?(<img src={file.path} onClick={()=>{navigate(file.path)}}/>):(<></>)
                                        }
                                    </>)
                                })
                            }
                            </div>
                            <div className='detailImg'>
                            {
                                cPost.fileList.map((file, idx)=>{
                                    return (<>
                                        {
                                            (idx>=5)?(<img src={file.path} onClick={()=>{navigate(file.path)}}/>):(<></>)
                                        }
                                    </>)
                                })
                            }
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>공지글 설정</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>
                        {
                            (cPost.isNotice=='Y')?(<>Y 
                                <input type="checkbox" value={cPost.cpostId} onClick={()=>{
                                    changeNotice( cPost.cpostId, cPost.isNotice )
                                }} checked={cPost.isNotice=='Y'} />
                            </>
                            ):(<>N 
                                <input type="checkbox" value={cPost.cpostId} onClick={()=>{
                                    changeNotice( cPost.cpostId, cPost.isNotice )
                                }} checked={cPost.isNotice=='Y'} />
                            </>)
                        }
                        </div>
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
                <div className='detailPageBtns'>
                    <button className='redbtn' onClick={()=>{forceDelete()}} >강제삭제</button>
                </div>
            </div>
        </div>
    )
}

export default CommunityDetail