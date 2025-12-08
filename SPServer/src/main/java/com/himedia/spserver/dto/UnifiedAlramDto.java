package com.himedia.spserver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UnifiedAlramDto {
    String alarmType;       // ZZIM, SUGGEST, CHAT_SELL, CHAT_BUY, NOTIFICATION
    Long id;
    String senderId;
    String senderProfileImg;
    Integer resiverId;
    Boolean isRead;

    Timestamp indate ;       // ✅ 정렬 기준
    String linkurl;
}
