package com.himedia.spserver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class CommunityReplyResponseDTO {
    private Integer replyId;
    private String content;
    private String userid;
    private Integer memberId;
    private String indate;
    private Integer parentReplyId;          // 부모 댓글 ID
    private List<CommunityReplyResponseDTO> children; // 대댓글 리스트

    // ★ 익명 여부 추가
    private Boolean anonymous = false;

    //이삭수정
    private Long likeCount = 0L;
    private Boolean likedByUser = false;

}
