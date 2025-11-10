import { Routes, Route } from 'react-router-dom';
import Index from './Component/Index'
import Login from './Component/member/Login'
import Join from './Component/member/Join'
import KakaoIdLogin from './Component/member/KakaoIdLogin'
import KakaoIdFirstEdit from './Component/member/KakaoIdFirstEdit'
import FindAccount from './Component/member/FindAccount'
import Mypage from './Component/mypage/Mypage'
import AddressList from './Component/mypage/AddressList'
import StyleFeed from './Component/StyleFeed/StyleFeed'
import StyleDetail from './Component/StyleFeed/StyleDetail'
import StyleWrite from './Component/StyleFeed/StyleWrite'
import ShMain from './Component/sh-page/ShMain'
import Header from './Component/Header'
import Footer from './Component/Footer'
import ShWrite from './Component/sh-page/ShWrite'

/*
import Community from './Component/community/Community'
import CommunityView from './Component/community/CommunityView'
import UpdateCommunity from './Component/community/UpdateCommunity'

*/


function App() {
    return (
	<>
		<Header /> {/* ✅ 항상 보이게 */}
		<div className="container">
			<Routes>
			<Route path="/" element={<Index />} />
			<Route path="/login" element={<Login />} />
			<Route path="/join" element={<Join />} />
			<Route path="/kakaoIdLogin/:userid" element={<KakaoIdLogin />} />
			<Route path="/kakaoIdFirstEdit" element={<KakaoIdFirstEdit />} />
			<Route path="/findAccount" element={<FindAccount />} />
			<Route path="/mypage" element={<Mypage />} />
			<Route path="/mypage/addresslist" element={<AddressList />} />
			<Route path="/style" element={<StyleFeed />} />
			<Route path="/style/:id" element={<StyleDetail />} />
			<Route path="/stylewrite" element={<StyleWrite />} />
			<Route path="/sh-page" element={<ShMain />} />
			<Route path="/shwrite" element={<ShWrite />} />
			</Routes>
		</div>
		<Footer />
    </>
    );
}

export default App;
