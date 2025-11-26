package com.himedia.spserver.dto;

import lombok.Data;

@Data
public class Paging {
    private int page =1;            // 현재 페이지 위치
    private int totalCount;         // 모든 요소 수 ( 예시 : 게시글 300개 있는경우 300)
    private int beginPage;          // 예시 : 페이지가 1~10 형태로 있을때 1,  11~20 형태로 있을때 11
    private int endPage;            // 예시 : 페이지가 1~10 형태로 있을때 10,  11~20 형태로 있을때 20
    private int displayRow=10;      // 페이지 하나당 들어가게할 요소 수 ( 값에 n을 넣을 경우 화면에는 게시글이 n개까지만 보여지고 나머지는 다른페이지로 이동해야함)
    private int displayPage=10;     // 화면에 보이게할 페이지 버튼 수 ( << 1 2 3 4 5 >> 형태로 나오게할 버튼의 숫자 결정)
    private boolean prev;           // 페이지 버튼에서 이전 버튼을 누를수 있는지 여부 (맨 처음 페이지일경우 작동못하게함)
    private boolean next;           // 페이지 버튼에서 다음 버튼을 누를수 있는지 여부 (맨 끝 페이지일경우 작동못하게함)
    private int startNum;           // 게시글 등이 몇번째 번호부터 나오게할지
    private int endNum;             // 게시글 등이 몇번째 번호까지 나오게할지
    public void calPaging() {
        endPage = ( (int)Math.ceil( page/(double)displayPage ) ) * displayPage;
        beginPage = endPage - (displayPage - 1);
        int totalPage = (int)Math.ceil( totalCount/(double)displayRow );        // 요소 숫자에 따라 총 페이지 수 계산
        if(totalPage<endPage){
            endPage = totalPage;    // endpage가 총페이지 숫자를 초과할경우 총페이지의 숫자가 됨
            next = false;           // endpage가 총페이지를 초과할경우 맨끝페이지이므로 next 버튼(다음페이지 이동 버튼)을 비활성화함
        }else{
            next = true;
        }
        prev = (beginPage==1)?false:true;   // beginPage가 1인경우 맨처음 페이지이므로 prev 버튼(이전페이지 이동 버튼)을 비활성화함
        startNum = (page-1)*displayRow;     // 몇번째 요소부터 나오게할지  현재 페이지 위치 * 페이지 하나당 보이게할 요소수 계산하여 넣음
        endNum = page*displayRow;           // 몇번째 요소까지 나오게할지
        System.out.println(page + " " + beginPage + " " + endPage + totalCount);
    }
}
