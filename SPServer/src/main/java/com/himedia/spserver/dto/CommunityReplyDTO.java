package com.himedia.spserver.dto;

import lombok.Data;

@Data
public class CommunityReplyDTO {
    private Integer replyId;     // 기존 댓글 ID
    private String content;      // 댓글 내용
    private Integer memberId;    // 작성자
    private Integer cpostId;     // 게시글 ID
    private Integer parentReplyId; // ★ 부모 댓글 ID (대댓글일 때)

    private Boolean anonymous = false;
}
