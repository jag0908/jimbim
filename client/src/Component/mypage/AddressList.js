import React, {useState} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import DaumPostcode from "react-daum-postcode";
import Modal from 'react-modal'
import jaxios from '../../util/jwtutil';

function AddressList() {
    const loginUser = useSelector( state=>state.user )
    const navigate = useNavigate();
    
    const [addressStyle, setAddressStyle] = useState({display:'none'})

    const [address_name, setAddress_name]=useState('')
    const [address_zipnum, setAddress_zipnum]=useState('')
    const [address_simple, setAddress_simple]=useState('')
    const [address_detail, setAddress_detail]=useState('')

    const [isOpen, setIsOpen]=useState(false)

    // 모달창을 위한 style
    const customStyles = {
        overlay: { backgroundColor: "rgba( 0 , 0 , 0 , 0.5)", },
        content: {
            left: "0",
            margin: "auto",
            width: "500px",
            height: "600px",
            padding: "0",
            overflow: "hidden",
        },
    };
    const completeHandler=(data)=>{
        console.log(data)
        setAddress_zipnum(data.zonecode)
        let simple = data.address;
        if( data.buildingName !== ''){
            simple = data.address + ' (' + data.buildingName +')'
        }else if( data.bname !== ''){
            simple = data.address + ' (' + data.bname +')'
        }
        setAddress_simple(simple)
        setIsOpen(false);
    }
    function onSubmit(){
        if( !address_name ){return alert('이름을 입력하세요')}
        if( !address_zipnum){ return alert('우편번호를 입력하세요')}
        if( !address_detail ){return alert('상세주소를 입력하세요')}
        console.log(loginUser)

        jaxios.post('/api/mypage/insertAddress', {address_name, address_zipnum, address_simple, address_detail, member:loginUser})
        .then((result)=>{ 
            alert('완료되었습니다.');
            navigate('/login')
        } ).catch((err)=>{console.error(err)})

    }
    return (
        <article>
            <div>
                {
                    (loginUser.profileImg)?
                    (<img src={loginUser.profileImg}/>):
                    (<div>기본 프로필 사진</div>)
                }
            </div>
            <div>
                <div>이름</div>
                <div>{loginUser.name}</div>
            </div>
            <div><button onClick={()=>{navigate('/')}}>메인이동</button></div>
            <div><button onClick={()=>{navigate('/mypage')}}>마이페이지</button></div>
            <div>현재 주소가 없습니다</div>
            <button onClick={()=>{setAddressStyle({display:'block'})}}>주소 추가하기</button>
            <div style={addressStyle}>
                <div>주소록</div>
                <div className='field'>
                    <label>저장할 이름</label>
                    <input type="text"  value={address_name} onChange={
                        (e)=>{ setAddress_name(e.currentTarget.value )}
                    }/>
                </div>
                <div className='field'>
                    <label>우편번호</label>
                    <input type="text" value={address_zipnum} onChange={
                        (e)=>{ setAddress_zipnum(e.currentTarget.value )}
                    } readOnly/>
                    <button onClick={ ()=>{ setIsOpen( !isOpen ) }}>SEARCH</button>
                </div>

                <div>
                    <Modal isOpen={isOpen}  ariaHideApp={false}  style={customStyles} >
                        <DaumPostcode onComplete={completeHandler} /><br />
                        <button onClick={()=>{ setIsOpen(false) }}>CLOSE</button>
                    </Modal>
                </div>

                <div className='field'>
                    <label>주소</label>
                    <input type="text" value={address_simple} onChange={
                        (e)=>{ setAddress_simple(e.currentTarget.value )}
                    } readOnly/>
                </div>

                <div className='field'>
                    <label>상세주소</label>
                    <input type="text"  value={address_detail} onChange={
                        (e)=>{ setAddress_detail(e.currentTarget.value )}
                    }/>
                </div>
                <button onClick={()=>{onSubmit()}}>추가</button>
                <button onClick={()=>{setAddressStyle({display:'none'})}}>취소</button>
            </div>
        </article>
        
    )
}

export default AddressList