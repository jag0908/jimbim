import axios from 'axios';
import React, { use, useEffect, useState } from 'react'
import jaxios from '../../util/jwtutil';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../../style/sh_common.css'

function ShWrite() {
    const navigate = useNavigate();

    const [deliveryModal, setDeliveryModal] = useState(false);
    const [categoryArr, setCategoryArr] = useState([]);
    const [fileArr, setFileArr] = useState([]);
    const [fileLength, setFileLength] = useState(0);
    
    const [previewUrls, setPreviewUrls] = useState([]); // 이미지 미리보기 URL 배열

    useEffect(()=> {
        jaxios.get("/api/sh-page/sh-category")
            .then((result)=> {
                // console.log(result)
                setCategoryArr([...result.data.shCategory]);
            }).catch(err=>console.error(err));
    }, []);

    function deliveryFnc() {
        setDeliveryModal(!deliveryModal);
    }

    function fileupload(e) {
        if(!e.target) {return}

        let newfiles = Array.from(e.target.files);

        // 기존 파일과 합치기
        const allFiles = [...fileArr, ...newfiles];

        if (allFiles.length > 10) {
            alert("최대 10개까지 선택 가능합니다.");
            e.target.value = null; // 선택 초기화
            return;
        };

        setFileLength(allFiles.length);
        setFileArr(allFiles);

        // 브라우저에서 바로 미리보기 URL 생성
        const urls = allFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
        
    };

    // 파일 삭제
    const handleRemoveFile = (index) => {
        const newFiles = fileArr.filter((_, i) => i !== index);
        setFileArr(newFiles);

        // 미리보기도 같이 갱신
        const newUrls = previewUrls.filter((_, i) => i !== index);
        setPreviewUrls(newUrls);
    };

    // 파일 업로드시 formData 추가
    function createFormData() {
        const formData = new FormData();
        fileArr.forEach((file, i)=> {
            formData.append(`file_${i}`, file);
        })
        const formDataObj = Object.fromEntries(formData.entries());
        console.log(formDataObj);
    }

    useEffect(()=> {
     
        console.log(fileArr)
    
    }, [fileArr]);


  return (
    <div className='shWrite'>
        <div className='writeWrap'>
            <h2 className='mainTitle'>내 물건 팔기</h2>
            <div className='inputWrap file'>
                <label htmlFor="dataFile">+ <span>{fileLength}/10</span></label>
                {/* 파일업로드 인풋 */}
                <input id='dataFile' type='file' className='inpFile' onChange={(e)=> {fileupload(e);}} multiple />
                {/* 미리보기 이미지 */}
                <div className="previewContainer">
                    {previewUrls.map((url, i) => (
                        <div className='imgBox' key={i} >
                            <img src={url} alt={`preview-${i}`} />
                            <div className={`removeBtn removeBtn_${i}`}onClick={()=> {
                                handleRemoveFile(i);
                            }}>X</div>
                        </div>    
                    ))}
                </div>
            </div>
            <div className='selectWrap'>
                <h4 className='tit'>카테고리</h4>
                <select id='dataCategory'>
                    {
                        categoryArr.map((category, i)=> {
                            return(
                                <option key={i} value={category.category_id}>
                                    {category.category_name}
                                </option>
                            )
                        })
                    }
                </select>
            </div>
            <div className='inputWrap'>
                <h4 className='tit'>제목</h4>
                <input id='dataTitle' type='text' placeholder='아이폰17 512G 팝니다.' />
            </div>
            <div className='inputWrap'>
                <h4 className='tit'>자세한 설명</h4>
                <textarea id='dataTTA' type='text' placeholder='아이폰17 512G 팝니다.'>

                </textarea>
            </div>
            <div className='inputWrap'>
                <h4 className='tit'>가격</h4>
                <input id='dataPrice' type='text' className='inpPrice' placeholder='3,000' />
            </div>
            <div className='inputWrap radio'>
                <h4 className='tit'>직거래 유무</h4>
                <div className='radioBox'>
                    <label htmlFor="dataDirectY">가능</label>
                    <input id='dataDirectY' name='directYN' type='radio' />
                </div>

                <div className='radioBox'>
                    <label htmlFor="dataDirectN">불가능</label>
                    <input id='dataDirectN' name='directYN' type='radio' defaultChecked  />
                </div>
            </div>
            <div className='inputWrap radio'>
                <h4 className='tit'>택배거래 유무</h4>

                <div className='radioBox'>
                    <label htmlFor="dataDeliveryY">가능</label>
                    <input id='dataDeliveryY' name='deliveryYN' type='radio' onChange={()=> {deliveryFnc(this);}} />
                </div>

                <div className='radioBox'>
                    <label htmlFor="dataDeliveryN">불가능</label>
                    <input id='dataDeliveryN' name='deliveryYN' type='radio' onChange={()=> {deliveryFnc(this);}} defaultChecked  />
                </div>
            </div>
            <div className={`inputWrap deliveryModal ${deliveryModal? 'display-block':'display-none'}`}>
                <h4 className='tit'>택배비</h4>
                <input id='dataDlvPrice' type='text' className='inpPrice' placeholder='3,000' />
            </div>
        </div>
        <div className='btnWrap'>
            <button className='navBtn pointBtn'>작성 완료</button>
            <button className='navBtn' onClick={()=> {navigate(-1);}}>취소</button>
        </div>
    </div>
  )
}

export default ShWrite