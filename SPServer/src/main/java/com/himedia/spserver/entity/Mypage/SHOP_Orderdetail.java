package com.himedia.spserver.entity.Mypage;

import com.himedia.spserver.entity.SH.SH_post;
import com.himedia.spserver.entity.SHOP.SHOP_post;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class SHOP_Orderdetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer orderdetail_id;
    private Integer quantity;
    private Integer result;

//    @ManyToOne
//    @JoinColumn(name = "order_id")
//    SHOP_Order order_id;

    @ManyToOne
    @JoinColumn(name = "post_id")
    SHOP_post post_id;
}
