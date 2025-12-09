import React, { useEffect, useState } from 'react'
import SubMenu from '../SubMenu'
import axios from 'axios';
import { useNavigate, useParams} from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';
import '../../style/admin.css'


function ShopList() {
    const loginUser = useSelector( state=>state.user)
    const { productId, optionId } = useParams();
    const [sellList, setSellList] = useState([])
    const [option, setOption] = useState({})
    const [product, setProduct] = useState({});
    const [paging, setPaging]=useState({});
    const navigate = useNavigate();
    const [beginEnd, setBeginEnd] = useState();
    const [key, setKey] = useState('')
    const type = 'shop'

    useEffect(
        ()=>{
            if( !loginUser.userid ||  !loginUser.roleNames.includes('ADMIN') ){ 
                alert('권한이 없습니다')
                navigate('/')
            }
            jaxios.get('/api/admin/getSellList', {params:{page:1, key, productId, optionId}})
            .then((result)=>{ 
                console.log(result)
                setSellList(result.data.sellList)
                setPaging( result.data.paging )
                setKey( result.data.key)

                let arr = [];
                for( let i=result.data.paging.beginPage; i<=result.data.paging.endPage; i++){
                    arr.push(i);
                }
                setBeginEnd( [...arr] )
            })
            .catch((err)=>{console.error(err)})

            jaxios.get('/api/admin/getOption', {params:{optionId}})
            .then((result)=>{ 
                console.log(result)
                setOption(result.data.option)
            })
            .catch((err)=>{console.error(err)})

            jaxios.get('/api/admin/getShopProduct', {params:{productId}})
            .then((result)=>{ 
                console.log(result.data)
                setProduct(result.data.product)
            })
            .catch((err)=>{console.error(err)})
        },[]
    )

    function onPageMove(p){ 
        jaxios.get('/api/admin/getSellList', {params:{page:p, key, productId, optionId}})
            .then((result)=>{ 
                console.log(result)
                setSellList(result.data.sellList)
                setPaging( result.data.paging )
                setKey( result.data.key)

                let arr = [];
                for( let i=result.data.paging.beginPage; i<=result.data.paging.endPage; i++){
                    arr.push(i);
                }
                setBeginEnd( [...arr] )
            })
            .catch((err)=>{console.error(err)})

            jaxios.get('/api/admin/getOption', {params:{optionId}})
            .then((result)=>{ 
                console.log(result)
                setOption(result.data.option)
            })
            .catch((err)=>{console.error(err)})

            jaxios.get('/api/admin/getShopProduct', {params:{productId}})
            .then((result)=>{ 
                console.log(result.data)
                setProduct(result.data.product)
            })
            .catch((err)=>{console.error(err)})
    }

    async function forceDelete(sellId){
        if(window.confirm('해당 상품을 정말 삭제하시겠습니까?')){
            await jaxios.delete('/api/admin/deleteSellList', {params:{sellId}})
            .then((result)=>{ 
                alert('삭제되었습니다.')
            })
            .catch((err)=>{console.error(err)})
            await jaxios.get('/api/admin/getSellList', {params:{page:1, key, productId, optionId}})
            .then((result)=>{ 
                console.log(result)
                setSellList(result.data.sellList)
                setPaging( result.data.paging )
                setKey( result.data.key)

                let arr = [];
                for( let i=result.data.paging.beginPage; i<=result.data.paging.endPage; i++){
                    arr.push(i);
                }
                setBeginEnd( [...arr] )
            })
            .catch((err)=>{console.error(err)})

            await jaxios.get('/api/admin/getOption', {params:{optionId}})
            .then((result)=>{ 
                console.log(result)
                setOption(result.data.option)
            })
            .catch((err)=>{console.error(err)})

            await jaxios.get('/api/admin/getShopProduct', {params:{productId}})
            .then((result)=>{ 
                console.log(result.data)
                setProduct(result.data.product)
            })
            .catch((err)=>{console.error(err)})
        }
    }
    return (
        <div className='adminContainer'>
            <SubMenu type={type}/>
            <div className='productTable'>
                <div className='title'>상품목록(SHOP) / {product.title} / {option.optionName}</div>
                <div className='row tableTitle'>
                    <div className='col'>판매자</div>
                    <div className='col'>가격</div>
                    <div className='col'>상태</div>
                    <div className='col'>추가일</div>
                    <div className='col'>강제삭제</div>
                </div>
                {
                    (sellList[0])?(
                        sellList.map((sell, idx)=>{
                            return (
                                <div className='row' style={{cursor:'auto'}} onClick={()=>{navigate(`/ShopDetail/${productId}/optionList/${optionId}`)}}>
                                    <div className='col'>{
                                        (sell.seller)?
                                        (((sell.seller.provider)?(sell.seller.userid+' ('+sell.seller.provider+')'):(sell.seller.userid))):
                                        (<span className='italic'>탈퇴회원</span>)
                                    }</div>
                                    <div className='col'>{sell.price} 원</div>
                                    <div className='col'>{sell.status}</div>
                                    <div className='col'>{sell.indate.substring(0, 10)}</div>
                                    <div className='col'>
                                        <div className='detailPageBtns' style={{margin:'0'}}>
                                            <button className='redbtn' style={{width:'auto'}} onClick={()=>{forceDelete(sell.sellId)}} >강제삭제</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    ):(<></>)
                }
                <div id="paging" style={{textAlign:"center", padding:"10px"}}>
                {
                    (paging.prev)?(
                        <span style={{cursor:"pointer"}} onClick={ ()=>{ onPageMove( paging.beginPage-1 ) } } > ◀ </span>
                    ):(<span></span>)
                }
                {
                    (beginEnd)?(
                        beginEnd.map((page, idx)=>{
                            return (
                                <span style={{cursor:"pointer"}} key={idx} className={(page==paging.page)?('currentPage'):''}  onClick={
                                    ()=>{ onPageMove( page ) }
                                }>&nbsp;{page}&nbsp;</span>
                            )
                        })
                    ):(<></>)
                }
                {
                    (paging.next)?(
                        <span style={{cursor:"pointer"}} onClick={
                            ()=>{ onPageMove( paging.endPage+1 ) }
                        }>&nbsp;▶&nbsp;</span>
                    ):(<></>)
                }
                </div>
                <div className='btns' style={{display:"flex", margin:"5px"}}>
                    <input type="text" value={key} onChange={(e)=>{setKey(e.currentTarget.value)}} />
                    <button style={{marginLeft:"auto"}} onClick={()=>{ onPageMove(1) }}>검색</button>
                </div>
                <div className='detailPageBtns'>
                    <button onClick={()=>{navigate(`/ShopDetail/${productId}/optionList`)}} >뒤로</button>
                </div>    
            </div>
        </div>
    )
}

export default ShopList