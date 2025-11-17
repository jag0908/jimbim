package com.himedia.spserver.dto;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class ShFileInsertReqDto {

    private Integer fileId;
    private String originalname;
    private Long size;
    private String path;
    private String contentType;
    private String postId;

    private Timestamp indate;
}
