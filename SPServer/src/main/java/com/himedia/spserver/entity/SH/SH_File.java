package com.himedia.spserver.entity.SH;


import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Data
public class SH_File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer fileId;
    @Column(nullable = false, length = 200)
    private String originalname;
    @Column(nullable = false)
    private Long size;
    @Column(nullable = false, length = 500)
    private String path;
    @Column(nullable = false)
    private String contentType;

    @CreationTimestamp
    @Column( columnDefinition="DATETIME default now()" )
    private Timestamp indate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "postid")
    private SH_post post;

}
