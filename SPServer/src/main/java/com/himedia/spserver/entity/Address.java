package com.himedia.spserver.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer address_id;
    @Column(nullable = false)
    private String address_name;
    @Column(nullable = false)
    private String address_zipnum;
    @Column(nullable = false)
    private String address_detail;
    @Column(nullable = false)
    private String address_simple;


    @ManyToOne
    @JoinColumn(name = "member_id")
    Member member;

}
