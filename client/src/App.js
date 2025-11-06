import { Routes, Route } from 'react-router-dom'
import Index from './Component/Index'
import Login from './Component/member/Login'
import Join from './Component/member/Join'
import KakaoIdLogin from './Component/member/KakaoIdLogin'
import StyleFeed from './Component/StyleFeed/StyleFeed'
import StyleDetail from './Component/StyleFeed/StyleDetail'

function App() {
    return (
		<div className="container">
			<Routes>
                <Route path='/' element={<Index />} />
				<Route path='/login' element={<Login />} />
				<Route path='/join' element={<Join />} />
				<Route path='/kakaoIdLogin/:userid' element={<KakaoIdLogin />} />
				<Route path='/style' element={<StyleFeed />} />
        		<Route path='/style/:id' element={<StyleDetail />} />
			</Routes>
		</div>
    );
}

export default App;
