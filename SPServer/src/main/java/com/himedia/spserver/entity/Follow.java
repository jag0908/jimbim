package com.himedia.spserver.entity;

import com.himedia.spserver.entity.SHOP.SHOP_post;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Follow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "start_member")
    Member start_member;

    @ManyToOne
    @JoinColumn(name = "end_member")
    Member end_member;
}
