import React, { useEffect, useState } from 'react'
import SideMenu from './SideMenu';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';
function Zzim() {
	const loginUser = useSelector( state=>state.user )

	const navigate = useNavigate()
	const [shZzimList, setShZzimList] = useState([]);
	const [shopZzimList, setShopZzimList] = useState([]);

	useEffect(
		()=>{
			if(!loginUser.userid){
                alert("로그인이 필요한 서비스입니다")
                navigate("/")
            }else{
				jaxios.get('/api/mypage/getZzimList', {params:{member_id:loginUser.member_id}})
                .then((result)=>{
                    setShZzimList(result.data.shZzimList)
					setShopZzimList(result.data.shopZzimList)
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
					<div className='mypage'>
						<div style={{width:'700px'}}>
							<h3>중고마을</h3>
							{
								(shZzimList.length!=0)?
								(
									shZzimList.map((shZzim, idx)=>{
										return (
											<div key={idx}>
												<div>
													<div className=''>상품명</div>
													<div>{shZzim.post.title}</div>
												</div>
												<div>
													<div className=''>가격</div>
													<div>{shZzim.post.price} 원</div>
												</div>
											</div>
										)
									})
								):
								(<div>아직 찜한 상품이 없습니다</div>)
							}
						</div>
						<div>
							<h3>SHOP</h3>
							{
								(shopZzimList.length!=0)?
								(
									shopZzimList.map((shopZzim, idx)=>{
										return (
											<div key={idx}>
												<div>
													<div className=''>상품명</div>
													<div>{shopZzim.post.title}</div>
												</div>
												<div>
													<div className=''>가격</div>
													<div>{shopZzim.post.price} 원</div>
												</div>
											</div>
										)
									})
								):
								(<div>아직 찜한 상품이 없습니다</div>)
							}
						</div>
					</div>
				</div>
			</div>
		</article>
    )
}

export default Zzim