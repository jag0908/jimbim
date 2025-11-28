import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link  } from 'react-router-dom'
import jaxios from '../../util/jwtutil';
import EditAddressForm from './EditAddressForm';
import SideMenu from './SideMenu';

function AddressList() {
    const loginUser = useSelector( state=>state.user )
    const navigate = useNavigate();
    
    const [addressId, setAddressId] = useState(-1)
    // -1 : 기본값, -2 : 추가폼, 1이상 : 해당아이디의 수정폼

    const [address_name, setAddress_name]=useState('')
    const [address_zipnum, setAddress_zipnum]=useState('')
    const [address_simple, setAddress_simple]=useState('')
    const [address_detail, setAddress_detail]=useState('')

    const [isOpen, setIsOpen]=useState(false)

    const [addressList, setAddressList]=useState([])

    const [paging, setPaging]=useState({});
    const [beginEnd, setBeginEnd]=useState([])

    const [member, setMember] = useState({});

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
                jaxios.get(`/api/member/getMember`, {params:{userid:loginUser.userid}} )
                .then((result)=>{
                    setMember(result.data.member)
                }).catch((err)=>{ console.error(err);  })

                jaxios.get('/api/mypage/getAddressList', {params:{member_id:loginUser.member_id, page:1}})
                .then((result)=>{
                    console.log(result.data)
                    setAddressList(result.data.addressList)
                    setPaging( result.data.paging )
                    let arr = [];
                    for( let i=result.data.paging.beginPage; i<=result.data.paging.endPage; i++){
                        arr.push(i);
                    }
                    setBeginEnd( [...arr] )
                })
                .catch((err)=>{console.error(err)})
            }
        },[]
    )
    function onPageMove(page){
        jaxios.get(`/api/mypage/getAddressList`, {params:{member_id:member.member_id, page}})
        .then((result)=>{
            setAddressList(result.data.addressList)
            setPaging( result.data.paging )
            const pageArr = [];
            for(let i=result.data.paging.beginPage; i<=result.data.paging.endPage; i++){
                pageArr.push(i);
            }
            setBeginEnd( [...pageArr] );
        }).catch((err)=>{console.error(err)})
    }

    function setOnEditForm(address){
        if(address===-2){
            setAddressId((addressId===address)?(-1):(-2))
            setAddress_name('')
            setAddress_zipnum('')
            setAddress_simple('')
            setAddress_detail('')
        }else{
            setAddressId((addressId===address.addressId)?(-1):(address.addressId))
            setAddress_name(address.address_name)
            setAddress_zipnum(address.address_zipnum)
            setAddress_simple(address.address_simple)
            setAddress_detail(address.address_detail)
        }
    }

    const editAddress = {
        addressId, setAddressId,
        address_name, setAddress_name,
        address_zipnum, setAddress_zipnum,
        address_simple, setAddress_simple,
        address_detail, setAddress_detail,
        isOpen, setIsOpen,
        addressList, setAddressList,
        member, setMember,
        paging, setPaging,
        beginEnd, setBeginEnd,
        setOnEditForm
    }

    async function deleteAddress(addressId){
        if(window.confirm('주소를 삭제하시겠습니까?')){
            console.log(addressId)
            await jaxios.delete('/api/mypage/deleteAddress', {params:{addressId}})
            .then((result)=>{
                alert('삭제되었습니다')
            })
            .catch((err)=>{console.error(err)})

            await jaxios.get('/api/mypage/getAddressList', {params:{member_id:member.member_id, page:paging.page}})
            .then((result)=>{
                setAddressList(result.data.addressList)
                setPaging( result.data.paging )
                let arr = [];
                for( let i=result.data.paging.beginPage; i<=result.data.paging.endPage; i++){
                    arr.push(i);
                }
                setBeginEnd( [...arr] )
            })
            .catch((err)=>{console.error(err)})
        }
    }
    return (
        <div className='mypagebody'>
            <SideMenu/>
            <div className='mypage'>
                <div className='formtitle'>주소록</div>
                {(addressId===-2)?
                (<>
                    <div className='addressList' style={(addressId===-2)?editStyle:{}}>
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
                                <div key={idx} className='addressList' style={(addressId===address.addressId)?editStyle:{}}>
                                    {
                                        (addressId===address.addressId)?
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
                                                    <button onClick={()=>{deleteAddress(address.addressId)}}>삭제</button>
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
                {
                    
                    (addressList.length!=0)?
                    (<div id="paging" style={{textAlign:"center", padding:"10px"}}>
                        {
                            (paging.prev)?(
                                <span style={{cursor:"pointer"}} onClick={ ()=>{ onPageMove( paging.beginPage-1 ) } } > ◀ </span>
                            ):(<span></span>)
                        }
                        {
                            (beginEnd)?(
                                beginEnd.map((page, idx)=>{
                                    return (
                                        <span style={(page==paging.page)?{fontWeight:'bold', cursor:"pointer"}:{cursor:"pointer"}} key={idx} onClick={
                                            ()=>{ onPageMove( page ) }
                                        }>&nbsp;{page}&nbsp;</span>
                                    )
                                })
                            ):(<></>)
                        }
                        {
                            (paging.next)?(
                                <span style={{cursor:"pointer"}} onClick={
                                    ()=>{ onPageMove( paging.endPage+1 ) }
                                }>&nbsp;▶&nbsp;</span>
                            ):(<></>)
                        }
                    </div>):(<></>)
                }
            </div>
        </div>
    )
}

export default AddressList