import React from 'react'
import SideMenu from './SideMenu'
function Zzim() {
    return (
        <article style={{height:'100%'}}>
            {/* height 짤리는 오류, css 중복되는 오류때문에 넣음 */}
            <div style={{display:'flex'}}>
                <SideMenu/>
                <div className='mypage'>
					<div>
						<h3>중고마을</h3>
					</div>
					<div>
						<h3>SHOP</h3>
					</div>
				</div>
			</div>
		</article>
    )
}

export default Zzim