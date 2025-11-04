import { Routes, Route } from 'react-router-dom'
import Index from './Component/Index'
import Login from './Component/member/Login'
import Join from './Component/member/Join'
import KakaoIdLogin from './Component/member/KakaoIdLogin'

function App() {
    return (
		<div className="container">
			<Routes>
                <Route path='/' element={<Index />} />
				<Route path='/login' element={<Login />} />
				<Route path='/join' element={<Join />} />
				<Route path='/kakaoIdLogin/:userid' element={<KakaoIdLogin />} />
			</Routes>
		</div>
    );
}

export default App;
