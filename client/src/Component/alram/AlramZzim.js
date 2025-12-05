import React, { useEffect } from 'react'
import jaxios from '../../util/jwtutil';

function AlramZzim() {

  useEffect(()=> {
    jaxios.get("/api/alram/getMyPost")
      .then((res)=> {
        console.log(res);
      }).catch(err=>console.error(err));
  }, [])

  return (
    <div>AlramZzim</div>
  )
}

export default AlramZzim