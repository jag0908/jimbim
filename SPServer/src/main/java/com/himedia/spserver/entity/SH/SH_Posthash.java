package com.himedia.spserver.entity.SH;

import com.himedia.spserver.entity.SHOP.SHOP_post;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class SH_Posthash {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "post_id")
    SH_post post_id;

    @ManyToOne
    @JoinColumn(name = "tag_id")
    SH_Hashtag tag_id;
}
