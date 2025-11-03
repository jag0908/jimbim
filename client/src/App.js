import { Routes, Route } from 'react-router-dom'
import Index from './Component/Index'
import Login from './Component/member/Login'
import Join from './Component/member/Join'

function App() {
    return (
		<div className="container">
			<Routes>
                <Route path='/' element={<Index />} />
				<Route path='/login' element={<Login />} />
				<Route path='/join' element={<Join />} />
			</Routes>
		</div>
    );
}

export default App;
