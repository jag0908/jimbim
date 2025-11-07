import { Routes, Route } from 'react-router-dom'
import Index from './Component/Index'
import Login from './Component/member/Login'
import Join from './Component/member/Join'
import KakaoIdLogin from './Component/member/KakaoIdLogin'
import KakaoIdFirstEdit from './Component/member/KakaoIdFirstEdit'
import FindAccount from './Component/member/FindAccount'
import Mypage from './Component/mypage/Mypage'
import StyleFeed from './Component/StyleFeed/StyleFeed'
import StyleDetail from './Component/StyleFeed/StyleDetail'
import ShMain from './Component/sh-page/ShMain'

/*
import Community from './Component/community/Community'
import CommunityView from './Component/community/CommunityView'
import UpdateCommunity from './Component/community/UpdateCommunity'
*/
function App() {
    return (
		<div className="container">
			<Routes>
                <Route path='/' element={<Index />} />
				<Route path='/login' element={<Login />} />
				<Route path='/join' element={<Join />} />

				{/* <Route path='/community' element={<Community />} />
				<Route path='/communityView' element={<CommunityView />} />
				<Route path='/updateCommunity' element={<UpdateCommunity />} /> */}
          
				<Route path='/kakaoIdLogin/:userid' element={<KakaoIdLogin />} />
				<Route path='/kakaoIdFirstEdit/:userid' element={<KakaoIdFirstEdit />} />
				<Route path='/findaccount/' element={<FindAccount />} />
				<Route path='/mypage/' element={<Mypage />} />
				
				<Route path='/style' element={<StyleFeed />} />
        		<Route path='/style/:id' element={<StyleDetail />} />
        		<Route path='/sh-page' element={<ShMain />} />
	
			</Routes>
		</div>
    );
}

export default App;
