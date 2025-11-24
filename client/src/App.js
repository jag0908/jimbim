import { Routes, Route } from 'react-router-dom';
import Index from './Component/Index'
import Login from './Component/member/Login'
import Join from './Component/member/Join'
import KakaoIdLogin from './Component/member/KakaoIdLogin'
import KakaoIdFirstEdit from './Component/member/KakaoIdFirstEdit'
import FindAccount from './Component/member/FindAccount'
import DeleteMember from './Component/member/DeleteMember'

import Mypage from './Component/mypage/Mypage'
import Profile from './Component/mypage/Profile'
import AddressList from './Component/mypage/AddressList'
import Buying from './Component/mypage/Buying'
import Selling from './Component/mypage/Selling'
import Zzim from './Component/mypage/Zzim'

import Map from './Component/customer/Map'
import Qna from './Component/customer/Qna'

import StyleFeed from './Component/StyleFeed/StyleFeed'
import StyleDetail from './Component/StyleFeed/StyleDetail'
import StyleWrite from './Component/StyleFeed/StyleWrite'
import StyleUser from './Component/StyleFeed/StyleUser'
import StyleEdit from './Component/StyleFeed/StyleEdit'

import ShMain from './Component/sh-page/ShMain'
import Header from './Component/Header'
import Footer from './Component/Footer'
import ShWrite from './Component/sh-page/ShWrite'
import ShView from './Component/sh-page/ShView'


import CommunityList from './Component/community/CommunityList'
import WriteCommunity from './Component/community/WriteCommunity'
import CommunityView from './Component/community/CommunityView'

import ShUpdate from './Component/sh-page/ShUpdate';

import UpdateCommunity from './Component/community/UpdateCommunity'
import ChatRoom from './Component/chat/ChatRoom';





function App() {
    return (
	<>
		<Header /> {/* ✅ 항상 보이게 */}
		<div className="container">
			<Routes>
				<Route path="/" element={<Index />} />
				{/* 기태 */}
				<Route path="/login" element={<Login />} />
				<Route path="/join" element={<Join />} />
				<Route path="/kakaoIdLogin/:userid" element={<KakaoIdLogin />} />
				<Route path="/kakaoIdFirstEdit/:userid" element={<KakaoIdFirstEdit />} />
				<Route path="/findAccount" element={<FindAccount />} />
				<Route path="/deleteMember" element={<DeleteMember />} />
				<Route path="/mypage" element={<Mypage />} />
				<Route path="/mypage/profile" element={<Profile />} />
				<Route path="/mypage/addresslist" element={<AddressList />} />
				<Route path="/mypage/buying" element={<Buying />} />
				<Route path="/mypage/selling" element={<Selling />} />
				<Route path="/mypage/zzim" element={<Zzim />} />
				<Route path="/customer/map" element={<Map />} />
				<Route path="/customer/qna" element={<Qna />} />

				{/* 이삭 */}
				<Route path="/style" element={<StyleFeed />} />
				<Route path="/style/:id" element={<StyleDetail />} />
				<Route path="/stylewrite" element={<StyleWrite />} />
				<Route path="/styleUser/:userid" element={<StyleUser />} />
				<Route path="/style/edit/:id" element={<StyleEdit />} />

				{/* 정진 */}
				<Route path="/sh-page" element={<ShMain />} />
				<Route path='/sh-page/sh-write' element={<ShWrite />} />
				<Route path='/sh-page/sh-view/:id' element={<ShView />} />
				<Route path='/sh-page/sh-update/:id' element={<ShUpdate />} />


				{/* 은지 */}
				<Route path="/communityList" element={<CommunityList />} />
				<Route path="/writeCommunity" element={<WriteCommunity />} />
				<Route path="/communityView/:num" element={<CommunityView />} />
				<Route path="/updateCommunity" element={<UpdateCommunity />} />


			</Routes>
		</div>
		<Footer />
    </>
    );
}

export default App;
