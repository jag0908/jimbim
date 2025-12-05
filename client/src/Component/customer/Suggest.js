import React, { useState, useEffect } from 'react';
import SideMenu from './SideMenu';
import '../../style/customer.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL;

function Suggest() {
    const loginUser = useSelector(state => state.user);
    const navigate = useNavigate();

    const [suggestList, setSuggestList] = useState([]);
    const [paging, setPaging] = useState({});
    const [beginEnd, setBeginEnd] = useState([]);

    useEffect(() => {
        if (loginUser.userid) {
            fetchSuggestList(1);
        }
    }, [loginUser]);

    function fetchSuggestList(page) {
        axios.get(`${baseURL}/shop/getSuggestList/${page}`, {
            params: { userid: loginUser.userid }
        })
            .then((res) => {
                // 안전하게 구조 분해
                const data = res.data || {};
                const list = data.list || [];
                const pageData = data.paging || {};

                setSuggestList(list);
                setPaging(pageData);

                const arr = [];
                for (let i = pageData.beginPage || 1; i <= (pageData.endPage || 1); i++) {
                    arr.push(i);
                }
                setBeginEnd([...arr]);
            })
            .catch(err => {
                console.error('Suggest fetch error:', err);
                setSuggestList([]);
                setPaging({});
                setBeginEnd([]);
            });
    }

    function onPageMove(page) {
        fetchSuggestList(page);
    }

    return (
        <div className='customercontainer'>
            <SideMenu />
            <div className='customer'>
                <div className='formtitle'>요청내역</div>
                <div className='suggestTable'>
                    {(suggestList.length > 0) ?
                        <div className='suggestListHeader'>
                            <div className='suggestField'>제목</div>
                            <div className='suggestField'>내용</div>
                            <div className='suggestField'>작성일</div>
                        </div>
                        : <div>{loginUser.userid ? '요청내역이 없습니다.' : '로그인 후 사용 가능합니다.'}</div>
                    }

                    {suggestList.map((suggest, idx) => (
                        <div key={idx} className='suggestList' onClick={() => navigate(`/customer/suggestDetail/${suggest.suggestId}`)}>
                            <div className='suggestField'>{suggest.title}</div>
                            <div className='suggestField'>{suggest.content}</div>
                            <div className='suggestField'>{suggest.indate ? suggest.indate.substring(0, 10) : ''}</div>
                        </div>
                    ))}

                    {(suggestList.length > 0) &&
                        <div id="paging" style={{ textAlign: "center", padding: "10px" }}>
                            {paging.prev && <span style={{ cursor: "pointer" }} onClick={() => onPageMove(paging.beginPage - 1)}> ◀ </span>}
                            {beginEnd.map((page, idx) => (
                                <span
                                    key={idx}
                                    style={page === paging.page ? { fontWeight: 'bold', cursor: "pointer" } : { cursor: "pointer" }}
                                    onClick={() => onPageMove(page)}
                                >
                                    &nbsp;{page}&nbsp;
                                </span>
                            ))}
                            {paging.next && <span style={{ cursor: "pointer" }} onClick={() => onPageMove(paging.endPage + 1)}> ▶ </span>}
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Suggest;
