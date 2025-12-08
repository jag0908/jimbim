package com.himedia.spserver.dto;

import com.himedia.spserver.entity.SHOP.SHOP_ProductOption;
import lombok.Data;

@Data
public class ShopProductOptionDTO {
    private Long optionId;
    private String optionName;
    private Long productId;

    public static ShopProductOptionDTO fromEntity(SHOP_ProductOption option) {
        ShopProductOptionDTO dto = new ShopProductOptionDTO();
        dto.setOptionId(option.getOptionId());
        dto.setOptionName(option.getOptionName());
        dto.setProductId(option.getProduct().getProductId());
        return dto;
    }
}
