package com.himedia.spserver.entity.Community;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Data
public class C_File {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 200)
    private String originalname;

    @Column(nullable = false)
    private Long size;

    @Column(nullable = false, length = 500)
    private String path;

    @Column(nullable = false)
    private String contentType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cpostId")
    @JsonBackReference
    private C_post cpost;

    @CreationTimestamp
    @Column(columnDefinition = "DATETIME default now()")
    private Timestamp indate;
}
