import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function MypageSideMenu() {
    const navigate = useNavigate();
    const location = useLocation();

    const menus = [
        {
            title: "내 정보",
            items: [
                { name: "로그인 정보", path: "/mypage" },
                { name: "프로필 관리", path: "/mypage/profile" },
                { name: "주소록", path: "/mypage/addresslist" },
            ],
        },
        {
            title: "쇼핑 정보",
            items: [
                { name: "구매 내역", path: "/mypage/purchase" },
                { name: "판매 내역", path: "/mypage/sales" },
                { name: "요청 내역", path: "/mypage/suggest" },
            ],
        },
    ];

    const renderMenu = (menuGroup) => (
        <div key={menuGroup.title} className="menuGroup">
            <h3 className="menuTitle">{menuGroup.title}</h3>
            <ul className="menuList">
                {menuGroup.items.map((menu) => (
                    <li
                        key={menu.path}
                        className={`menuItem ${location.pathname === menu.path ? "active" : ""}`}
                        onClick={() => navigate(menu.path)}
                    >
                        {menu.name}
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className='mypageSidebar'>
            <h2 className="sidebarHeader">마이페이지</h2>
            {menus.map(renderMenu)}
        </div>
    );
}

export default MypageSideMenu;
