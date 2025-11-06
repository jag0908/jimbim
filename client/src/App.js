import { Routes, Route } from 'react-router-dom'
import Index from './Component/Index'
import Login from './Component/member/Login'
import Join from './Component/member/Join'

import Community from './Component/community/Community'
import CommunityView from './Component/community/CommunityView'
import UpdateCommunity from './Component/community/UpdateCommunity'

function App() {
    return (
		<div className="container">
			<Routes>
                <Route path='/' element={<Index />} />
				<Route path='/login' element={<Login />} />
				<Route path='/join' element={<Join />} />

				<Route path='/community' element={<Community />} />
				<Route path='/communityView' element={<CommunityView />} />
				<Route path='/updateCommunity' element={<UpdateCommunity />} />
			</Routes>
		</div>
    );
}

export default App;
