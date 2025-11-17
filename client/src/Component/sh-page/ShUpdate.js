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
    const [oldRemoveArr, setOldRemoveArr] = useState([]); // 서버에 있는 삭제할 파일들

    const [fileArr, setFileArr] = useState([]); // 새로 업로드한 파일

    const [previewUrls, setPreviewUrls] = useState([]); // 미리보기용 URL
    const [fileLength, setFileLength] = useState(0);  // 기존서버 + 현재 저장되는 파일들의 배열의 사이즈

    const [pMemberId, setPMemberId] = useState("");



    async function getPostData() {
      
        
        try {
            let getCategory = await jaxios.get("/api/sh-page/sh-category");
            setCategoryArr([...getCategory.data.categoryList]); 

            const getPost = await jaxios.get(`/api/sh-page/sh-view/${id}`);
            let res = getPost.data.post;
            console.log(getPost.data)
            setTitle(res.title);
            setCategoryId(res.categoryId);
            setContent(res.content);
            setPrice(res.price);
            setDirectYN(res.directYN);
            setDeliveryYN(res.deliveryYN);
            setDeliveryPrice(res.deliveryPrice);

            setPMemberId(res.member.memberId);
            

            setOldFiles([...res.files]);
            setFileLength(res.files.length);


            if(loginUser.member_id != res.member.memberId) {
                alert("잘못된 접근입니다.");
                return navigate("/sh-page/sh-view/" + id);
            }
            
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(()=> {
        getPostData();

    }, []);


    function fileupload(e) {   // 새로운 파일을 업로드하는 함수
        if(!e.target) {return}

        let newfiles = Array.from(e.target.files);

        // 기존 파일과 합치기
        const allFiles = [...fileArr, ...newfiles];
        console.log("@@@@ 파일 정보 @@@@" + allFiles)

        if ((allFiles.length + oldFiles.length) > 10) {
            alert("최대 10개까지 선택 가능합니다.");
            e.target.value = null; // 선택 초기화
            return;
        };

        setFileLength(allFiles.length + oldFiles.length);
        setFileArr(allFiles);

        // 브라우저에서 바로 미리보기 URL 생성
        const urls = allFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);

        e.target.value = null;
    }

    function oldHandleRemoveFile(index, fileId) {    // 기존 서버 파일을 삭제할 수 있는 함수
        let resultArr = oldFiles.filter((_, i) => i !== index);
        setOldFiles(resultArr);

        // 삭제할 서버 디비 fileId들
        setOldRemoveArr(prev => [...prev, fileId]);
        

        // 갯수 표시 업데이트
        setFileLength(prev => prev - 1);

    }

    function handleRemoveFile(index) {    // 새로 추가판 파일을 삭제할 수 있는 함수
        const newFiles = fileArr.filter((_, i) => i !== index);
        setFileArr(newFiles);

        // 미리보기도 같이 갱신
        const newUrls = previewUrls.filter((_, i) => i !== index);
        setPreviewUrls(newUrls);

        // 갯수 표시 업데이트
        setFileLength(prev => prev - 1);
    }

    function deletePost() {
        if(window.confirm("정말로 삭제하시겠습니까? 삭제된 데이터는 복구할 수 없습니다.")) {
            jaxios.post("/api/sh-page/delete-post", null, {params: {postId: id}})  
                .then((result)=> {
                    console.log(result.data.msg);
                    if(result.data.msg == "notOk") {
                        alert("잘못된 접근입니다. 삭제하실 수 없습니다.");
                        return navigate("/sh-page/sh-view/" + id);
                    } else if(result.data.msg == "ok") {
                        alert("삭제가 성공적으로 완료되었습니다.");
                        return navigate("/sh-page");
                    }
                }).catch(err => console.error(err));
        } else {
            return
        }
    }

    async function updatePost() {   // 업데이트 axios 요청을 서버에 보낼 함수

       if(Number(deliveryPrice) > 5000) {return alert("배달비는 5천원을 넘을 수 없습니다.")}

        const formData = new FormData();
        fileArr.forEach((file, i)=> {
            formData.append(`files`, file);
        });

        oldRemoveArr.map((rmFile, i)=> {
            formData.append(`rmFiles`, Number(rmFile));
        });

        formData.append("postId", Number(id));
        formData.append("title", title);
        formData.append("content", content);
        formData.append("price", Number(price));
        formData.append("categoryId", categoryId);
        formData.append("directYN", directYN);
        formData.append("deliveryYN", deliveryYN);

        formData.append("pMemnerId", pMemberId);

        if (deliveryYN === "Y") {
            formData.append("deliveryPrice", Number(deliveryPrice));
        };

        const formDataObj = Object.fromEntries(formData.entries());
        console.log(formDataObj);


        try {

            const res = await jaxios.post("/api/sh-page/sh-update", formData);
            if(res.data.msg == "notOk") {
                alert("잘못된 접근입니다.");
                return navigate("/sh-page/sh-view/" + id);
            }
            alert("수정이 완료되었습니다!");
            navigate("/sh-page/sh-view/" + id);
        } catch(err) {
            console.error(err)
        }

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
                    {/* 서버이미지 */}
                    {
                        oldFiles.map((file, i)=> {
                            return(
                                <div className='imgBox' key={i} >
                                    <img src={file.path} alt={`preview-${i}`} />
                                    <div className={`removeBtn removeBtn_${i}`} onClick={()=> {
                                            oldHandleRemoveFile(i, file.fileId);  
                                    }}>X</div>
                                </div>    
                            )
                        })
                    }
                    {/* 현재이미지 */}
                    {
                        previewUrls.map((url, i) => {
                            return(
                                <div className='imgBox' key={i} >
                                    <img src={url} alt={`preview-${i}`} />
                                    <div className={`removeBtn removeBtn_${i}`} onClick={()=> {
                                            handleRemoveFile(i);  
                                    }}>X</div>
                                </div>    
                            )
                        })
                    }
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
            <button className='navBtn deleteBtn pointBtn' onClick={()=> {deletePost();}}>
                삭제
            </button>
            <div className='btnWrap'>
                <button className='navBtn pointBtn' onClick={()=> {updatePost();}}>수정 완료</button>
                <button className='navBtn' onClick={()=> {navigate(-1);}}>취소</button>
            </div>
        </div>
    </div>
  )
}

export default ShWrite