import React, { useEffect, useState } from 'react'
import jaxios from '../../util/jwtutil'
import { useNavigate, useParams } from 'react-router-dom'

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useSelector } from 'react-redux';



const settings = {
    dots:true,
    arrows:false,
    infinite:true,
    speed:500,
    slidesToShow:1,
    slidesToScroll:1
}

function ShView() {
    const baseURL = process.env.REACT_APP_BASE_URL;

    const loginUser = useSelector(state=>state.user);

    const {id} = useParams();
    const navigate = useNavigate();

    const [postDetail, setPostDetail] = useState(null);
    const [category, setCategory] = useState(null);



    async function viewed() {


        // 1. 조회수 증가
        try {
            await jaxios.post(`/api/sh-page/sh-view-count`, { postId: id, memberId: loginUser.member_id });
            console.log("조회수 증가 완료");
        } catch (err) {
            console.error(err);
        }
        

        // 2. 데이터 가져오기 (조회수 증가 후)
        try {
            const res = await jaxios.get(`/api/sh-page/sh-view/${id}`);
            console.log(res.data)
            setPostDetail(res.data.post);
            setCategory(res.data.category.category_name);
        } catch (err) {
            console.error(err);
        }
    }


    useEffect(()=> {
        viewed();
    }, [])

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
    <div className='shView'>
        <div className='viewWrap'>
            <div className='top'>
                <div className='catetory'>[{category && category}]</div>
                <h4 className='tit'>{postDetail?postDetail.title:<Lodding />}</h4>
            </div>

            <div className='rayoutWrap'>
                <div className='leftBox'>
                    <Slider className='imgGroup' {...settings}>
                        {
                            postDetail && postDetail.files.map((file, i)=> {
                                return(
                                <div className='imgBox'>
                                    <img src={file.path} />
                                </div>  
                                )
                            })
                        }
                    </Slider>
                    <div className='userWrap'>
                        <div className='userProfile'>
                            <div className='profileImg'>
                            {
                                (postDetail && postDetail.member.profileImg)
                                ? 
                                (<img src={postDetail.member.profileImg} />)
                                : 
                                (<img src={`${baseURL}/sh_img/1.png`} />)
                            }
                            </div>

                            <div className='profileInfo'>
                            <span className='nickname'>
                                {
                                    postDetail?
                                    postDetail.member.name:
                                    <Lodding/>
                                }
                            </span>
                            <span className='etc'>
                                {
                                    postDetail?
                                    postDetail.member.profileMsg:
                                    <Lodding/>
                                }
                            </span>
                            </div>
                        </div>

                        <div className='userState'>
                            매너단계: 
                            <span>
                                {
                                    postDetail?
                                    postDetail.member.blacklist:
                                    <Lodding/>
                                }
                            </span>
                        </div>
                    </div>

                </div>
                <div className='rightBox'>
                    <div className='dataBoxWrap'>
                        <h2 className='mainTitle'>
                            {
                                postDetail?
                                postDetail.title:
                                <Lodding/>
                            }
                        </h2>
                    </div>
                    <div className='dataBoxWrap dobule'>
                        <div className='catetory'></div>
                        <div className='date'>{}</div>
                    </div>
                    <div className='dataBoxWrap'>
                        <span className='dataBox price'>
                            {
                                postDetail?
                                 formatPrice(postDetail.price):
                                <Lodding/>
                            }
                            원
                        </span>
                    </div>
                    <div className='dataBoxWrap'>
                        <textarea id='dataTTA' className='tta' readOnly disabled 
                        value={
                                postDetail?
                                postDetail.content:
                                <Lodding/>
                            }
                        ></textarea>
                    </div>

                    <div className='dataBoxWrap'>
                        <div className='util'>
                            <span className='tit'>채팅</span>
                            <span className='dataBox srt'>0</span>
                        </div>
                        <div className='util'>
                            <span className='tit'>관심</span>
                            <span className='dataBox srt'>0</span>
                        </div>
                        <div className='util'>
                            <span className='tit'>조회수</span>
                            <span className='dataBox srt'>
                                {
                                    postDetail?
                                    postDetail.viewCount:
                                    <Lodding/>
                                }
                            </span>
                        </div>

                    </div>


                    <div className='line'></div>
                    
                    <div className='dataBoxWrap'>
                        <h4 className='tit'>직거래</h4>
                        <span className='dataBox srt'>
                            {
                                postDetail?
                                (
                                    postDetail.directYN === "N" ? "불가능" :
                                    "가능"
                                ):
                                <Lodding/>
                            }
                        </span>

                        <div></div><div></div><div></div>

                        <h4 className='tit'>택배거래</h4>
                        <span className='dataBox srt'>
                            {
                                postDetail?
                                (
                                    postDetail.deliveryYN === "N" ? "불가능" :
                                    "가능"
                                ):
                                <Lodding/>
                            }
                        </span>
                    </div>

                    <div className={
                            `dataBoxWrap ${postDetail && postDetail.deliveryYN=="N"?
                                "display-none":
                                "display-block"
                            }`
                        }>
                        <h4 className='tit'>택배비</h4>
                        <span className='dataBox price srt'>
                            {
                                postDetail?
                                postDetail.delivery_price:
                                <Lodding/>
                            }
                            원</span>
                    </div>
                </div>
            </div>
            
             

            
            
        </div>
        <div className='btnWrap'>
            {
                postDetail && postDetail.member.memberId == loginUser.member_id ? 
                (
                    <button className='navBtn pointBtn' onClick={() => navigate(`/sh-page/sh-update/${id}`)}>
                    수정하기
                    </button>
                ):
                null
            }
            
            <button className='navBtn' onClick={()=> {navigate(-1);}}>취소</button>
        </div>
    </div>
  )
}

function Lodding() {
    return <span style={{fontSize:"14px"}}>불러오는중...</span>
}

export default ShView