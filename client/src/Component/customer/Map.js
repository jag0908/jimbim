import React, { useEffect } from 'react';
import SideMenu from './CustomSideMenu';
import '../../style/customer.css';

const { kakao } = window;

function Map() {
    useEffect(() => {
        const container = document.getElementById('map');
        const options = { center: new kakao.maps.LatLng(37.556359, 126.937202) };
        const kakaoMap = new kakao.maps.Map(container, options);
        const marker = new kakao.maps.Marker({ position: options.center });
        marker.setMap(kakaoMap);
    }, []);

    return (
        <div className="customercontainer">
            <SideMenu type="map" />
            <div className="customer">
                <div className="formtitle">찾아오시는 길</div>
                <div id="map" className="mapContainer"></div>
            </div>
        </div>
    );
}

export default Map;
