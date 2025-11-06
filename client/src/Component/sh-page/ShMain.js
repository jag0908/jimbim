import axios from 'axios';
import React, { useEffect } from 'react'
import jaxios from '../../util/jwtutil';

function ShMain() {

    useEffect(()=> {
        jaxios.get("/api/sh-page/sh-list")
            .then((result) => {
                console.log(result);
            }).catch((err) => {
                console.error(err);
            });
    }, [])

  return (
    <div className='shMain'>
        sadsadasd
    </div>
  )
}

export default ShMain