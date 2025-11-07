import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';
import '../../style/Community.css';

function Community() {
  const [communityList, setCommunity] = useState([]);
  const [activeMenu, setActiveMenu] = useState('자유게시판');
  const navigate = useNavigate();
  const loginUser = useSelector((state) => state.user);
  const [paging, setPaging] = useState({});
  const [pages, setPages] = useState([]);

  const menuList = [
    '자유게시판',
    '질문게시판',
    '살말',
    '팔말',
    '시세',
    '정품 감정',
    '핫딜',
  ];

  useEffect(() => {
    fetchCommunityList(1, activeMenu);
  }, [activeMenu]);

  function fetchCommunityList(page, menu) {
    jaxios
      .get(`/api/Community/getCommunity/${page}`, { params: { category: menu } }) // 선택된 메뉴 기준 조회
      .then((result) => {
        setCommunity([...result.data.communityList]);
        setPaging(result.data.paging);

        const pageArr = [];
        for (let i = result.data.paging.beginPage; i <= result.data.paging.endPage; i++) {
          pageArr.push(i);
        }
        setPages([...pageArr]);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function onPageMove(p) {
    fetchCommunityList(p, activeMenu);
  }

  function onCommunityView(num) {
    jaxios
      .post('/api/Community/addReadCount', null, { params: { cpost_num: num } })
      .then(() => {
        navigate(`/communityView/${num}`);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleMenuClick(menu) {
    setActiveMenu(menu);
  }

  return (
    <div className="community">
      {/* 사이드바 */}
      <div className="sidebar">
        <ul>
          {menuList.map((menu, idx) => (
            <li
              key={idx}
              className={activeMenu === menu ? 'active' : ''}
              onClick={() => handleMenuClick(menu)}
            >
              {menu}
            </li>
          ))}
        </ul>
      </div>

      {/* 게시글 */}
      <div className="community-content">
        <div className="titlerow">
          <div className="titlecol">제목</div>
          <div className="titlecol">글쓴이</div>
          <div className="titlecol">작성일</div>
          <div className="titlecol">조회수</div>
        </div>

        {communityList.map((community, idx) => {
          return (
            <div className="row" key={idx}>
              <div className="col">{community.num}</div>
              <div className="col" onClick={() => onCommunityView(community.num)}>
                {community.title}
              </div>
              <div className="col">{community.userid}</div>
              <div className="col">{community.writedate.substring(0, 10)}</div>
              <div className="col">{community.readcount}</div>
            </div>
          );
        })}

        <div id="paging" style={{ textAlign: 'center', padding: '10px' }}>
          {paging.prev ? (
            <span style={{ cursor: 'pointer' }} onClick={() => onPageMove(paging.beginPage - 1)}>
              ◀
            </span>
          ) : (
            <span></span>
          )}
          {pages.map((page, idx) => (
            <span
              style={{ cursor: 'pointer' }}
              key={idx}
              onClick={() => onPageMove(page)}
            >
              &nbsp;{page}&nbsp;
            </span>
          ))}
          {paging.next ? (
            <span style={{ cursor: 'pointer' }} onClick={() => onPageMove(paging.endPage + 1)}>
              ▶
            </span>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default Community;
