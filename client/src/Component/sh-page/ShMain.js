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
      await jaxios.get("/api/sh-page/sh-list")
        .then((result) => {
            console.log(result);
            setShPostArr([...result.data.shList]);
        }).catch((err) => {
            console.error(err);
        });

      await jaxios.get("/api/sh-page/sh-category")
        .then((result) => {
            setCategoryArr([...result.data.shCategory]);
        }).catch((err) => {
            console.error(err);
        });

    }

    function postWrite() {
      navigate("./sh-write");
    };

    

    function formatDateTime(indate) {
      const date = new Date(indate); // Axios로 받은 문자열을 Date 객체로 변환
      const now = new Date();

      const isToday = date.toDateString() === now.toDateString(); // 오늘인지 확인

      if (isToday) {
          const diffMs = now - date; // 밀리초 단위 차이
          const diffMinutes = Math.floor(diffMs / 1000 / 60);
          const diffHours = Math.floor(diffMinutes / 60);

          if (diffHours > 0) {
              return `${diffHours}시간 전`;
          } else if (diffMinutes > 0) {
              return `${diffMinutes}분 전`;
          } else {
              return `방금 전`;
          }
      } else {
          // 오늘이 아닌 경우: YYYY-MM-DD
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
      }     
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
                  <Link to={`/sh-page/sh-view/${ShPost.post.postId}`}>
                      <div className='imgBox'>
                        <img key={i} src={ShPost.files[0].path} />
                      </div>
            
                      <h3 className='data title'>{ShPost.post.title}</h3>
                      <h3 className='data price'>{formatPrice(ShPost.post.price)}원</h3>
                      <h3 className='data date'>{formatDateTime(ShPost.post.indate)}</h3>
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