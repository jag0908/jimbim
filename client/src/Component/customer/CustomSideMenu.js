import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function CustomerSideMenu() {
    const navigate = useNavigate();
    const location = useLocation();

    const menus = [
        {
            items: [
                { name: "문의하기", path: "/customer/qna" },
                { name: "찾아오시는 길", path: "/customer/map" },
            ],
        },
    ];

    const renderMenu = (menuGroup) => (
        <div key={menuGroup.title} className="menuGroup">
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
            <h2 className="sidebarHeader">고객센터</h2>
            {menus.map(renderMenu)}
        </div>
    );
}

export default CustomerSideMenu;
