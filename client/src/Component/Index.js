import React, {useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector , useDispatch } from 'react-redux'
import { logoutAction } from '../store/userSlice'
import { Cookies } from 'react-cookie'
import jaxios from '../util/jwtutil'

function Index() {
    const loginUser = useSelector( state=>state.user )
    const dispatch = useDispatch()
    const cookies = new Cookies()
    const navigate = useNavigate()

    useEffect(
        ()=>{
            /*
            jaxios.get('/api/member/jaxiostest', {params:{userid:loginUser.userid}} )
            .then((result)=>{

            }).catch((err)=>{ console.error(err) })
            */
        },[]
    )

    function onLogout() {
        dispatch( logoutAction() )
        cookies.remove('user')
        navigate('/')
    }
    return (
        <article>
            <div>Index</div>
            {
                (loginUser.userid)?(
                    <div className='logininfo'>
                        <div>{loginUser.userid}({loginUser.name})</div>
                        <div onClick={()=>{ onLogout() }}>LOGOUT</div>
                    </div>
                ):(
                    <>
                        <div><Link to='/login'>LOGIN</Link></div>
                        <div><Link to='/join'>JOIN</Link></div>
                    </>
                )
            }
        </article>
    )
}

export default Index