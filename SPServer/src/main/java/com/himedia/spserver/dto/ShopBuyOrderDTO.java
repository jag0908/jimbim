package com.himedia.spserver.dto;

import com.himedia.spserver.entity.SHOP.SHOP_BuyOrder;
import lombok.Data;

@Data
public class ShopBuyOrderDTO {
    private Long orderId;
    private Long sellId;
    private Long productId;
    private String productTitle;
    private Long optionId;
    private String optionName;
    private Long sellerId;
    private Integer purchasePrice;

    public static ShopBuyOrderDTO fromEntity(SHOP_BuyOrder order) {
        ShopBuyOrderDTO dto = new ShopBuyOrderDTO();
        dto.setOrderId(order.getOrderId());

        // SellList 정보
        if(order.getSellList() != null) {
            dto.setSellId(order.getSellList().getSellId());
            dto.setPurchasePrice(order.getPurchasePrice());
            dto.setSellerId(order.getSellList().getSeller() != null
                    ? order.getSellList().getSeller().getMember_id().longValue()
                    : null);

            // Product 정보
            if(order.getSellList().getProduct() != null) {
                dto.setProductId(order.getSellList().getProduct().getProductId());
                dto.setProductTitle(order.getSellList().getProduct().getTitle());
            }

            // Option 정보
            if(order.getSellList().getOption() != null) {
                dto.setOptionId(order.getSellList().getOption().getOptionId());
                dto.setOptionName(order.getSellList().getOption().getOptionName());
            }
        }

        return dto;
    }
}
