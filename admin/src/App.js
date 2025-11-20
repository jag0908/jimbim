import {Routes, Route } from 'react-router-dom'
import Admin from './Component/Admin'

function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Admin />}/>
			</Routes>
		</div>
	);
}

export default App;
