package com.himedia.spserver.dto;

import lombok.Data;

@Data
public class ShopSellRequestDTO {
    private Long productId;
    private Long optionId;
    private Integer price;
    private Integer sellerId;
}
