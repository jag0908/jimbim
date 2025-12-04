package com.himedia.spserver.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class ShopSuggestDto {
    private Integer suggestId;
    private String title;
    private String content;
    private Integer memberId;   // 유저 PK
    private List<MultipartFile> files; // 여러 파일 업로드
}
