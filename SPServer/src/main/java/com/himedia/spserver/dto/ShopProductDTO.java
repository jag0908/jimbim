package com.himedia.spserver.dto;

import com.himedia.spserver.entity.SHOP.SHOP_Product;
import com.himedia.spserver.entity.SHOP.SHOP_ProductImage;
import com.himedia.spserver.entity.SHOP.SHOP_SellList;
import lombok.Data;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Data
public class ShopProductDTO {

    private Long productId;
    private String title;
    private String content;
    private Integer minPrice;     // 최저가
    private String status;        // selling, soldout
    private String firstImage;    // 대표 이미지
    private Long categoryId;
    private String indate;        // 등록일

    public static ShopProductDTO fromEntity(SHOP_Product product) {
        ShopProductDTO dto = new ShopProductDTO();
        dto.setProductId(product.getProductId());
        dto.setTitle(product.getTitle());
        dto.setContent(product.getContent());

        // ⭐ 대표 이미지 설정 (null 방지 + 안전 처리)
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            // 이미지 정렬되어 있다고 가정, 첫 번째 이미지 사용
            SHOP_ProductImage firstImage = product.getImages().stream()
                    .findFirst()
                    .orElse(null);

            if (firstImage != null) {
                dto.setFirstImage(firstImage.getFilePath());
            }
        } else {
            dto.setFirstImage(null); // 또는 기본 이미지 설정 가능
        }

        // 카테고리
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getCategoryId());
        }

        // ⭐ 최저가 계산
        if (product.getSellLists() != null && !product.getSellLists().isEmpty()) {
            dto.setMinPrice(
                    product.getSellLists().stream()
                            .map(SHOP_SellList::getPrice)
                            .min(Integer::compareTo)
                            .orElse(null)
            );

            // ⭐ 판매 상태
            boolean anySelling = product.getSellLists().stream()
                    .anyMatch(s -> "selling".equals(s.getStatus()));

            dto.setStatus(anySelling ? "selling" : "soldout");
        } else {
            dto.setMinPrice(null);
            dto.setStatus("selling");
        }

        // ⭐ 등록일
        if (product.getIndate() != null) {
            dto.setIndate(product.getIndate().toString());
        }

        return dto;
    }


}
