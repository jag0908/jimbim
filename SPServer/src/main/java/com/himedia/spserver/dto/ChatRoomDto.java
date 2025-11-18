package com.himedia.spserver.dto;

import lombok.Data;


@Data
public class ChatRoomDto {
    private Integer chatRoomId;

    // 판매자
    private Integer sellerId;
    private String sellerName;
    private String sellerProfileImg;

    // 구매자
    private Integer buyerId;
    private String buyerName;

    private Integer postId;
    private String postTitle;
}
