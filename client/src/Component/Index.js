import React, {useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector , useDispatch } from 'react-redux'
import { Cookies } from 'react-cookie'
import '../style/index.css'

function Index() {
    const loginUser = useSelector( state=>state.user )
    const dispatch = useDispatch()
    const cookies = new Cookies()
    const navigate = useNavigate()

    
    return (
        <article>
            <div className='menu'>
                <Link to={"/sh-page"}>중고마을</Link>
                <Link to={"/sh-shop"}>SHOP</Link>
                <Link to={"/community"}>커뮤니티</Link>
                <Link to={"/style"}>STYLE</Link>
            </div>
           
        </article>
    )
}

export default Index