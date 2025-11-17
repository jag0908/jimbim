import axios from 'axios';
import React, { useEffect, useState } from 'react'
import jaxios from '../../util/jwtutil';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ShWrite() {
    const loginUser = useSelector(state=>state.user);
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState('0');
    const [content, setContent] = useState('');
    const [price, setPrice] = useState('');
    const [directYN, setDirectYN] = useState('N');
    const [deliveryYN, setDeliveryYN] = useState('N');
    const [deliveryPrice, setDeliveryPrice] = useState('');

    const [deliveryModal, setDeliveryModal] = useState(false);
    const [categoryArr, setCategoryArr] = useState([]);
    const [fileArr, setFileArr] = useState([]);
    const [fileLength, setFileLength] = useState(0);
    
    const [previewUrls, setPreviewUrls] = useState([]); // 이미지 미리보기 URL 배열

    useEffect(()=> {
    
        axios.get("/api/sh-page/sh-category")
            .then((result)=> {

                setCategoryArr([...result.data.categoryList]);
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

        e.target.value = null;
    };

    // 파일 삭제
    const handleRemoveFile = (index) => {
        const newFiles = fileArr.filter((_, i) => i !== index);
        setFileArr(newFiles);

        // 미리보기도 같이 갱신
        const newUrls = previewUrls.filter((_, i) => i !== index);
        setPreviewUrls(newUrls);
    };

    // 파일 업로드시 formData 추가 및 ajax
  
    function writePost() {
        if(Number(deliveryPrice) > 5000) {return alert("배달비는 5천원을 넘을 수 없습니다.")}

        const formData = new FormData();
        fileArr.forEach((file, i)=> {
            formData.append(`files`, file);
        })

        formData.append("title", title);
        formData.append("content", content);
        formData.append("price", price);
        formData.append("categoryId", categoryId);
        formData.append("directYN", directYN);
        formData.append("deliveryYN", deliveryYN);
        if (deliveryYN === "Y") {
            formData.append("deliveryPrice", deliveryPrice);
        }

        const formDataObj = Object.fromEntries(formData.entries());
        console.log(formDataObj);

        jaxios.post("/api/sh-page/sh-write", formData)
            .then((result)=> {
                alert("작성 완료되었습니다!");
                console.log(result.data);
                navigate("/sh-page");
            }).catch(err=>console.error(err));
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
                <select id='dataCategory' value={categoryId} onChange={(e)=> {setCategoryId(e.currentTarget.value)}}>
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
                <input id='dataTitle' type='text' placeholder='아이폰17 512G 팝니다.' value={title} onChange={(e) => setTitle(e.currentTarget.value)} />
            </div>
            <div className='inputWrap'>
                <h4 className='tit'>자세한 설명</h4>
                <textarea id='dataTTA' type='text' placeholder='아이폰17 512G 팝니다.' value={content} onChange={(e) => setContent(e.currentTarget.value)}>

                </textarea>
            </div>
            <div className='inputWrap'>
                <h4 className='tit'>가격</h4>
                <input id='dataPrice' type='text' className='inpPrice' placeholder='3,000' value={price} onChange={(e) => setPrice(e.currentTarget.value)} />
            </div>
            <div className='inputWrap radio'>
                <h4 className='tit'>직거래 유무</h4>
                <div className='radioBox'>
                    <label htmlFor="dataDirectY">가능</label>
                    <input id='dataDirectY' name='directYN' type='radio' value="Y" onChange={(e) => setDirectYN(e.currentTarget.value)} checked={directYN === 'Y'} />
                </div>

                <div className='radioBox'>
                    <label htmlFor="dataDirectN">불가능</label>
                    <input id='dataDirectN' name='directYN' type='radio' value="N" onChange={(e) => setDirectYN(e.currentTarget.value)} checked={directYN === 'N'} />
                </div>
            </div>
            <div className='inputWrap radio'>
                <h4 className='tit'>택배거래 유무</h4>

                <div className='radioBox'>
                    <label htmlFor="dataDeliveryY">가능</label>
                    <input id='dataDeliveryY' name='deliveryYN' type='radio' value="Y" onChange={(e)=> {deliveryFnc(); setDeliveryYN(e.currentTarget.value)}} checked={deliveryYN === "Y"} />
                </div>

                <div className='radioBox'>
                    <label htmlFor="dataDeliveryN">불가능</label>
                    <input id='dataDeliveryN' name='deliveryYN' type='radio' value="N" onChange={(e)=> {deliveryFnc(); setDeliveryYN(e.currentTarget.value);}} checked={deliveryYN === "N"}  />
                </div>
            </div>
            <div className={`inputWrap deliveryModal ${deliveryModal? 'display-block':'display-none'}`}>
                <h4 className='tit'>택배비</h4>
                <input id='dataDlvPrice' type='text' className='inpPrice' placeholder='3,000' value={deliveryPrice} onChange={(e)=> {setDeliveryPrice(e.currentTarget.value)}} />
            </div>
        </div>
        <div className='btnWrap'>
            <button className='navBtn pointBtn' onClick={()=> {writePost();}}>작성 완료</button>
            <button className='navBtn' onClick={()=> {navigate(-1);}}>취소</button>
        </div>
    </div>
  )
}

export default ShWrite