import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link  } from 'react-router-dom'
import jaxios from '../../util/jwtutil';
import EditAddressForm from './EditAddressForm';
import SideMenu from './SideMenu';

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

    const editStyle = {
        border: '#888888 3px double',
        marginTop: '20px',
        marginBottom: '20px'
    }

    useEffect(
        ()=>{
            if(!loginUser.userid){
                alert("로그인이 필요한 서비스입니다")
                navigate("/")
            }else{
                console.log(loginUser)
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
        },[]
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
        <article style={{height:'100%'}}>
            <div className='mypagebody'>
                <SideMenu/>
                <div className='mypage'>
                    <div className='formtitle'>주소록</div>
                    {(address_id===-2)?
                    (<>
                        <div className='addressList' >
                            <EditAddressForm editAddress={editAddress} />
                        </div>
                    </>):(
                        <div className='formBtns'>
                            <button onClick={()=>{setOnEditForm(-2)}}>주소 추가하기</button>
                        </div>
                    )}
                    {
                        (addressList.length!=0)?
                        (
                            addressList.map((address, idx)=>{
                                return (
                                    <div key={idx} className='addressList' style={(address_id===address.address_id)?editStyle:{}}>
                                        {
                                            (address_id===address.address_id)?
                                            (<>
                                                <EditAddressForm editAddress={editAddress} />
                                            </>):(
                                                <>
                                                    <div className='field'>
                                                        <label>주소명</label>
                                                        <div className='addressListText'>{address.address_name}</div>
                                                    </div>
                                                    <div className='field'>
                                                        <label>주소</label>
                                                        <div className='addressListText'>({address.address_zipnum}) {address.address_simple}</div>
                                                        <div className='addressListText'>{address.address_detail}</div>
                                                    </div>
                                                    <div className='formBtns'>
                                                        <button onClick={()=>{setOnEditForm(address)}}>수정</button>
                                                        <button onClick={()=>{deleteAddress(address.address_id)}}>삭제</button>
                                                    </div>
                                                </>
                                            )
                                        }
                                    </div>
                                )
                            })
                        ):
                        (<div>현재 주소가 없습니다</div>)
                    }
                </div>
            </div>
        </article>
        
    )
}

export default AddressList