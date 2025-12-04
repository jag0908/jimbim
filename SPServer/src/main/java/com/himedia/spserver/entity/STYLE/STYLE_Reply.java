package com.himedia.spserver.entity.STYLE;

import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class STYLE_Reply {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reply_id;
    private String content;
    @Column(columnDefinition="DATETIME default now()")
    private Timestamp indate;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member memberid;

    @ManyToOne
    @JoinColumn(name = "spost_id")
    private STYLE_post spost;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private STYLE_Reply parent;

    @Transient
    private Long likeCount; // 좋아요 개수 계산용

}

