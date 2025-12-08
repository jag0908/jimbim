import {Routes, Route } from 'react-router-dom'
import Admin from './Component/Admin'
import MemberList from './Component/member/MemberList'
import MemberDetail from './Component/member/MemberDetail'
import ShList from './Component/product/ShList'
import ShDetail from './Component/product/ShDetail'
import ShopList from './Component/shop/ShopList'
import ShopDetail from './Component/shop/ShopDetail'
import OptionList from './Component/shop/OptionList'
import SuggestList from './Component/suggest/SuggestList'
import SuggestDetail from './Component/suggest/SuggestDetail'
import CommunityList from './Component/community/CommunityList'
import CommunityDetail from './Component/community/CommunityDetail'
import QnaList from './Component/customer/QnaList'
import QnaDetail from './Component/customer/QnaDetail'


function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Admin />}/>
				<Route path="/memberList" element={<MemberList />}/>
				<Route path="/memberDetail/:member_id" element={<MemberDetail />}/>
				<Route path="/shList" element={<ShList />}/>
				<Route path="/shDetail/:postId" element={<ShDetail />}/>
				<Route path="/shopList" element={<ShopList />}/>
				<Route path="/shopDetail/:productId" element={<ShopDetail />}/>
				<Route path="/shopDetail/:productId/optionList" element={<OptionList />}/>
				<Route path="/suggestList" element={<SuggestList />}/>
				<Route path="/suggestDetail/:suggestId" element={<SuggestDetail />}/>
				<Route path="/communityList" element={<CommunityList />}/>
				<Route path="/communityDetail/:cpostId" element={<CommunityDetail />}/>
				<Route path="/qnaList" element={<QnaList />}/>
				<Route path="/qnaDetail/:qnaId" element={<QnaDetail />}/>
			</Routes>
		</div>
	);
}

export default App;
