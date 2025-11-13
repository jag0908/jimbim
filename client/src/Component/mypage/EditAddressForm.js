import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import jaxios from '../../util/jwtutil';
import DaumPostcode from "react-daum-postcode";
import Modal from 'react-modal'

function EditAddressForm(props) {
    const loginUser = useSelector( state=>state.user )

    const {
        address_id, setAddress_id,
        address_name, setAddress_name,
        address_zipnum, setAddress_zipnum,
        address_simple, setAddress_simple,
        address_detail, setAddress_detail,
        isOpen, setIsOpen,
        addressList, setAddressList,
        setOnEditForm
    } = props.editAddress

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
    async function onSubmit(){
        if( !address_name ){return alert('이름을 입력하세요')}
        if( !address_zipnum){ return alert('우편번호를 입력하세요')}
        if( !address_detail ){return alert('상세주소를 입력하세요')}
        console.log(loginUser)

        if(address_id==-2){
            await jaxios.post('/api/mypage/insertAddress', {address_name, address_zipnum, address_simple, address_detail, member:loginUser})
            .then((result)=>{ 
                alert('완료되었습니다.');
            } ).catch((err)=>{console.error(err)})
        }else{
            await jaxios.post('/api/mypage/updateAddress', {address_id, address_name, address_zipnum, address_simple, address_detail, member:loginUser})
            .then((result)=>{ 
                alert('완료되었습니다.');
            } ).catch((err)=>{console.error(err)})
        }
        

        await jaxios.get('/api/mypage/getAddressList', {params:{member_id:loginUser.member_id}})
        .then((result)=>{
            console.log(result.data.addressList)
            setAddressList(result.data.addressList)
            setAddress_id(-1)
        })
        .catch((err)=>{console.error(err)})

    }
    return (
        <div>
            <div className='field'>
                <label>주소명</label>
                <input type="text"  value={address_name} onChange={
                    (e)=>{ setAddress_name(e.currentTarget.value )}
                }/>
            </div>
            <div className='field'>
                <label>우편번호</label>
                <input type="text" value={address_zipnum} onChange={
                    (e)=>{ setAddress_zipnum(e.currentTarget.value )}
                } readOnly/>
                <div className='btns'>
                    <button onClick={ ()=>{ setIsOpen( !isOpen ) }}>SEARCH</button>
                </div>
            </div>

            <div>
                <Modal isOpen={isOpen}  ariaHideApp={false}  style={customStyles} >
                    <DaumPostcode onComplete={completeHandler} /><br />
                    <div className='btns'>
                        <button onClick={()=>{ setIsOpen(false) }}>CLOSE</button>
                    </div>
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
            <div className='btns'>
                <button onClick={()=>{onSubmit()}}>{(address_id>=1)?(<>수정</>):(<>추가</>)}</button>
                <button onClick={()=>{setOnEditForm(address_id)}}>취소</button>
            </div>
        </div>
    )
}

export default EditAddressForm