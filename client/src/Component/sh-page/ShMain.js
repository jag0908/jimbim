import axios from 'axios';
import React, { useEffect, useState } from 'react'
import jaxios from '../../util/jwtutil';
import { Link, useParams } from 'react-router-dom';
import Slider from 'react-slick';

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

    useEffect(()=> {
       
      startApi();
        
    }, []);

    async function startApi() {
      await jaxios.get("/api/sh-page/sh-list")
        .then((result) => {
            console.log(result);
            setShPostArr(result.data.shList);
        }).catch((err) => {
            console.error(err);
        });

      await jaxios.get("/api/sh-page/sh-category")
        .then((result) => {
            setCategoryArr(result.data.shCategory);
        }).catch((err) => {
            console.error(err);
        });

    }

    

  return (
    <div className='shMain'>
 

        <div className='menuWrap'>
            <div className='list'>
                {
                  categoryArr.map((category, i)=> {
                    return (
                      <Link key={i} to={`/sh-page/${category.category_id}`}>
                        <img src={`${baseURL}/sh_img/${i}.png`} alt={category.category_name} />
                      </Link>
                    )
                  })
                }
                
            </div>
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
                        <h3 className='title'>{ShPost.title}</h3>
                    </Link>
                  )
                })
              }
            </div>
        </div>
    </div>
  )
}

export default ShMain