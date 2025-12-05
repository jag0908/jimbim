package com.himedia.spserver.dto;

import lombok.*;

@Data
@Builder
public class NotificationDTO {

    private Long id;
    private String message;
    private String type;

    private Integer postId;    // style or community 게시글 ID
    private Integer replyId;   // 댓글 알림이면 댓글 ID

    private String senderUserid;
    private String senderProfileImg;

    private boolean read;
    private String time;
    private String linkUrl;

    private String senderProfileImageUrl;

}


