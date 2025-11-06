import axios from 'axios';
import React, { useEffect } from 'react'

function ShMain() {

    useEffect(()=> {
        axios.get("/api/sh-page/sh-list")
            .then((result) => {
                console.log(result);
            }).catch((err) => {
                console.err(err);
            });
    }, [])

  return (
    <div className='shMain'>
        
    </div>
  )
}

export default ShMain