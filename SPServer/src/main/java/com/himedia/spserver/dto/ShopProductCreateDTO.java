package com.himedia.spserver.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class ShopProductCreateDTO {
    private String title;
    private String content;
    private Integer deliveryPrice;
    private Integer categoryId;

    private List<String> optionNames;  // ["230", "235", "240"] 같은 리스트

    private List<MultipartFile> images;
}
