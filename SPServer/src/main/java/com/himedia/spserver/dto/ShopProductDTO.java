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
    private Integer minPrice;
    private String firstImage;
    private Long categoryId;
    private String indate;

    private List<String> imageUrls;
    private List<ShopProductOptionDTO> options;

    public static ShopProductDTO fromEntity(SHOP_Product product) {
        ShopProductDTO dto = new ShopProductDTO();
        dto.setProductId(product.getProductId());
        dto.setTitle(product.getTitle());
        dto.setContent(product.getContent());

        if (product.getImages() != null && !product.getImages().isEmpty()) {
            dto.setFirstImage(product.getImages().get(0).getFilePath());
            dto.setImageUrls(
                    product.getImages().stream()
                            .map(SHOP_ProductImage::getFilePath)
                            .collect(Collectors.toList())
            );
        }

        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getCategoryId());
        }

        // 가격: SellList 기준 최소값
        if (product.getSellLists() != null && !product.getSellLists().isEmpty()) {
            dto.setMinPrice(
                    product.getSellLists().stream()
                            .map(SHOP_SellList::getPrice)
                            .min(Integer::compareTo)
                            .orElse(product.getPrice())
            );
        } else {
            dto.setMinPrice(product.getPrice());
        }

        if (product.getIndate() != null) {
            dto.setIndate(product.getIndate().toString());
        }

        if (product.getOptions() != null && !product.getOptions().isEmpty()) {
            dto.setOptions(
                    product.getOptions().stream()
                            .map(ShopProductOptionDTO::fromEntity)
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }
}

