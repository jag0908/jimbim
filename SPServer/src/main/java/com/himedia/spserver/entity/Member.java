package com.himedia.spserver.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CurrentTimestamp;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Builder
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@DynamicInsert
@DynamicUpdate
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer member_id;
    @Column(nullable = false, unique = true)
    private String userid;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String pwd;
    private String profileImg;
    private String profileMsg;
    @Column(nullable = false)
    private String phone;
    @Column(nullable = false)
    private String email;
    @Column(nullable = false)
    private String rrn; //주민번호

    //@Column(nullable = false)
    @ColumnDefault("'N'")
    private String terms_agree;

    //@Column(nullable = false)
    @ColumnDefault("'N'")
    private String personal_agree;

    @Column( columnDefinition="DATETIME default now()" )
    private Timestamp indate;

    //@Column(nullable = false)
    @ColumnDefault("'0'")
    private Integer blacklist;
    // 4: red, 3: orange 2: yellow, 1: green, 0: gray

    @Column(length = 50)
    private String provider;


    // 테이블의 리스트가 아니라 단순데이터(String, Integer 등)이라고 MySQL 에 알려주는 어너테이션
    @ElementCollection(fetch = FetchType.LAZY)
    @Builder.Default
    private List<MemberRole> memberRoleList = new ArrayList<>();
}
