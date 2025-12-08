package com.himedia.spserver.dto;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class ChatMsgDto {
    private Long messageId;
    private Integer chatRoomId;
    private String content;

    private Integer senderId;
    private Timestamp indate;

    // 판매자
    private Integer sellerId;
    private String sellerName;
    private String sellerProfileImg;
    private Integer sellerReadMsg;

    // 구매자
    private Integer buyerId;
    private String buyerName;
    private String buyerProfileImg;
    private Integer buyerReadMsg;

    private Integer postId;
    private String postTitle;

}
