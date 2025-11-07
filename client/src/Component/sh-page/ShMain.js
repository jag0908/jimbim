import axios from 'axios';
import React, { useEffect, useState } from 'react'
import jaxios from '../../util/jwtutil';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import '../../style/sh_common.css'

const settings = {
    dot:false,
    arrows:false,
    infinite:false,
    speed:500,
    slidesToShow:1,
    slidesToScroll:1
}

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
            <div className='list'>
              {
                shPostArr.map((ShPost, i)=> {
                  return (
                    <Link key={i} to={`/sh-page/${ShPost.post_id}`}>
                        <Slider {...settings}>

                        </Slider>
                        <h3 className='title'>{ShPost.title}</h3>
                        <h3 className='price'>{ShPost.price}원</h3>
                    </Link>
                  )
                })
              }
            </div>
        </div>

        <div className='btnWrap'>
          <button className='btn btnWrite' onClick={()=> {postWrite();}}>글 작성</button>
        </div>
    </div>
  )
}

export default ShMain