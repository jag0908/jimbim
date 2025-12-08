package com.himedia.spserver.dto;

import com.himedia.spserver.entity.SHOP.SHOP_Product;
import com.himedia.spserver.entity.SHOP.SHOP_ProductImage;
import com.himedia.spserver.entity.SHOP.SHOP_SellList;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

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

    // 🔹 여러 이미지 리스트 추가
    private List<String> imageUrls;

    public static ShopProductDTO fromEntity(SHOP_Product product) {
        ShopProductDTO dto = new ShopProductDTO();
        dto.setProductId(product.getProductId());
        dto.setTitle(product.getTitle());
        dto.setContent(product.getContent());

        // ⭐ 대표 이미지 설정
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            SHOP_ProductImage first = product.getImages().stream()
                    .findFirst()
                    .orElse(null);
            if (first != null) {
                dto.setFirstImage(first.getFilePath());
            }

            // 🔹 모든 이미지 리스트
            dto.setImageUrls(
                    product.getImages().stream()
                            .map(SHOP_ProductImage::getFilePath)
                            .collect(Collectors.toList())
            );
        }

        // 카테고리
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getCategoryId());
        }

        // 최저가 및 상태
        if (product.getSellLists() != null && !product.getSellLists().isEmpty()) {
            dto.setMinPrice(
                    product.getSellLists().stream()
                            .map(SHOP_SellList::getPrice)
                            .min(Integer::compareTo)
                            .orElse(null)
            );

            boolean anySelling = product.getSellLists().stream()
                    .anyMatch(s -> "selling".equals(s.getStatus()));
            dto.setStatus(anySelling ? "selling" : "soldout");
        } else {
            dto.setMinPrice(null);
            dto.setStatus("selling");
        }

        // 등록일
        if (product.getIndate() != null) {
            dto.setIndate(product.getIndate().toString());
        }

        return dto;
    }
}
