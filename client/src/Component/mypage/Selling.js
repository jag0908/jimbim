import React, { useEffect, useState } from 'react';
import SideMenu from './SideMenu';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';

function Selling() {
	const loginUser = useSelector( state=>state.user )

	const navigate = useNavigate()
	const [shSellingList, setShSellingList] = useState([]);
	const [shopSellingList, setShopSellingList] = useState([]);

	useEffect(
		()=>{
			if(!loginUser.userid){
                alert("로그인이 필요한 서비스입니다")
                navigate("/")
            }else{
				jaxios.get('/api/mypage/getSellingList', {params:{member_id:loginUser.member_id}})
                .then((result)=>{
                    setShSellingList(result.data.shSellingList)
					setShopSellingList(result.data.shopSellingList)
					console.log(result.data)
                })
                .catch((err)=>{console.error(err)})
			}
		},[]
	)

	return (
		<article style={{height:'100%'}}>
            {/* height 짤리는 오류, css 중복되는 오류때문에 넣음 */}
            <div style={{display:'flex'}}>
                <SideMenu/>
                <div className='mypage'>
					<div style={{width:'700px'}}>
						<h3>중고마을</h3>
						{
							(shSellingList.length!=0)?
							(
								shSellingList.map((shSelling, idx)=>{
									return (
										<div key={idx}>
											<div>
												<div className=''>상품명</div>
												<div>{shSelling.title}</div>
											</div>
											<div>
												<div className=''>가격</div>
												<div>{shSelling.price} 원</div>
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
							(shopSellingList.length!=0)?
							(
								shopSellingList.map((shopSelling, idx)=>{
									return (
										<div key={idx}>
											<div>
												<div className=''>상품명</div>
												<div>{shopSelling.title}</div>
											</div>
											<div>
												<div className=''>가격</div>
												<div>{shopSelling.price} 원</div>
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

export default Selling