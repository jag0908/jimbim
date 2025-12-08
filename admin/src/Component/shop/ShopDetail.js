import React, {useEffect, useState} from 'react'
import { useParams , useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';
import SubMenu from '../SubMenu';
import Modal from 'react-modal'

function ShopDetail() {
    const loginUser = useSelector( state=>state.user)
    const { productId } = useParams();
    const [product, setProduct] = useState({});
    const navigate = useNavigate();

    useEffect(
        ()=>{
            if( !loginUser.userid ||  !loginUser.roleNames.includes('ADMIN') ){ 
                alert('권한이 없습니다')
                navigate('/')
            }
            jaxios.get('/api/admin/getShopProduct', {params:{productId}})
            .then((result)=>{ 
                if(result.data.product==null){
                    alert('존재하지 않는 페이지입니다')
                    navigate('/shopList')
                }else{
                    console.log(result.data)
                    setProduct(result.data.product)
                }
            })
            .catch((err)=>{console.error(err)})
        },[]
    )
    function forceDelete(){
        if(window.confirm('해당 상품을 정말 삭제하시겠습니까?')){
            jaxios.delete('/api/admin/deleteShopProduct', {params:{productId}})
            .then((result)=>{ 
                alert('삭제되었습니다.')
                navigate('/shopList')
            })
            .catch((err)=>{console.error(err)})
        }
    }
    return (
        <div className='adminContainer'>
            <SubMenu type={'shop'}/>
            <div className='productTable detailTable'>
                <div className='title'>상품정보</div>
                {(product.title)?
                (<>
                    <div className='row'>
                        <div className='col detailTitle'>상품명</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{product.title}</div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>게시일</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{product.indate.substring(0, 10)}</div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>카테고리</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{product.category.category_name}</div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>상품 이미지</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>
                            
                            {(product.images[0])?(<>
                                <div className='detailImg'>
                                {
                                    product.images.map((file, idx)=>{
                                        return (<>
                                            {
                                                (idx<5)?(<img src={file.filePath} onClick={()=>{navigate(file.filePath)}}/>):(<></>)
                                            }
                                        </>)
                                    })
                                }
                                </div>
                                <div className='detailImg'>
                                {
                                    product.images.map((file, idx)=>{
                                        return (<>
                                            {
                                                (idx>=5)?(<img src={file.filePath} onClick={()=>{navigate(file.filePath)}}/>):(<></>)
                                            }
                                        </>)
                                    })
                                }
                                </div>
                                </>):(<span className='italic'>이미지 없음</span>)
                            }
                            
                        </div>
                    </div>
                    {/* <div className='row'>
                        <div className='col detailTitle'>상품설명</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{product.content}</div>
                    </div> */}
                    <div className='row'>
                        <div className='col detailTitle'>원가</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>{product.price} 원</div>
                    </div>
                    <div className='row'>
                        <div className='col detailTitle'>옵션</div>
                        <div className='col' style={{flex:'5', padding:'20px 10px'}}>
                            <div className='detailPageBtns'>
                                <button style={{width:'auto'}} onClick={()=>{navigate(`/ShopDetail/${productId}/optionList`)}} >총 {product.options.length}개 옵션 자세히보기</button>
                            </div>
                        </div>
                    </div>
                </>):(<></>)}
                
                <div className='detailPageBtns'>
                    <button onClick={()=>{navigate('/shopList')}} >뒤로</button>
                </div>
                <div className='detailPageBtns'>
                    <button className='redbtn' onClick={()=>{forceDelete()}} >강제삭제</button>
                </div>
            </div>
        </div>
    )
}

export default ShopDetail