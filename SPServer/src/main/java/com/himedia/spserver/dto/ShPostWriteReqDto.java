package com.himedia.spserver.dto;

import lombok.Data;

@Data
public class ShPostWriteReqDto {

    private Integer postId;
    private String title;
    private String content;
    private Integer categoryId;
    private Integer price;
    private String directYN;
    private String deliveryYN;
    private Integer deliveryPrice;

    private Integer memberId;


}
