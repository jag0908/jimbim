import React, { useEffect, useState } from 'react';
import SideMenu from './SideMenu';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';

function Buying() {
	const loginUser = useSelector( state=>state.user )

	const navigate = useNavigate()
	const [shBuyingList, setShBuyingList] = useState([]);
	const [shopBuyingList, setShopBuyingList] = useState([]);
	
	useEffect(
		()=>{
			if(!loginUser.userid){
                alert("로그인이 필요한 서비스입니다")
                navigate("/")
            }else{
				jaxios.get('/api/mypage/getBuyingList', {params:{member_id:loginUser.member_id}})
                .then((result)=>{
                    setShBuyingList(result.data.shBuyingList)
					setShopBuyingList(result.data.shopBuyingList)
					console.log(result.data)
                })
                .catch((err)=>{console.error(err)})
			}
		},[]
	)

	function shopTitle(shopBuying){
		let result = shopBuying.orderdetail[0].post_id.title

		if (shopBuying.orderdetail.length>1) result += (" 외 " + ((Number)(shopBuying.orderdetail.length)-1) + "개 상품") 
		return result
	}
    return (
      	<article style={{height:'100%'}}>
            {/* height 짤리는 오류, css 중복되는 오류때문에 넣음 */}
            <div style={{display:'flex'}}>
                <SideMenu/>
                <div className='mypage'>
					<div style={{width:'700px'}}>
						<h3>중고마을</h3>
						{
							(shBuyingList.length!=0)?
							(
								shBuyingList.map((shBuying, idx)=>{
									return (
										<div key={idx}>
											<div>
												<div className=''>상품명</div>
												<div>{shBuying.post_id.title}</div>
											</div>
											<div>
												<div className=''>배송지</div>
												<div>{shBuying.address_simple + " " + shBuying.address_detail}</div>
											</div>
										</div>
									)
								})
							):
							(<div>아직 구매내역이 없습니다</div>)
						}
					</div>
					<div>
						<h3>SHOP</h3>
						{
							(shopBuyingList.length!=0)?
							(
								shopBuyingList.map((shopBuying, idx)=>{
									return (
										<div key={idx}>
											<div>
												<div className=''>상품명</div>
												<div>{shopTitle(shopBuying)}</div>
											</div>
											<div>
												<div className=''>배송지</div>
												<div>{shopBuying.address_simple + " " + shopBuying.address_detail}</div>
											</div>
										</div>
									)
								})
							):
							(<div>아직 구매내역이 없습니다</div>)
						}
					</div>
				</div>
			</div>
		</article>
    )
}

export default Buying