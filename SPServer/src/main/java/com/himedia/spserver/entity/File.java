package com.himedia.spserver.entity;

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
    private String size;
    @Column(nullable = false, length = 500)
    private String path;
    @Column( columnDefinition="DATETIME default now()" )
    private Timestamp indate;


}
