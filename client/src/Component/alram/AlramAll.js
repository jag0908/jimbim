import React, { useEffect, useState } from 'react'
import jaxios from '../../util/jwtutil'
import { useNavigate, useParams } from 'react-router-dom'

function AlramAll({formatDateTime}) {
  const {id} = useParams();
  const navigate = useNavigate(); 
  const [msgAlram, setMsgAlram] = useState(null);

  useEffect(()=> {

    jaxios.get(`/api/alram/chatMsg/${id}`)
      .then((res)=> {
        console.log(res);
        setMsgAlram(res.data);
      }).catch(err=>console.error(err));
  }, [])

  return (
    <>

      {
        
      }
      
    </>
  )
}

export default AlramAll