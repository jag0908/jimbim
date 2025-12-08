import React, { useEffect, useState } from 'react'
import SubMenu from '../SubMenu'
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';
import '../../style/admin.css'


function OptionList() {
    const loginUser = useSelector( state=>state.user)
    const { productId } = useParams();
    const [product, setProduct] = useState({});
    const [optionList, setOptionList] = useState([]);
    const [paging, setPaging]=useState({});
    const navigate = useNavigate();
    const [beginEnd, setBeginEnd] = useState();
    const type = 'shop'

    useEffect(
        ()=>{
            if( !loginUser.userid ||  !loginUser.roleNames.includes('ADMIN') ){ 
                alert('권한이 없습니다')
                navigate('/')
            }
            
            jaxios.get('/api/admin/getOptionList', {params:{page:1, productId}})
            .then((result)=>{ 
                console.log(result)
                setOptionList(result.data.optionList) 
                setPaging( result.data.paging )

                let arr = [];
                for( let i=result.data.paging.beginPage; i<=result.data.paging.endPage; i++){
                    arr.push(i);
                }
                setBeginEnd( [...arr] )
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
        jaxios.get('/api/admin/getOptionList', {params:{page:p, productId}})
        .then((result)=>{ 
            setOptionList(result.data.optionList) 
            setPaging( result.data.paging )
            let arr = [];
            for( let i=result.data.paging.beginPage; i<=result.data.paging.endPage; i++){
                arr.push(i);
            }
            setBeginEnd( [...arr] )
            console.log('paging', result.data.paging)
        })
        .catch((err)=>{console.error(err)})
        jaxios.get('/api/admin/getShopProduct', {params:{productId}})
        .then((result)=>{
            console.log(result.data)
            setProduct(result.data.product)
        })
        .catch((err)=>{console.error(err)})
    }

    return (
        <div className='adminContainer'>
            <SubMenu type={type}/>
            <div className='productTable'>
                <div className='title'>상품목록(SHOP) / {product.title}</div>
                <div className='row tableTitle'>
                    <div className='col'>옵션명</div>
                    <div className='col'></div>
                </div>
                {
                    (optionList[0])?(
                        optionList.map((option, idx)=>{
                            return (
                                <div className='row' onClick={()=>{}}>
                                    <div className='col'>{option.optionName}</div>
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
                <div className='detailPageBtns'>
                    <button onClick={()=>{navigate(`/ShopDetail/${productId}`)}} >뒤로</button>
                </div>
            </div>
        </div>
    )
}

export default OptionList