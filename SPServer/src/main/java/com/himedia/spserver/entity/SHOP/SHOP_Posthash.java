package com.himedia.spserver.entity.SHOP;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class SHOP_Posthash {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "post_id")
    SHOP_post post_id;

    @ManyToOne
    @JoinColumn(name = "tag_id")
    SHOP_Hashtag tag_id;
}
