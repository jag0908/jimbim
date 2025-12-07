package com.himedia.spserver.dto;

import com.himedia.spserver.entity.SHOP.SHOP_BuyOrder;
import lombok.Data;

@Data
public class ShopBuyOrderDTO {
    private Long orderId;
    private Long sellId;
    private Long buyerId;
    private Integer purchasePrice;

    public static ShopBuyOrderDTO fromEntity(SHOP_BuyOrder order) {
        ShopBuyOrderDTO dto = new ShopBuyOrderDTO();
        dto.setOrderId(order.getOrderId());
        dto.setSellId(order.getSellList().getSellId());
        dto.setBuyerId(order.getBuyer().getMember_id().longValue());
        dto.setPurchasePrice(order.getPurchasePrice());
        return dto;
    }
}
