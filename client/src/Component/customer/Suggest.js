import React, { useState, useEffect } from 'react';
import SideMenu from './SideMenu';
import '../../style/suggest.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const baseURL = process.env.REACT_APP_BASE_URL;

function Suggest() {
    const loginUser = useSelector(state => state.user);
    const navigate = useNavigate();

    const [suggestList, setSuggestList] = useState([]);
    const [paging, setPaging] = useState({});
    const [pageNumbers, setPageNumbers] = useState([]);

    useEffect(() => {
        if (loginUser?.member_id) fetchSuggestList(1);
    }, [loginUser]);

    const fetchSuggestList = (page) => {
        axios.get(`${baseURL}/shop/getSuggestList/${page}`, {
            params: { memberId: loginUser.member_id }
        })
        .then(res => {
            const data = res.data || {};
            const list = data.list || [];
            const pageData = data.paging || {};

            setSuggestList(list);
            setPaging(pageData);

            const pages = [];
            for (let i = pageData.beginPage || 1; i <= (pageData.endPage || 1); i++) {
                pages.push(i);
            }
            setPageNumbers(pages);
        })
        .catch(err => {
            console.error('Suggest fetch error:', err);
            setSuggestList([]);
            setPaging({});
            setPageNumbers([]);
        });
    }

    const handlePageClick = (page) => fetchSuggestList(page);

    const handleDelete = async (suggestId) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        try {
            await axios.delete(`${baseURL}/shop/deleteSuggest/${suggestId}`);
            alert("삭제되었습니다.");
            fetchSuggestList(paging.page || 1);
        } catch (err) {
            console.error(err);
            alert("삭제 실패");
        }
    }

    return (
        <div className='customercontainer'>
            <SideMenu />
            <div className='customer'>
                <div className='formtitle'>요청내역</div>

                {suggestList.length === 0 ? (
                    <div className='noData'>
                        {loginUser.member_id ? '요청내역이 없습니다.' : '로그인 후 사용 가능합니다.'}
                    </div>
                ) : (
                    <div className='suggestTable'>
                        <div className='suggestListHeader'>
                            <div className='suggestField title'>제목</div>
                            <div className='suggestField date'>작성일</div>
                            <div className='suggestField delete'>삭제</div>
                        </div>

                        {suggestList.map((suggest) => (
                            <div key={suggest.suggestId} className='suggestList'>
                                <div className='suggestField title'
                                     onClick={() => navigate(`/customer/suggestDetail/${suggest.suggestId}`)}>
                                    {suggest.title}
                                </div>
                                <div className='suggestField date'>
                                    {suggest.indate ? new Date(suggest.indate).toLocaleDateString() : ''}
                                </div>
                                <div className='suggestField delete'>
                                    <div className='actions'>
                                        <button onClick={() => handleDelete(suggest.suggestId)}>삭제</button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className='paging'>
                            {paging.prev && <span className='pageArrow' onClick={() => handlePageClick(paging.beginPage - 1)}>◀</span>}
                            {pageNumbers.map((num) => (
                                <span key={num}
                                      className={`pageNum ${num === paging.page ? 'active' : ''}`}
                                      onClick={() => handlePageClick(num)}>
                                    {num}
                                </span>
                            ))}
                            {paging.next && <span className='pageArrow' onClick={() => handlePageClick(paging.endPage + 1)}>▶</span>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Suggest;
