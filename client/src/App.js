import { Routes, Route } from 'react-router-dom';
import Index from './Component/Index'
import Login from './Component/member/Login'
import Join from './Component/member/Join'
import KakaoIdLogin from './Component/member/KakaoIdLogin'
import KakaoIdFirstEdit from './Component/member/KakaoIdFirstEdit'
import FindAccount from './Component/member/FindAccount'
import UpdateForm from './Component/member/UpdateForm'
import Mypage from './Component/mypage/Mypage'
import AddressList from './Component/mypage/AddressList'
import StyleFeed from './Component/StyleFeed/StyleFeed'
import StyleDetail from './Component/StyleFeed/StyleDetail'
import StyleWrite from './Component/StyleFeed/StyleWrite'
import StyleUser from './Component/StyleFeed/StyleUser'
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
				<Route path="/updateform" element={<UpdateForm />} />
				<Route path="/mypage" element={<Mypage />} />
				<Route path="/mypage/addresslist" element={<AddressList />} />

				{/* 이삭 */}
				<Route path="/style" element={<StyleFeed />} />
				<Route path="/style/:id" element={<StyleDetail />} />
				<Route path="/stylewrite" element={<StyleWrite />} />
				<Route path="/styleUser/:userid" element={<StyleUser />} />

				{/* 정진 */}
				<Route path="/sh-page" element={<ShMain />} />
				<Route path='/sh-page/sh-write' element={<ShWrite />} />
				<Route path='/sh-page/sh-view/:id' element={<ShView />} />
				<Route path='/sh-page/sh-update/:id' element={<ShUpdate />} />


				{/* 은지 */}
				<Route path="/communityList" element={<CommunityList />} />
				<Route path="/writeCommunity" element={<WriteCommunity />} />
				<Route path="/communityView" element={<CommunityView />} />
				<Route path="/updateCommunity" element={<UpdateCommunity />} />


			</Routes>
		</div>
		<Footer />
    </>
    );
}

export default App;
