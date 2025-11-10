import React, { useEffect, useState } from 'react'
import jaxios from '../../util/jwtutil'
import { useNavigate, useParams } from 'react-router-dom'

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';



const settings = {
    dot:false,
    arrows:false,
    infinite:false,
    speed:500,
    slidesToShow:1,
    slidesToScroll:1
}

function ShView() {
    const {id} = useParams();
    const navigate = useNavigate();

    const [postDetail, setPostDetail] = useState({});
    const [category, setCategory] = useState([]);




    useEffect(()=> {
        jaxios.get(`/api/sh-page/sh-view/${id}`)
            .then((res)=> {
                console.log(res);
                setPostDetail(res.data.shPost);
                setCategory(res.data.category)
            }).catch(err=>console.error(err));


    }, [])

    function formatPrice(num) {
      return num.toLocaleString('ko-KR');
    }

  return (
    <div className='shView'>
        <div className='viewWrap'>
            <div className='inputWrap'>
                <h4 className='tit'>[{postDetail.post && category?category[postDetail.post.category].category_name:"데이터 불러오는중..."}]</h4>
            </div>
            <h2 className='mainTitle'>{postDetail.post?postDetail.post.title:"데이터 불러오는중..."}</h2>
             <Slider className='imgGroup' {...settings}>
                {
                    (postDetail.files || []) ? 
                    (postDetail.files || []).map((file, i)=> {
                        return(
                            <div className='imgBox' key={i}>
                                <img src={file.path} />
                            </div>
                        )
                    }):
                    "텅"
                    
                }
            </Slider>

            
            <div className='inputWrap'>
                <h4 className='tit'>자세한 설명</h4>
                <textarea id='dataTTA' readOnly disabled value={postDetail.post?postDetail.post.content:"데이터 불러오는중..."}></textarea>
            </div>
            <div className='inputWrap'>
                <h4 className='tit'>가격</h4>
                <span className='dataBox'>{postDetail.post?formatPrice(postDetail.post.price):"데이터 불러오는중..."}원</span>
            </div>
            <div className='inputWrap radio'>
                <h4 className='tit'>직거래 유무</h4>
                <span className='dataBox srt'>{postDetail.post?(postDetail.post.direct_yn === "Y"?"가능":"불가능"):"데이터 불러오는중..."}</span>
            </div>
            <div className='inputWrap radio'>
                <h4 className='tit'>택배거래 유무</h4>

                <span className='dataBox srt'>{postDetail.post?(postDetail.post.delivery_yn === "Y"?"가능":"불가능"):"데이터 불러오는중..."}</span>
            </div>
            <div className={`inputWrap ${postDetail.post?(postDetail.post.delivery_yn === "Y"? 'display-block':'display-none'):"데이터 불러오는중..."}`}>
                <h4 className='tit'>택배비</h4>
                <span className='dataBox srt'>{postDetail.post?(formatPrice(postDetail.post.delivery_price)):"데이터 불러오는중..."}원</span>
            </div>
        </div>
        <div className='btnWrap'>
            <button className='navBtn pointBtn' onClick={()=> {navigate("/update");}}>수정하기</button>
            <button className='navBtn' onClick={()=> {navigate(-1);}}>취소</button>
        </div>
    </div>
  )
}

export default ShView