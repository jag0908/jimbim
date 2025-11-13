package com.himedia.spserver.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.util.List;

@Data
public class ShPostUpdateReqDTO {
    private Integer postId;
    private String categoryId;
    private Integer memberId;
    private String title;
    private String content;
    private Integer price;
    private String directYN;
    private String deliveryYN;
    private Integer deliveryPrice;

    private Integer representFile;

    private List<MultipartFile> files;
    private List<Integer> rmFiles;
}

