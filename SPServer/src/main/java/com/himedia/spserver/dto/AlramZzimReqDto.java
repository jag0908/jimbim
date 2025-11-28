package com.himedia.spserver.dto;

import com.himedia.spserver.entity.Member;
import lombok.Data;

@Data
public class AlramZzimReqDto {
    private Member member;
    private String endUserId;

    private Integer targetId;
    private String targetType;
}
