import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../../style/suggest.css';
import SideMenu from './MypageSideMenu';

const baseURL = process.env.REACT_APP_BASE_URL;

function SuggestDetail() {
  const { suggestId } = useParams();
  const loginUser = useSelector(state => state.user);
  const navigate = useNavigate();

  const [suggest, setSuggest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestDetail();
  }, [suggestId]);

  const fetchSuggestDetail = () => {
    axios.get(`${baseURL}/shop/getSuggestDetail/${suggestId}`)
      .then(res => {
        console.log(res.data); // 서버에서 받은 DTO 확인
        setSuggest(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("상세조회 실패:", err);
        setLoading(false);
      });
  };

  const handleDelete = () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    axios.delete(`${baseURL}/customer/deleteSuggest/${suggestId}`)
      .then(() => {
        alert("삭제되었습니다.");
        navigate("/customer/suggest");
      })
      .catch(err => {
        console.error("삭제 실패:", err);
        alert("삭제 실패");
      });
  };

  if (loading) return <div className='noData'>로딩 중...</div>;
  if (!suggest) return <div className='noData'>게시물을 찾을 수 없습니다.</div>;

  // ✅ DTO에서 내려주는 memberId 사용
  const canDelete = loginUser?.member_id === suggest.memberId;

  return (
    <div className='customercontainer'>
      <SideMenu />
      <div className='customer'>
        <div className='formtitle'>요청 상세</div>

        <div className='suggestTable'>
          <div className='suggestListHeader'>
            <div className='suggestField title'>제목</div>
            <div className='suggestField date'>작성일</div>
          </div>

          <div className='suggestList'>
            <div className='suggestField title'>{suggest.title}</div>
            <div className='suggestField date'>
              {suggest.indate ? new Date(suggest.indate).toLocaleString() : ''}
            </div>
          </div>

          <div className='suggestListHeader' style={{marginTop:'20px'}}>
            <div className='suggestField title'>내용</div>
          </div>
          <div className='suggest-content'>
            {suggest.content}
          </div>

          <div className='suggestListHeader' style={{marginTop:'20px'}}>
            <div className='suggestField title'>첨부파일</div>
          </div>
          {suggest.fileUrls && suggest.fileUrls.length > 0 && (
            <div className="suggest-files">
              <ul>
                {suggest.fileUrls.map((url, idx) => {
                  const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
                  return (
                    <li key={idx}>
                      {isImage ? (
                        <img src={url} alt={`첨부파일 ${idx + 1}`} className="suggest-img"/>
                      ) : (
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          파일 {idx + 1}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {canDelete && (
            <div className='suggest-actions actions'>
              <button onClick={handleDelete}>삭제</button>
            </div>
          )}
          <div className='actions'>
            <button style={{background:'#ff3c3c'}} onClick={() => navigate('/mypage/suggest')}>뒤로</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuggestDetail;
