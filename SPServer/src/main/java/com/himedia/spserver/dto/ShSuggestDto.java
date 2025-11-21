package com.himedia.spserver.dto;

import lombok.Data;
import java.sql.Timestamp;

@Data
public class ShSuggestDto {
    private Integer suggest_id;
    private Integer suggest_price;

    private Integer postId;
    private Integer memberId;
    private String userId;
    private String memberName;
    private String memberProfileImg;

    private Timestamp indate;
    private Timestamp uptime;

    private Integer approved = 0;
}
