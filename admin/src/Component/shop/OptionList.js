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
    const navigate = useNavigate();
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

    return (
        <div className='adminContainer'>
            <SubMenu type={type}/>
            <div className='productTable'>
                <div className='title'>상품목록(SHOP) / {product.title}</div>
                <div className='row tableTitle'>
                    <div className='col'>옵션명</div>
                </div>
                <div className='optionListRow'>
                {
                    (optionList[0])?(
                        optionList.map((option, idx)=>{
                            return (
                                <div className='optionListCol' style={(optionList.length-1==idx && idx%2==0)?({width:'100%'}):({})}>{option.optionName}</div>
                            )
                        })
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