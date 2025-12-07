package com.himedia.spserver.dto;

import com.himedia.spserver.entity.SHOP.SHOP_Product;
import lombok.Data;

import java.util.List;

@Data
public class ShopProductDTO {

    private Long productId;
    private String title;
    private String content;
    private Integer deliveryPrice;
    private Integer viewCount;
    private Long categoryId;
    private List<String> imageUrls;

    public static ShopProductDTO fromEntity(SHOP_Product product) {
        ShopProductDTO dto = new ShopProductDTO();
        dto.setProductId(product.getProductId());
        dto.setTitle(product.getTitle());
        dto.setContent(product.getContent());
        dto.setDeliveryPrice(product.getDeliveryPrice());
        dto.setViewCount(product.getViewCount());
        dto.setCategoryId(product.getCategory().getCategoryId().longValue());
        if (product.getImages() != null) {
            dto.setImageUrls(product.getImages().stream()
                    .map(img -> img.getFilePath())
                    .toList());
        }
        return dto;
    }
}
