import axios from 'axios'
import jaxios from '../../util/jwtutil'
import React, { useEffect } from 'react'

function AlramChat() {

  useEffect(()=> {
    jaxios.get("/api/sh-page/getMyPost")
      .then((res)=> {
        console.log(res);
      }).catch(err=>console.error(err));
  }, [])

  return (
    <div>AlramChat</div>
  )
}

export default AlramChat