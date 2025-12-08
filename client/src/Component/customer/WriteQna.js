import React, { useEffect, useState } from 'react';
import SideMenu from './SideMenu';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import jaxios from '../../util/jwtutil';

function WriteQna() {
    const loginUser = useSelector(state => state.user);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [member, setMember] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        if (!loginUser.userid) {
            alert("로그인이 필요한 서비스입니다");
            navigate("/login");
        } else {
            jaxios.get(`/api/member/getMember`, { params: { userid: loginUser.userid } })
                .then(res => setMember(res.data.member));
        }
    }, []);

    function onSubmit() {
        if (!title) return alert('제목을 입력하세요');
        if (!content) return alert('내용을 입력하세요');

        jaxios.post('/api/customer/writeQna', { title, content, member })
            .then(() => {
                alert('문의가 완료되었습니다.');
                navigate('/customer/qna');
            });
    }

    return (
        <div className='customercontainer'>
            <SideMenu />
            <div className='customer'>
                <div className='formtitle'>문의 작성</div>
                <div className='qnatitle'>
                    <input type='text' value={title} onChange={e => setTitle(e.target.value)} placeholder="제목" />
                </div>
                <div className='qnaTextarea'>
                    <textarea value={content} onChange={e => setContent(e.target.value)} maxLength={2000}></textarea>
                </div>
                <div className='detailPageBtns'>
                    <button onClick={onSubmit}>문의</button>
                    <button className='graybtn' onClick={() => navigate('/customer/qna')}>취소</button>
                </div>
            </div>
        </div>
    );
}

export default WriteQna;
