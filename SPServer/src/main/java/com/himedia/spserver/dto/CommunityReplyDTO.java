package com.himedia.spserver.dto;

import lombok.Data;

@Data
public class CommunityReplyDTO {
    private Integer memberId; //수정
    private Integer cpostId;  //수정
    private String content;
}
