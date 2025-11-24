package com.himedia.spserver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CommunityReplyResponseDTO {
    private Integer replyId;
    private String content;
    private String userid;
    private Integer memberId;
}
