package com.himedia.spserver.entity.STYLE;

import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data
public class STYLE_post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer spostId;

    private String title;
    private String content;

    @Column(columnDefinition = "DATETIME default now()")
    private Timestamp indate;

    @Column(nullable = false)
    private int viewCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;
}

