package com.himedia.spserver.dto;

import com.himedia.spserver.entity.SHOP.SHOP_Product;
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

        // 대표 이미지
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            dto.setFirstImage(product.getImages().get(0).getFilePath());
        }

        // 카테고리
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getCategoryId());
        }

        // 최저가 계산
        if (product.getSellLists() != null && !product.getSellLists().isEmpty()) {
            dto.setMinPrice(
                    product.getSellLists().stream()
                            .map(SHOP_SellList::getPrice)
                            .min(Integer::compareTo)
                            .orElse(null)
            );

            // 상품 상태: 하나라도 판매중(selling)이 있으면 selling
            boolean anySelling = product.getSellLists().stream()
                    .anyMatch(s -> "selling".equals(s.getStatus()));

            dto.setStatus(anySelling ? "selling" : "soldout");
        }

        // 등록일 (Timestamp → String)
        if (product.getIndate() != null) {
            dto.setIndate(product.getIndate().toString());
        }

        return dto;
    }

}
