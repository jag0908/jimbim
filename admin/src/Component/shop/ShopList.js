import React, { useEffect, useState } from 'react'
import SubMenu from '../SubMenu'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jaxios from '../../util/jwtutil';
import '../../style/admin.css'
import Modal from 'react-modal'


function ShopList() {
    const loginUser = useSelector( state=>state.user)
    const [shopList, setShopList] = useState([]);
    const [shopCategoryList, setShopCategoryList] = useState([]);
    const [paging, setPaging]=useState({});
    const navigate = useNavigate();
    const [beginEnd, setBeginEnd] = useState();
    const [key, setKey] = useState('')
    const type = 'shop'

    const [title, setTitle] = useState('');
    // const [content, setContent] = useState('');
    const [price, setPrice] = useState('');

    const [categoryId, setCategoryId] = useState('1');

    const [oldFiles, setOldFiles] = useState([]); // 서버에 있는 기존 파일
    const [oldRemoveArr, setOldRemoveArr] = useState([]); // 서버에 있는 삭제할 파일들

    const [fileArr, setFileArr] = useState([]); // 새로 업로드한 파일

    const [previewUrls, setPreviewUrls] = useState([]); // 미리보기용 URL
    const [fileLength, setFileLength] = useState(0);  // 기존서버 + 현재 저장되는 파일들의 배열의 사이즈

    const [isOpen, setIsOpen]=useState(false)
    const customStyles = {
        overlay: {
            backgroundColor: "rgba( 0 , 0 , 0 , 0.5)", 
            zIndex: "2000"
        },
        content: {
            left: "0",
            margin: "auto",
            width: "500px",
            height: "600px",
            padding: "0",
            overflow: "hidden",
        },
    };
    useEffect(
        ()=>{
            if( !loginUser.userid ||  !loginUser.roleNames.includes('ADMIN') ){ 
                alert('권한이 없습니다')
                navigate('/')
            }
            jaxios.get('/api/admin/getShopList', {params:{page:1, key}})
            .then((result)=>{ 
                console.log(result)
                setShopList(result.data.shopList) 
                setShopCategoryList(result.data.shopCategoryList)
                setPaging( result.data.paging )
                setKey( result.data.key)

                let arr = [];
                for( let i=result.data.paging.beginPage; i<=result.data.paging.endPage; i++){
                    arr.push(i);
                }
                setBeginEnd( [...arr] )
            })
            .catch((err)=>{console.error(err)})
        },[]
    )

    function onPageMove(p){ 
        jaxios.get('/api/admin/getShopList', {params:{page:p, key}})
        .then((result)=>{ 
            setShopList(result.data.shopList) 
            setShopCategoryList(result.data.shopCategoryList)
            setPaging( result.data.paging )
            setKey( result.data.key)
            let arr = [];
            for( let i=result.data.paging.beginPage; i<=result.data.paging.endPage; i++){
                arr.push(i);
            }
            setBeginEnd( [...arr] )
            console.log('paging', result.data.paging)
        })
        .catch((err)=>{console.error(err)})
    }

    function openModal(){
        setIsOpen(!isOpen)
        setTitle('')
        // setContent(suggest.content)
        setPrice('')
        setCategoryId(1)
        setOldFiles([])
        setFileArr([])
        setFileLength(0);    
        setPreviewUrls([])
    }
    // 숫자만 입력 가능하게
    const getNumberOnly = (e) => {
        e.target.value = e.target.value.replaceAll(/\D/g, "");
    };
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

    async function writeShopProduct(){
        if(!title){ return alert('제목을 입력하세요')}
        // if(!content){ return alert('내용을 입력하세요')}
        if(!price){ return alert('가격을 입력하세요')}
        if(!categoryId){ return alert('카테고리를 선택하세요')}

        if(window.confirm('등록하시겠습니까?')){
            let createdPostId;
            await jaxios.post('/api/admin/writeShopProduct', null, {params:{title, price, categoryId}})
            .then((result)=>{ 
                alert('등록이 완료되었습니다.');
                createdPostId = result.data.postId;
                setIsOpen( false )
            } ).catch((err)=>{
                console.error(err);
                return;
            })

            if(!createdPostId) return;
            await createFormData(fileArr, createdPostId);       // 새로 등록한 이미지 s3에 업로드 후 DB에 등록

            await jaxios.get('/api/admin/getShopList', {params:{page:1, key}})
            .then((result)=>{ 
                console.log(result)
                setShopList(result.data.shopList) 
                setShopCategoryList(result.data.shopCategoryList)
                setPaging( result.data.paging )
                setKey( result.data.key)

                let arr = [];
                for( let i=result.data.paging.beginPage; i<=result.data.paging.endPage; i++){
                    arr.push(i);
                }
                setBeginEnd( [...arr] )
            })
            .catch((err)=>{console.error(err)})
        }
    }
    const createFormData = async (allfileArr, postId) => {
        if (!allfileArr || allfileArr.length === 0) return;

        const formData = new FormData();
        allfileArr.forEach(file => formData.append("imageList", file));
        formData.append("postId", postId);

        try {
            await jaxios.post(`/api/admin/fileupload`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
        } catch (err) {
            console.error("파일 업로드 실패:", err);
        }
    };
    return (
        <div className='adminContainer'>
            <SubMenu type={type}/>
            <div className='productTable'>
                <div className='title'>상품목록(SHOP)</div>    
                <div style={{margin:'5px'}} className='detailPageBtns'>
                    <button onClick={()=>{openModal()}} >상품 추가하기</button>
                </div>
                <div className='row tableTitle'>
                    <div className='col'>카테고리</div>
                    <div className='col'>상품명</div>
                    <div className='col'>원가</div>
                    <div className='col'>추가일</div>
                </div>
                {
                    (shopList[0])?(
                        shopList.map((shop, idx)=>{
                            return (
                                <div className='row' onClick={()=>{navigate(`/ShopDetail/${shop.productId}`)}}>
                                    <div className='col'>{shopCategoryList[shop.category.categoryId-1].category_name}</div>
                                    <div className='col'>{shop.title}</div>
                                    <div className='col'>{shop.price} 원</div>
                                    {/* <div className='col'>{
                                        (shop.member)?
                                        (((shop.member.provider)?(shop.member.userid+' ('+shop.member.provider+')'):(shop.member.userid))):
                                        (<span className='italic'>탈퇴회원</span>)
                                    }</div> */}
                                    <div className='col'>{shop.indate.substring(0, 10)}</div>
                                </div>
                            )
                        })
                    ):(<></>)
                }
                <div id="paging" style={{textAlign:"center", padding:"10px"}}>
                {
                    (paging.prev)?(
                        <span style={{cursor:"pointer"}} onClick={ ()=>{ onPageMove( paging.beginPage-1 ) } } > ◀ </span>
                    ):(<span></span>)
                }
                {
                    (beginEnd)?(
                        beginEnd.map((page, idx)=>{
                            return (
                                <span style={{cursor:"pointer"}} key={idx} className={(page==paging.page)?('currentPage'):''}  onClick={
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
                </div>
                <div className='btns' style={{display:"flex", margin:"5px"}}>
                    <input type="text" value={key} onChange={(e)=>{setKey(e.currentTarget.value)}} />
                    <button style={{marginLeft:"auto"}} onClick={()=>{ onPageMove(1) }}>검색</button>
                </div>
                <Modal isOpen={isOpen}  ariaHideApp={false}  style={customStyles} >
                    <div className='writeReplyTitle'>상품 등록</div>
                    <div className='writeProductRow'>
                        <div className='detailTitle'>상품명</div>
                        <div className='writearea'><input value={title} onChange={(e)=>{setTitle( e.currentTarget.value )}}/></div>
                    </div>
                    <div className='writeProductRow'>
                        <div className='detailTitle'>카테고리</div>
                        <div className='writearea'>
                            <select id='dataCategory' value={categoryId} onChange={(e)=> {setCategoryId(e.currentTarget.value)}}>
                                {
                                    shopCategoryList.map((category, i)=> {
                                        return(
                                            <option key={i} value={category.categoryId}>
                                                {category.category_name}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className='writeProductRow'>
                        <div className='detailTitle'>상품 이미지</div>
                        <div className='writearea'>
                            <div className='inputWrap file'>
                                <label htmlFor="dataFile">+ <span>{fileLength}/10</span></label>
                                {/* 파일업로드 인풋 */}
                                <input id='dataFile' type='file' className='inpFile' onChange={(e)=> {fileupload(e);}} multiple />
                                {/* 미리보기 이미지 */}
                                <div className="previewContainer">
                                    <div className='twoline'>
                                        {/* 서버이미지 */}
                                        {
                                            oldFiles.map((file, i)=> {
                                                return(<>
                                                    {(i<5)?
                                                    (<div className='imgBox' key={i} >
                                                        <img src={file.filePath} alt={`preview-${i}`} />
                                                        <div className={`removeBtn removeBtn_${i}`} onClick={()=> {
                                                                oldHandleRemoveFile(i, file.file_id);  
                                                        }}>X</div>
                                                    </div>):
                                                    (<></>)}
                                                </>)
                                            })
                                        }
                                        {/* 현재이미지 */}
                                        {
                                            previewUrls.map((url, i) => {
                                                return(<>
                                                    {(i+oldFiles.length<5)?
                                                    (<div className='imgBox' key={i} >
                                                        <img src={url} alt={`preview-${i}`} />
                                                        <div className={`removeBtn removeBtn_${i}`} onClick={()=> {
                                                                handleRemoveFile(i);  
                                                        }}>X</div>
                                                    </div>):
                                                    (<></>)}
                                                </>)
                                            })
                                        }
                                    </div>
                                    <div className='twoline'>
                                        {/* 서버이미지 */}
                                        {
                                            oldFiles.map((file, i)=> {
                                                return(<>
                                                    {(i>=5)?
                                                    (<div className='imgBox' key={i} >
                                                        <img src={file.filePath} alt={`preview-${i}`} />
                                                        <div className={`removeBtn removeBtn_${i}`} onClick={()=> {
                                                                oldHandleRemoveFile(i, file.file_id);  
                                                        }}>X</div>
                                                    </div>):
                                                    (<></>)}
                                                </>)
                                            })
                                        }
                                        {/* 현재이미지 */}
                                        {
                                            previewUrls.map((url, i) => {
                                                return(<>
                                                    {(i+oldFiles.length>=5)?
                                                    (<div className='imgBox' key={i} >
                                                        <img src={url} alt={`preview-${i}`} />
                                                        <div className={`removeBtn removeBtn_${i}`} onClick={()=> {
                                                                handleRemoveFile(i);  
                                                        }}>X</div>
                                                    </div>):
                                                    (<></>)}
                                                </>)
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='writeProductRow'>
                        <div className='detailTitle'>가격</div>
                        <div className='writearea'>
                            <input value={price} onInput={getNumberOnly} onChange={(e)=>{setPrice( e.currentTarget.value )}}/> 원
                        </div>
                    </div>
                    <div className='detailPageBtns'>
                        <button onClick={()=>{writeShopProduct()}}>상품 등록하기</button>
                    </div>
                    <div className='detailPageBtns'>
                        <button className='graybtn' onClick={()=>{ setIsOpen(false) }}>닫기</button>
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default ShopList