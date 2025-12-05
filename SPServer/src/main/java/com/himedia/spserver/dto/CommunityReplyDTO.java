package com.himedia.spserver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityReplyDTO {
    private Integer replyId;     // 기존 댓글 ID
    private String content;      // 댓글 내용
    private Integer memberId;    // 작성자
    private Integer cpostId;     // 게시글 ID
    private Integer parentReplyId; // ★ 부모 댓글 ID (대댓글일 때)

    private Boolean anonymous = false;

//이삭 수정
    private String userid;
    private String indate;
    private List<CommunityReplyResponseDTO> children;
    private Long likeCount = 0L;
    private Boolean likedByUser = false;
}
