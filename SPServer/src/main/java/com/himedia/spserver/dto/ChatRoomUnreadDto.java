package com.himedia.spserver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
public class ChatRoomUnreadDto {
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

    // 읽지 않은 메시지 카운트
    private Long unreadCount;

    // 라스트 메시지 정보 추가
    private String lastContent;
    private Timestamp lastTime;

    public String getShortContent() {
        if (this.lastContent == null) return "";
        return this.lastContent.length() > 20
                ? this.lastContent.substring(0, 20) + "..."
                : this.lastContent;
    }
}