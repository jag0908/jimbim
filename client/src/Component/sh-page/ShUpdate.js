import React, { useEffect, useState } from 'react'
import jaxios from '../../util/jwtutil';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ShWrite() {
    const loginUser = useSelector(state=>state.user);
    const navigate = useNavigate();
    const {id} = useParams();

    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState('0');
    const [content, setContent] = useState('');
    const [price, setPrice] = useState('');
    const [directYN, setDirectYN] = useState("N");
    const [deliveryYN, setDeliveryYN] = useState("N");
    const [deliveryPrice, setDeliveryPrice] = useState('');
    
    
    const [deliveryModal, setDeliveryModal] = useState(false);
    const [categoryArr, setCategoryArr] = useState([]);
    
    
    const [oldFiles, setOldFiles] = useState([]); // 서버에 있는 기존 파일
    const [newFiles, setNewFiles] = useState([]); // 새로 업로드한 파일
    const [previewUrls, setPreviewUrls] = useState([]); // 미리보기용 URL
    const [fileLength, setFileLength] = useState(0);  // 기존서버 + 현재 저장되는 파일들의 배열의 사이즈


    async function getPostData() {
        try {
            let getCategory = await jaxios.get("/api/sh-page/sh-category");
            setCategoryArr([...getCategory.data.shCategory]); 

            const getPost = await jaxios.get(`/api/sh-page/sh-view/${id}`);
            let res = getPost.data.post;
                 
            setTitle(res.title);
            setCategoryId(res.category);
            setContent(res.content);
            setPrice(res.price);
            setDirectYN(res.direct_yn);
            setDeliveryYN(res.delivery_yn);
            setDeliveryPrice(res.delivery_price);

            setOldFiles([...res.files]);
            setFileLength(res.files.length);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(()=> {
       getPostData();
    }, []);

    // 기존 서버 파일 보여주기
    useEffect(()=> {
     
        let oldFileUrlArr = [];
        oldFiles && oldFiles.forEach((file, i)=> {
            oldFileUrlArr.push(file.path)
        })
        setPreviewUrls(oldFileUrlArr);
    }, [oldFiles]);

    function fileupload(e) {   // 새로운 파일을 업로드하는 함수
        if (!e.target.files) return;

        const selectedFiles = Array.from(e.target.files);

        // 기존 파일 + 새 파일 합치기
        const totalFiles = [...oldFiles, ...newFiles, ...selectedFiles];

        if (totalFiles.length > 10) {
            alert("최대 10개까지 선택 가능합니다.");
            e.target.value = null; // 방금 선택한 파일들만 초기화
            return;
        }

        setNewFiles(prev => [...prev, ...selectedFiles]);

        // 미리보기 URL 갱신
        const urls = [
            ...oldFiles.map(f => f.path), 
            ...[...newFiles, ...selectedFiles].map(f => URL.createObjectURL(f))
        ];
        setPreviewUrls(urls);

        setFileLength(totalFiles.length);
    }

    function oldHandleRemoveFile(index) {    // 기존 서버 파일을 삭제할 수 있는 함수
        const newOldFiles = oldFiles.filter((_, i) => i !== index);  
        // "_" 해당변수는 안쓰겠다는뜻,  i는 원본배열,  원본배열중 i번째 배열을 제외한 나머지 배열로 newOldFIle 배열 변수들 재정의함.
        setOldFiles(newOldFiles);

        // 미리보기 URL 갱신
        const urls = [
            ...newOldFiles.map(f => f.path),
            ...newFiles.map(f => URL.createObjectURL(f))
        ];
        setPreviewUrls(urls);

        setFileLength(newOldFiles.length + newFiles.length);
    }

    function handleRemoveFile(index) {    // 새로 추가판 파일을 삭제할 수 있는 함수
        const newNewFiles = newFiles.filter((_, i) => i !== index);
        setNewFiles(newNewFiles);

        // 미리보기 URL 갱신
        const urls = [
            ...oldFiles.map(f => f.path),
            ...newNewFiles.map(f => URL.createObjectURL(f))
        ];
        setPreviewUrls(urls);

        setFileLength(oldFiles.length + newNewFiles.length);
    }

    function updatePost() {   // 업데이트 axios 요청을 서버에 보낼 함수
        if (Number(deliveryPrice) > 5000) {
            return alert("배달비는 5천원을 넘을 수 없습니다.");
        }

        const formData = new FormData();

        // 새 파일 추가
        newFiles.forEach(file => {
            formData.append("files", file);
        });

        // 삭제되지 않고 남은 기존 파일 정보 (서버에서 처리 가능하게 id 또는 이름 전송)
        oldFiles.forEach(file => {
            formData.append("existingFiles", file.file_id || file.id); // 서버에서 기존 파일 식별용
        });

        formData.append("member_id", loginUser.member_id);
        formData.append("title", title);
        formData.append("content", content);
        formData.append("price", price);
        formData.append("categoryId", categoryId);
        formData.append("directYN", directYN);
        formData.append("deliveryYN", deliveryYN);
        if (deliveryYN === "Y") {
            formData.append("deliveryPrice", deliveryPrice);
        }

        // jaxios.post("/api/sh-page/sh-update", formData)
        //     .then(res => {
        //         alert("수정 완료되었습니다!");
        //         navigate("/sh-page");
        //     })
        //     .catch(err => console.error(err));
    }




    useEffect(()=> {
        if(deliveryYN === "Y") {
            setDeliveryModal(true);
        } else {
            setDeliveryModal(false);
        }
    }, [deliveryYN]);

    function deliveryFnc() {
        setDeliveryModal(!deliveryModal);
    }



  return (
    <div className='shWrite'>
        <div className='writeWrap'>
            <h2 className='mainTitle'>내 물건 수정하기</h2>
            <div className='inputWrap file'>
                <label htmlFor="dataFile">+ <span>{fileLength}/10</span></label>
                {/* 파일업로드 인풋 */}
                <input id='dataFile' type='file' className='inpFile' onChange={(e)=> {fileupload(e);}} multiple />
                {/* 미리보기 이미지 */}
                <div className="previewContainer">
                    {previewUrls.map((url, i) => {
                        const isOldFile = i < oldFiles.length;
                        return(
                            <div className='imgBox' key={i} >
                                <img src={url} alt={`preview-${i}`} />
                                <div className={`removeBtn removeBtn_${i}`}onClick={()=> {
                                    if(isOldFile) {
                                        oldHandleRemoveFile(i); // 기존 서버 파일 삭제
                                    } else {
                                        handleRemoveFile(i);    // 새로 추가된 파일 삭제
                                    }
                                }}>X</div>
                            </div>    
                        )
                    })}
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
            <button className='navBtn pointBtn' onClick={()=> {updatePost();}}>수정 완료</button>
            <button className='navBtn' onClick={()=> {navigate(-1);}}>취소</button>
        </div>
    </div>
  )
}

export default ShWrite