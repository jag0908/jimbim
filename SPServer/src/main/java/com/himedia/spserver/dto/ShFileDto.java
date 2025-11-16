package com.himedia.spserver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Data
public class ShFileDto {
    private Integer fileId;
    private String originalName;
    private Long size;
    private String path;
    private String contentType;
    @CreationTimestamp
    private Timestamp indate;

    private Integer postId;
}
