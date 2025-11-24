import {Routes, Route } from 'react-router-dom'
import Admin from './Component/Admin'
import MemberList from './Component/member/MemberList'
import ShList from './Component/product/ShList'


function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Admin />}/>
				<Route path="/memberList" element={<MemberList />}/>
				<Route path="/shList" element={<ShList />}/>
			</Routes>
		</div>
	);
}

export default App;
