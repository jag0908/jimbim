package com.himedia.spserver.dto;

import com.himedia.spserver.entity.SHOP.SHOP_SellList;
import lombok.Data;

@Data
public class ShopSellListDTO {
    private Long sellId;
    private Long productId;
    private Long optionId;
    private Integer price;
    private Long sellerId;
    private String status; // selling / soldout

    public static ShopSellListDTO fromEntity(SHOP_SellList sell) {
        ShopSellListDTO dto = new ShopSellListDTO();
        dto.setSellId(sell.getSellId());
        dto.setProductId(sell.getProduct().getProductId());
        dto.setOptionId(sell.getOption().getOptionId());
        dto.setPrice(sell.getPrice());
        dto.setSellerId(sell.getSeller().getMember_id().longValue());
        dto.setStatus(sell.getStatus());
        return dto;
    }
}
