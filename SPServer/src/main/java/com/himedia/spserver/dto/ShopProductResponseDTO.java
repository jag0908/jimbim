package com.himedia.spserver.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class ShopProductResponseDTO {
    private Long productId;
    private String title;
    private Integer price; // 정가
    private List<ShopProductOptionDTO> options; // 옵션 리스트
    private Map<Long, Integer> optionPrices; // optionId -> 최저가
    private Integer minPrice; // 전체 상품 최저가
    private List<String> imageUrls;
}
