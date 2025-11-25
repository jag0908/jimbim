import React from 'react'
import { useParams } from 'react-router-dom';

function QnaDetail() {
    const { qnaId } = useParams();
    return (
        <div>QnaDetail{qnaId} </div>
    )
}

export default QnaDetail