import axios from 'axios';
import React, { useEffect, useState } from 'react'
import jaxios from '../../util/jwtutil';
import { Link, useNavigate, useParams } from 'react-router-dom';

import '../../style/sh_common.css'


function ShMain() {
    const baseURL = process.env.REACT_APP_BASE_URL;

    const { id } = useParams();
    const [shPostArr, setShPostArr] = useState([]);
    const [categoryArr, setCategoryArr] = useState([]);
    const navigate = useNavigate();

    useEffect(()=> {
       
      startApi();
        
    }, []);

    async function startApi() {
      await axios.get("/api/sh-page/sh-list")
        .then((result) => {
            console.log([...result.data.postList]);
            setShPostArr([...result.data.postList]);
        }).catch((err) => {
            console.error(err);
        });

      await jaxios.get("/api/sh-page/sh-category")
        .then((result) => {
            setCategoryArr([...result.data.categoryList]);
        }).catch((err) => {
            console.error(err);
        });

    }

    function postWrite() {
      navigate("./sh-write");
    };

    

    function formatDateTime(indate) {
      const date = new Date(indate);
      const now = new Date();

      // 시간 제외하고 날짜만 비교하기 위해 00:00 기준으로 변환
      const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const diffMs = now - date;
      const diffMinutes = Math.floor(diffMs / 1000 / 60);
      const diffHours = Math.floor(diffMinutes / 60);

      const diffDays = Math.floor((startOfNow - startOfDate) / (1000 * 60 * 60 * 24));

      // 오늘일 경우
      if (diffDays === 0) {
        if (diffHours > 0) return `${diffHours}시간 전`;
        if (diffMinutes > 0) return `${diffMinutes}분 전`;
        return `방금 전`;
      }

      // 1달(30일) 미만
      if (diffDays < 30) {
        return `${diffDays}일 전`;
      }

      const diffMonths = Math.floor(diffDays / 30);
      if (diffMonths < 12) {
        return `${diffMonths}달 전`;
      }

      // 1년 이상은 날짜 출력
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }


    function formatPrice(num) {
      return num.toLocaleString('ko-KR');
    }


  return (
    <div className='shMain'>
 

        <div className='menuWrap'>
          {
            categoryArr.map((category, i)=> {
              return (
                <div className='list' key={i}>
                      <Link  to={`/sh-page/${category.category_id}`}>
                        <img src={`${baseURL}/sh_img/${i}.png`} alt={category.category_name} />
                        <span className='tit'>{category.category_name}</span>
                      </Link>
                </div>
              )
            })
      
          }
                
        </div>

        <div className='shPostWrap'>
            
          {
            shPostArr.map((ShPost, i)=> {
              return (
                <div className='list' key={i}>
                  <Link to={`/sh-page/sh-view/${ShPost.postId}`}>
                      <div className='imgBox'>
                        <img key={i} src={ShPost.firstFilePath && ShPost.firstFilePath} />
                      </div>
            
                      <h3 className='data title'>{ShPost.title}</h3>
                      <h3 className='data price'>{formatPrice(ShPost.price)}원</h3>
                      <h3 className='data date'>{formatDateTime(ShPost.indate)}</h3>
                  </Link>
                </div>
              )
            })
          }
          
        </div>

        <div className='btnWrap'>
          <button className='btn btnWrite' onClick={()=> {postWrite();}}>글 작성</button>
        </div>
    </div>
  )
}

export default ShMain