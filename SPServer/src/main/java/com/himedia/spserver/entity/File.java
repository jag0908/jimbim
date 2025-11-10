package com.himedia.spserver.entity;

import com.himedia.spserver.entity.SH.SH_post;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer file_id;
    @Column(nullable = false, length = 200)
    private String originalname;
    @Column(nullable = false)
    private Long size;
    @Column(nullable = false, length = 500)
    private String path;
    @Column(nullable = false)
    private String contentType;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shPostId", nullable = false)
    private SH_post shPost;

    @Column( columnDefinition="DATETIME default now()" )
    private Timestamp indate;
}
