import React, { useEffect, useState } from 'react'
import SubMenu from '../SubMenu'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';
import '../../style/admin.css'


function ShopList() {
    const loginUser = useSelector( state=>state.user)
    const [shopList, setShopList] = useState([]);
    const [shopCategoryList, setShopCategoryList] = useState([]);
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
            jaxios.get('/api/admin/getShopList', {params:{page:1, key}})
            .then((result)=>{ 
                console.log(result)
                setShopList(result.data.shopList) 
                setShopCategoryList(result.data.shopCategoryList)
                setPaging( result.data.paging )
                setKey( result.data.key)

                let arr = [];
                for( let i=result.data.paging.beginPage; i<=result.data.paging.endPage; i++){
                    arr.push(i);
                }
                setBeginEnd( [...arr] )
            })
            .catch((err)=>{console.error(err)})
        },[]
    )

    function onPageMove(p){ 
        jaxios.get('/api/admin/getShopList', {params:{page:p, key}})
        .then((result)=>{ 
            setShopList(result.data.shopList) 
            setShopCategoryList(result.data.shopCategoryList)
            setPaging( result.data.paging )
            setKey( result.data.key)
            let arr = [];
            for( let i=result.data.paging.beginPage; i<=result.data.paging.endPage; i++){
                arr.push(i);
            }
            setBeginEnd( [...arr] )
            console.log('paging', result.data.paging)
        })
        .catch((err)=>{console.error(err)})
    }

    return (
        <div className='adminContainer'>
            <SubMenu type={type}/>
            <div className='productTable'>
                <div className='title'>상품목록(SHOP)</div>
                <div className='row tableTitle'>
                    <div className='col'>카테고리</div>
                    <div className='col'>상품명</div>
                    <div className='col'>원가</div>
                    <div className='col'>추가일</div>
                </div>
                {
                    (shopList[0])?(
                        shopList.map((shop, idx)=>{
                            return (
                                <div className='row' onClick={()=>{navigate(`/ShopDetail/${shop.productId}`)}}>
                                    <div className='col'>{shopCategoryList[shop.category.categoryId-1].category_name}</div>
                                    <div className='col'>{shop.title}</div>
                                    <div className='col'>{shop.price} 원</div>
                                    {/* <div className='col'>{
                                        (shop.member)?
                                        (((shop.member.provider)?(shop.member.userid+' ('+shop.member.provider+')'):(shop.member.userid))):
                                        (<span className='italic'>탈퇴회원</span>)
                                    }</div> */}
                                    <div className='col'>{shop.indate.substring(0, 10)}</div>
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
            </div>
        </div>
    )
}

export default ShopList