import {Routes, Route } from 'react-router-dom'
import Admin from './Component/Admin'
import MemberList from './Component/member/MemberList'
import MemberDetail from './Component/member/MemberDetail'
import ShList from './Component/product/ShList'
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
				<Route path="/qnaList" element={<QnaList />}/>
				<Route path="/qnaDetail/:qnaId" element={<QnaDetail />}/>
			</Routes>
		</div>
	);
}

export default App;
