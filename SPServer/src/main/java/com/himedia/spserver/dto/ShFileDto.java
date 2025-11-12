package com.himedia.spserver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
public class ShFileDto {
    private Integer fileId;
    private String originalName;
    private Long size;
    private String path;
    private String contentType;
    private Timestamp indate;
}
