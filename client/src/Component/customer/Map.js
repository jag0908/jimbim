import React, {useEffect} from 'react'
import SideMenu from './SideMenu';
import '../../style/customer.css';

const {kakao} = window;

function Map() {
    useEffect(
        ()=>{
            const container = document.getElementById('map');
            const options = { center: new kakao.maps.LatLng( 37.556359, 126.937202 ) };
            const kakaoMap = new kakao.maps.Map(container, options);
            const markerPosition = new kakao.maps.LatLng( 37.556359, 126.937202 );
            var marker = new kakao.maps.Marker({position: markerPosition});
            marker.setMap(kakaoMap);
        },[]
    )
    return (
        <div className='customercontainer'>
            <SideMenu/>
            <div>
                <div className='formtitle'>찾아오시는 길</div>
                <div id='map' style={{width:"800px", height:"400px", margin:"20px"}}></div>  
            </div>
        </div>
    )
}

export default Map