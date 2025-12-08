import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../../store/userSlice';
import jaxios from '../../util/jwtutil';
import axios from 'axios';
import '../../style/login.css';
import '../../style/mypage.css';
import SideMenu from './MypageSideMenu';

function Mypage() {
    const loginUser = useSelector(state => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cookies = new Cookies();

    const [member, setMember] = useState({});
    const [type, setType] = useState('');
    const [form, setForm] = useState({
        prePwd: '', pwd: '', pwdChk: '',
        email: '', phone1: '', phone2: '', phone3: '',
        rrn1: '', rrn2: '', terms_agree: '', personal_agree: ''
    });

    const resetForm = (member) => {
        setMember(member);
        setType('');
        setForm({
            prePwd: '',
            pwd: '',
            pwdChk: '',
            email: member.email || '',
            phone1: member.phone?.substring(0, 3) || '',
            phone2: member.phone?.substring(4, 8) || '',
            phone3: member.phone?.substring(9, 13) || '',
            rrn1: member.rrn?.substring(0, 6) || '',
            rrn2: member.rrn?.substring(7, 8) || '',
            terms_agree: member.terms_agree || 'N',
            personal_agree: member.personal_agree || 'N'
        });
    };

    useEffect(() => {
        if (!loginUser.userid) {
            alert("로그인이 필요한 서비스입니다");
            navigate("/");
        } else {
            jaxios.get(`/api/member/getMember`, { params: { userid: loginUser.userid } })
                .then(res => resetForm(res.data.member))
                .catch(err => console.error(err));
        }
    }, []);

    const editField = (field) => {
        resetForm(member);
        setType(field);
    };

    const getNumberOnly = (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    };

    const checkRRN = (rrn1, rrn2) => {
        const last = Number(rrn2);
        let year = Number(rrn1.substr(0, 2));
        if (last === 1 || last === 2) year += 1900;
        else if (last === 3 || last === 4) year += 2000;

        const month = Number(rrn1.substr(2, 2));
        const day = Number(rrn1.substr(4, 2));
        if (last < 1 || last > 4 || month === 0 || day === 0) return false;

        if ([1, 3, 5, 7, 8, 10, 12].includes(month) && day > 31) return false;
        if ([4, 6, 9, 11].includes(month) && day > 30) return false;
        if (month === 2) {
            const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
            if ((isLeap && day > 29) || (!isLeap && day > 28)) return false;
        }
        return true;
    };

    const isChecked = (value) => value === 'Y';

    const handleUpdateAgree = async (agreeType, value) => {
        if (window.confirm('수정하시겠습니까?')) {
            await jaxios.post('/api/member/updateAgree', null, { params: { userid: loginUser.userid, agree: agreeType, yn: value } })
                .then(() => alert('정보 수정이 완료되었습니다'))
                .catch(err => console.error(err));

            jaxios.get(`/api/member/getMember`, { params: { userid: loginUser.userid } })
                .then(res => resetForm(res.data.member))
                .catch(err => console.error(err));
        }
    };

    const handleSubmit = async () => {
        let rrn = '', phone = '';
        if (type === 'email') {
            if (!form.email) return alert('이메일을 입력하세요');
            if (!/\w+@(\w+\.)+\w+/.test(form.email)) return alert('유효한 이메일을 입력하세요');
        }
        if (type === 'phone') {
            if (!form.phone1 || !form.phone2 || !form.phone3) return alert('전화번호를 입력하세요');
            phone = `${form.phone1}-${form.phone2}-${form.phone3}`;
        }
        if (type === 'rrn') {
            if (!form.rrn1 || !form.rrn2) return alert('주민등록번호를 입력하세요');
            if (!checkRRN(form.rrn1, form.rrn2)) return alert('유효한 주민등록번호를 입력하세요');
            rrn = `${form.rrn1}-${form.rrn2}******`;
        }

        await jaxios.post('/api/member/updateMember', { userid: loginUser.userid, email: form.email, phone, rrn })
            .then(res => {
                alert('정보 수정이 완료되었습니다');
                resetForm(res.data.member);
                setType('');
            })
            .catch(err => console.error(err));
    };

    const handleUpdatePwd = async () => {
        if (!form.prePwd) return alert('현재 비밀번호를 입력하세요');
        if (!form.pwd) return alert('새 비밀번호를 입력하세요');
        if (form.pwd !== form.pwdChk) return alert('비밀번호 확인이 일치하지 않습니다');

        const res = await jaxios.post('/api/member/pwdcheck', null, { params: { userid: loginUser.userid, pwd: form.prePwd } });
        if (res.data.msg !== 'ok') return alert('현재 비밀번호가 일치하지 않습니다');

        await jaxios.post('/api/member/updatePwd', { userid: loginUser.userid, pwd: form.pwd })
            .then(() => alert('비밀번호가 수정되었습니다'))
            .catch(err => console.error(err));

        const loginRes = await axios.post('/api/member/login', null, { params: { username: loginUser.userid, password: form.pwd } });
        if (loginRes.data.error === 'ERROR_LOGIN') alert('아이디 비밀번호를 확인하세요');
        else {
            dispatch(loginAction(loginRes.data));
            cookies.set('user', JSON.stringify(loginRes.data), { path: '/' });
        }

        jaxios.get(`/api/member/getMember`, { params: { userid: loginUser.userid } })
            .then(res => resetForm(res.data.member))
            .catch(err => console.error(err));
    };

    return (
        <div className="mypagebody">
            <SideMenu />
            <div className="mypage">
                <h2 className="formtitle">로그인 정보</h2>

                {loginUser.provider !== 'KAKAO' && (
                    <div className="field">
                        <label>ID</label>
                        <div>{loginUser.userid}</div>

                        <label>비밀번호</label>
                        {type === 'pwd' ? (
                            <>
                                <input type="password" placeholder="현재 비밀번호" value={form.prePwd} onChange={e => setForm({ ...form, prePwd: e.target.value })} />
                                <input type="password" placeholder="새 비밀번호" value={form.pwd} onChange={e => setForm({ ...form, pwd: e.target.value })} />
                                <input type="password" placeholder="비밀번호 확인" value={form.pwdChk} onChange={e => setForm({ ...form, pwdChk: e.target.value })} />
                                <div className="formBtns">
                                    <button onClick={handleUpdatePwd}>수정</button>
                                    <button onClick={() => editField('')}>취소</button>
                                </div>
                            </>
                        ) : (
                            <div>
                                <span>********</span>
                                <div className="formBtns">
                                    <button onClick={() => editField('pwd')}>변경</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* 이메일, 전화번호, 주민번호 등 반복되는 구조는 map 또는 컴포넌트로 추출 가능 */}
                <div className="field">
                    <label>이메일</label>
                    {type === 'email' ? (
                        <>
                            <input type="text" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            <div className="formBtns">
                                <button onClick={handleSubmit}>수정</button>
                                <button onClick={() => editField('')}>취소</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>{member.email}</div>
                            <div className="formBtns">
                                <button onClick={() => editField('email')}>변경</button>
                            </div>
                        </>
                    )}
                </div>

                <div className="field">
                    <label>전화번호</label>
                    {type === 'phone' ? (
                        <>
                            <input type="text" maxLength="3" value={form.phone1} onInput={getNumberOnly} onChange={e => setForm({ ...form, phone1: e.target.value })} /> -
                            <input type="text" maxLength="4" value={form.phone2} onInput={getNumberOnly} onChange={e => setForm({ ...form, phone2: e.target.value })} /> -
                            <input type="text" maxLength="4" value={form.phone3} onInput={getNumberOnly} onChange={e => setForm({ ...form, phone3: e.target.value })} />
                            <div className="formBtns">
                                <button onClick={handleSubmit}>수정</button>
                                <button onClick={() => editField('')}>취소</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>{member.phone}</div>
                            <div className="formBtns">
                                <button onClick={() => editField('phone')}>변경</button>
                            </div>
                        </>
                    )}
                </div>

                <div className="field">
                    <label>주민등록번호</label>
                    {type === 'rrn' ? (
                        <>
                            <input type="text" maxLength="6" value={form.rrn1} onInput={getNumberOnly} onChange={e => setForm({ ...form, rrn1: e.target.value })} /> -
                            <input type="text" maxLength="1" value={form.rrn2} onInput={getNumberOnly} onChange={e => setForm({ ...form, rrn2: e.target.value })} /> ******
                            <div className="formBtns">
                                <button onClick={handleSubmit}>수정</button>
                                <button onClick={() => editField('')}>취소</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>{member.rrn}</div>
                            <div className="formBtns">
                                <button onClick={() => editField('rrn')}>변경</button>
                            </div>
                        </>
                    )}
                </div>

                <div className="field">
                    <label>동의사항(선택)</label>
                    <div className="checkboxField">
                        <label>약관 동의</label>
                        <input type="checkbox" checked={isChecked(form.terms_agree)} readOnly onClick={() => handleUpdateAgree('terms', form.terms_agree)} />
                    </div>
                    <div className="checkboxField">
                        <label>개인정보 동의</label>
                        <input type="checkbox" checked={isChecked(form.personal_agree)} readOnly onClick={() => handleUpdateAgree('personal', form.personal_agree)} />
                    </div>
                </div>

                <div className="field">
                    <label>가입일</label>
                    <div>{member.indate?.substring(0, 10)}</div>
                </div>

                <div className="formBtns">
                    <button onClick={() => navigate('/deleteMember')} style={{ backgroundColor: 'red' }}>회원탈퇴</button>
                </div>
            </div>
        </div>
    );
}

export default Mypage;
