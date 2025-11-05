package com.himedia.spserver.entity.Comunity;

import com.himedia.spserver.entity.File;
import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data
public class C_post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cpost_id;

    private String title;
    private String content;
    private Timestamp indate;
    private String c_image;
    private String c_like;
    private String c_reply;

    @ManyToOne
    @JoinColumn(name = "file_id")
    File file;


}
