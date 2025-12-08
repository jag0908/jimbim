// CustomerSideMenu.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function CustomerSideMenu() {
    const navigate = useNavigate();
    const location = useLocation();

    const menus = [
        { name: "문의하기", path: "/customer/qna" },
        { name: "찾아오시는 길", path: "/customer/map" },
    ];

    return (
        <div className="customercontainer">
            <div className={`customerSidebar ${location.pathname.includes('map') ? 'map' : ''}`}>
                <h3>고객센터</h3>
                <ul>
                    {menus.map((menu) => (
                        <li
                            key={menu.path}
                            className={location.pathname === menu.path ? 'active' : ''}
                            onClick={() => navigate(menu.path)}
                        >
                            {menu.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default CustomerSideMenu;
