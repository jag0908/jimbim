import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link  } from 'react-router-dom'
import jaxios from '../../util/jwtutil';
import EditAddressForm from './EditAddressForm';

function AddressList() {
    const loginUser = useSelector( state=>state.user )
    const navigate = useNavigate();
    
    const [address_id, setAddress_id] = useState(-1)
    // -1 : 기본값, -2 : 추가폼, 1이상 : 해당아이디의 수정폼

    const [address_name, setAddress_name]=useState('')
    const [address_zipnum, setAddress_zipnum]=useState('')
    const [address_simple, setAddress_simple]=useState('')
    const [address_detail, setAddress_detail]=useState('')

    const [isOpen, setIsOpen]=useState(false)

    const [addressList, setAddressList]=useState([])

    //const [member, setMember] = useState({});

    useEffect(
        ()=>{
            if(!loginUser.userid){
                alert("로그인이 필요한 서비스입니다")
                navigate("/")
            }else{
                // jaxios.get(`/api/member/getMember`, {params:{userid:loginUser.userid}} )
                // .then((result)=>{
                //     setMember(result.data.member)
                // }).catch((err)=>{ console.error(err);  })

                jaxios.get('/api/mypage/getAddressList', {params:{member_id:loginUser.member_id}})
                .then((result)=>{
                    setAddressList(result.data.addressList)
                })
                .catch((err)=>{console.error(err)})
            }
        },[loginUser, navigate]
    )

    function setOnEditForm(address){
        if(address===-2){
            setAddress_id((address_id===address)?(-1):(-2))
            setAddress_name('')
            setAddress_zipnum('')
            setAddress_simple('')
            setAddress_detail('')
        }else{
            setAddress_id((address_id===address.address_id)?(-1):(address.address_id))
            setAddress_name(address.address_name)
            setAddress_zipnum(address.address_zipnum)
            setAddress_simple(address.address_simple)
            setAddress_detail(address.address_detail)
        }
    }

    const editAddress = {
        address_id, setAddress_id,
        address_name, setAddress_name,
        address_zipnum, setAddress_zipnum,
        address_simple, setAddress_simple,
        address_detail, setAddress_detail,
        isOpen, setIsOpen,
        addressList, setAddressList,
        setOnEditForm
    }

    async function deleteAddress(address_id){
        if(window.confirm('주소를 삭제하시겠습니까?')){
            await jaxios.delete('/api/mypage/deleteAddress', {params:{address_id}})
            .then((result)=>{
                alert('삭제되었습니다')
            })
            .catch((err)=>{console.error(err)})

            await jaxios.get('/api/mypage/getAddressList', {params:{member_id:loginUser.member_id}})
            .then((result)=>{
                setAddressList(result.data.addressList)
            })
            .catch((err)=>{console.error(err)})
        }
    }
    return (
        <article>
            <div>마이페이지</div>
            <div>
                <Link to={"/mypage"}>로그인 정보</Link>
                <Link to={"/mypage/addresslist"}>주소록</Link>
            </div>
            {
                (addressList)?
                (
                    addressList.map((address, idx)=>{
                        return (
                            <div className='row' key={idx} style={{border:'1px solid red'}}>
                                {
                                    (address_id===address.address_id)?
                                    (<>
                                        <EditAddressForm editAddress={editAddress} />
                                    </>):(
                                        <>
                                            <button onClick={()=>{setOnEditForm(address)}}>수정</button>
                                            <button onClick={()=>{deleteAddress(address.address_id)}}>삭제</button>
                                            <div className='col'>주소명 {address.address_name}</div>
                                            <div className='col'>우편번호 {address.address_zipnum}</div>
                                            <div className='col'>도로명주소 {address.address_simple}</div>
                                            <div className='col'>상세주소 {address.address_detail}</div>
                                        </>
                                    )
                                }
                            </div>
                        )
                    })
                ):
                (<div>현재 주소가 없습니다</div>)
            }
            <button onClick={()=>{setOnEditForm(-2)}}>주소 추가하기</button>
            {(address_id===-2)?
            (<>
                <EditAddressForm editAddress={editAddress} />
            </>):(null)}
        </article>
        
    )
}

export default AddressList