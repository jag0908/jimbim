package com.himedia.spserver.dto;

import com.himedia.spserver.entity.SH.ChatRoom_Msg;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;


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
    private String buyerProfileImg;

    private Integer postId;
    private String postTitle;

    // 마지막 채팅
    private String lastChatContent;
    private Timestamp date;

    private List<Integer> sellerReadMsg;
    private List<Integer> buyerReadMsg;
}
