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
                        {loginUser.userid}({loginUser.name})&nbsp;&nbsp;&nbsp;
                        <span onClick={()=>{ onLogout() }}>LOGOUT</span>
                    </div>
                ):(
                    <>
                        <Link to='/login'>LOGIN</Link>
                        <Link to='/join'>JOIN</Link>
                    </>
                )
            }
        </article>
    )
}

export default Index