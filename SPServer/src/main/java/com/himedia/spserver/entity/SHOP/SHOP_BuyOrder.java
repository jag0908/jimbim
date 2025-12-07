package com.himedia.spserver.entity.SHOP;

import com.himedia.spserver.entity.Member;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class SHOP_BuyOrder {

    @Id
    @GeneratedValue
    private Long orderId;

    @ManyToOne
    private SHOP_SellList sellList;

    @ManyToOne
    private Member buyer;

    private Integer purchasePrice;
}
