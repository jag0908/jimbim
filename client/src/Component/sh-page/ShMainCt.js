import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import jaxios from '../../util/jwtutil';
import { Link, useNavigate, useParams } from 'react-router-dom';

import '../../style/sh_common.css'


function ShMain() {
    const baseURL = process.env.REACT_APP_BASE_URL;

    const { id } = useParams();
    const [shPostArr, setShPostArr] = useState([]);
    const [categoryArr, setCategoryArr] = useState([]);
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState();
    const [searchVal, selSearchVal] = useState("");
    const isLoadingRef = useRef(false); // 동기적으로 로딩 상태 추적

    useEffect(()=> {
      console.log("아이디변경")
      setPage(1);
      selSearchVal("");
      startApi();
        
    }, [id]);

    async function startApi() {

      await axios.get(`/api/sh-page/sh-list/ct/${id}/1` , {params:{searchVal: ""}})
        .then((result) => {
            // console.log([...result.data.postList]);
            setShPostArr([...result.data.postList.listArr]);
            setTotalPage(Number(result.data.postList.totalPages));
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

    async function searchPost() {
        setPage(1);  // 페이지 초기화
        await axios.get(`/api/sh-page/sh-list/ct/${id}/${page}`, {params:{searchVal}})
          .then((result) => {
              // console.log([...result.data.postList]);
              setShPostArr([...result.data.postList.listArr]);
              setTotalPage(Number(result.data.postList.totalPages));
          }).catch((err) => {
              console.error(err);
          });
    }



    useEffect(()=>{
        window.addEventListener('scroll', handleScroll );
        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    },[id, page, totalPage])
    
    const handleScroll=()=>{
        // useRef로 동기적으로 로딩 상태 체크 (비동기 상태 업데이트 지연 문제 해결)
        if (isLoadingRef.current) return; // 로딩 중이면 중복 호출 방지
        
        const scrollHeight = document.documentElement.scrollHeight; 
        const scrollTop = document.documentElement.scrollTop;  
        const clientHeight = document.documentElement.clientHeight; 
        
        // 스크롤이 거의 바닥에 도달했을 때 (10px 여유)
        if( scrollTop + clientHeight >= scrollHeight - 700 ) {
            const nextPage = page + 1;
            
            // nextPage를 직접 체크하여 마지막 페이지 초과 방지
            if( nextPage > totalPage || !totalPage ){ return; } // 마지막 페이지 초과면 리턴
            
            onPageMove( nextPage );
        }
    }
    
    function onPageMove(nextPage) {
        // 이미 로딩 중이거나 마지막 페이지를 초과하면 리턴
        if (isLoadingRef.current || nextPage > totalPage) return;
        
        // 동기적으로 로딩 상태 설정 (다른 handleScroll 호출이 즉시 감지 가능)
        isLoadingRef.current = true;
        
        axios.get(`/api/sh-page/sh-list/ct/${id}/${nextPage}` , {params:{searchVal}})
            .then((result) => {
                setShPostArr(prev => [...prev, ...result.data.postList.listArr]);
                setPage(nextPage); // 페이지 상태 업데이트
            }).catch((err) => {
                console.error(err);
            }).finally(() => {
                // 로딩 완료 시 ref와 state 모두 업데이트
                isLoadingRef.current = false;
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

        <div className="search-bar"><input placeholder="중고물품을 검색해보세요" aria-label="메인 검색" type="text" value={searchVal} onChange={(e)=> {selSearchVal(e.currentTarget.value)}}/>
          <button type="button" onClick={()=> {searchPost();}}>검색</button>
      </div>
 

        <div className='menuWrap'>
           <div className='list'>
                <Link to={`/sh-page`}>
                  <img src={`${baseURL}/sh_img/1.png`} alt={"전체"} />
                  <span className='tit'>전체</span>
                </Link>
          </div>
          {
            categoryArr.map((category, i)=> {
              return (
                <div className='list' key={category.category_id || i}>
                      <Link  to={`/sh-page/ct/${category.category_id}`}>
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
                <div className={"list" + ` state${ShPost.sellEx}` } key={i}>
                  <Link to={`/sh-page/sh-view/${ShPost.postId}`}>
                      <div className='imgBox'>
                        <img src={ShPost.firstFilePath && ShPost.firstFilePath} alt={ShPost.title} />
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