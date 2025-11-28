package com.himedia.spserver.dto;

import com.himedia.spserver.entity.Member;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Data;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Data
public class AlramZzimResDto {
    private Long id;

    private Member member;

    private String endUserId;

    private Integer targetId;
    private String targetType;

    private Boolean isRead = false;

    private Timestamp indate;
}
