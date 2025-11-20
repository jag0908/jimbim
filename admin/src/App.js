import {Routes, Route } from 'react-router-dom'
import Admin from './Component/Admin'
import MemberList from './Component/member/MemberList'


function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Admin />}/>
				<Route path="/memberList" element={<MemberList />}/>
			</Routes>
		</div>
	);
}

export default App;
